(function(global){

	var mapUtils = {};
	
	mapUtils.markers = [];

	var map;
	mapUtils.current = "";

   	function initMap() {
   	map = new google.maps.Map(document.getElementById('map'), {
   		center: {lat: 0, lng: 0},
   		zoom: 2
	   });

   	console.log(map);
	
	function updateMap(id, date){
		clearMarkers();
		$("#maperror").addClass("hidden");
		$("#maploading").show();
		$("#search").attr("disabled", true);
		$("#search").addClass("disabled");

		
		$.ajax({
						 url: "http://hci.it.itba.edu.ar/v1/api/booking.groovy?method=getflightdeals&from=" + id + "&callback=?",
						 dataType: "jsonp",
						 timeout: 5000,
						 success: function(response){
						 	fillMap(response, id, date);
						 },
						 error: function(){
						 	$("#maploading").hide();
							$("#search").attr("disabled", false);
							$("#search").removeClass("disabled");
						 	$("#maperror").removeClass("hidden");
						 }
						});
	}


		
		function fillMap(response, from, date){
			//$("#map").hide();

			var deals = response.deals;

			var promises = [];
			for(var i in deals){
				var details = {};
				
				info = deals[i].city
				details['lat'] = info.latitude;
				details['lgt']= info.longitude;
			
				details['info'] = { name: info.name,
									country: info.country,
									id: from,
									price: deals[i].price,
									to: deals[i].city
								  };

				details['date'] = date;


				promises.push(addMarker(details));
			}

			$.when.apply($, promises).done(function() {
					$("#maploading").hide();
					$("#search").attr("disabled", false);
					$("#search").removeClass("disabled");
					});
		}


		function addMarker(details){
			return $.Deferred( function(deferred){

					var minPrice = details['info'].price;

					petition(details['date'], 7, details);

					function petition(date, tries, details){
						var dateStr = date.format("YYYY-MM-DD");

						var URL = "http://hci.it.itba.edu.ar/v1/api/booking.groovy?method=getonewayflights";
						URL += "&from=" + details['info'].id + "&to=" + details['info'].to.id + "&adults=1&children=0&infants=0&dep_date=" + dateStr;

						if(tries < 1){
							//No deberia llegar aca
							console.log("tryout");
							deferred.reject();
							return;
						}
						
							$.ajax({
		    				    url: URL +"&callback=?",
		        				dataType: "jsonp",
		        				timeout: 5000,
		     				   success: function(response){
								if(response.total > 0){
									var price = response.filters[2].min;
									if(price == minPrice){
									fin(date, details);
									return;
									}
								}
								var ndate = moment(date);
								ndate.add(1,'days');
								petition(ndate, tries-1, details);				
								},
								error: function(){
									console.log(deferred)
									deferred.reject();
								 	$("#maploading").hide();
									$("#search").attr("disabled", false);
									$("#search").removeClass("disabled");
								 	$("#maperror").removeClass("hidden");
									return;
								}

		        			});
					}


					function fin(date, details){

					var dateStr = date.format("YYYY-MM-DD");
					var URL = "./search3.html?date=" + dateStr;
						URL += "&orig=" + details['info'].id + "&dest=" + details['info'].to.id + "&adults=1&children=0&infants=0&promo=true";

					var point = {lat: details.lat, lng: details.lgt}
					var marker = new google.maps.Marker({
				    	position: point,
			    		map: map,
			    		icon: "img/paper-marker-sm.png"
				  		//  title: details.info.name;
				  	});

					dateStr = date.format("DD/MM/YYYY");
					var contentString = "<span class='iw-title'><strong>" + details['info'].name + "</strong></span><br />"
										+ "Desde  <strong>USD " +  details['info'].price + "</strong> por adulto saliendo el " + dateStr + "<br />"
										+ "<a href='"+ URL + "'>¡Buscar!</a>"; 

					var infowindow  = new google.maps.InfoWindow({
			    				content: contentString
								  });



					marker.addListener('click', function() {
					  	if(mapUtils.infow){
					  		mapUtils.infow.close();
					  	}
			    		infowindow.open(map, marker);
			    		mapUtils.infow = infowindow;
				  		});

					deferred.resolve();
					mapUtils.markers.push(marker);
				
				}
			}).promise();
		}

		function clearMarkers(){
			for(var i in mapUtils.markers){
				mapUtils.markers[i].setMap(null);
			}
		}

	mapUtils.fillMap = fillMap;
	mapUtils.updateMap = updateMap;
		
	//mapUtils.updateMap("BUE");


	$("#maploading").hide();
	} //initMap

	mapUtils.initMap = initMap;
	global.mapUtils = mapUtils;

})(window);
