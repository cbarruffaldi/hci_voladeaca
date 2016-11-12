var mapSetup = function (global){

	var mapUtils = {};
	
	mapUtils.markers = [];

	var map;
	mapUtils.current = "";

   	function initMap() {
   	map = new google.maps.Map(document.getElementById('map'), {
   		center: {lat: 0, lng: 0},
   		zoom: 2
	   });
	
	}

	function updateMap(id, date){
		clearMarkers();
		console.log(date);

	/*	$("#map").hide();
		$("#maploading").show();
		$("#search").attr("disabled", true);
		$("#search").addClass("disabled");
*/


		$http({
			method: 'GET',
			url:  "http://hci.it.itba.edu.ar/v1/api/booking.groovy?method=getflightdeals&from=" + id
		}).then( function(response) { 
			fillMap(response.data, date, id);
		});

	}


	
	function updateCity(response){
			if(response.city){
				$("#tit").text("Ofertas saliendo desde " + response.cityname);
				mapUtils.current = response.city.name;
			}
			else{
				$("#tit").text("No encontramos resultados");
				mapUtils.current = null;
			}
	}


	function fillMap(response, date, from){
			var deals = response.deals;
			var promises = []
			console.log(deals);
			for(var i in deals){
				var details = {};
				details['lat'] = deals[i].city.latitude;
				details['lgt']= deals[i].city.longitude;
			
				details['info'] = { name: deals[i].city.name,
									id: from,
									country: deals[i].city.country,
									price: deals[i].price,
									to: deals[i].city
								  };

				details['date'] = date;

				promises.push(addMarker(details));
			}

/*			$q.all(promises).then(function(response){
			$("#map").show();
			$("#maploading").hide();
			$("#search").attr("disabled", false);
			$("#search").removeClass("disabled");
	});*/
	}

		function addMarker(details){

			var minPrice = details['info'].price;

			petition(details['date'], 7, details);

			function petition(date, tries, details){
				var dateStr = date.format("YYYY-MM-DD");

				var URL = "http://hci.it.itba.edu.ar/v1/api/booking.groovy?method=getonewayflights";
				URL += "&from=" + details['info'].id + "&to=" + details['info'].to.id + "&adults=1&children=0&infants=0&dep_date=" + dateStr;

				if(tries < 1){
					//No deberia llegar aca
					console.log("tryout");
					return;
				}
				
					$.ajax({
    				    url: URL +"&callback=?",
        				dataType: "jsonp",
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

			mapUtils.markers.push(marker);
		
		}
		
		return;
		}


		function clearMarkers(){
			for(var i in mapUtils.markers){
				mapUtils.markers[i].setMap(null);
			}
		}

	//le expongo los metodos a mapUtils	
	mapUtils.fillMap = fillMap;
	mapUtils.updateMap = updateMap;
	mapUtils.updateCity = updateCity;

	$("#maploading").hide();

	mapUtils.initMap = initMap;
	window.mapUtils = mapUtils;

};


	mapSetup(window);
	$acUtils.load().then(function() {
		formSetup();
	});

	function formSetup(){
		new Awesomplete(document.getElementById("inputCity"), {
		list: $acUtils.airportList,
		minChars: 1,
		autoFirst: true}
		);
	

	$( "#datepicker" ).datepicker({minDate: +2});





	function update(){
		if(validate(true, true, true)){
			
			var city = $("#inputCity").val()
			var date = moment($("#datepicker").val(), "DD/MM/YYYY", true);

			mapUtils.updateMap($acUtils.id_map[city], date);
		}

	}

	function validate(city, date, emptyCheck){
		var val = true;
		if(city){
			var textbox = $("#inputCity");

			textbox.removeClass('inputerr');
			var error = $("#air-error");

			error.fadeOut();

			if(textbox.val()){
				if(!$acUtils.id_map[textbox.val()]){
					textbox.addClass('inputerr');
					error.text("Por favor ingrese algo valido");
					error.fadeIn();
					val = false;
				}
			}
			else if(emptyCheck){
				textbox.addClass('inputerr');
				error.text("Esto no puede quedar vacío");
				error.fadeIn();
				val = false;
			}
		}
		
		if(date){
			var picker = $("#datepicker");
			picker.removeClass('inputerr');
			var picker_err = $("#datepicker-err");
			picker_err.fadeOut();

			if(picker.val() || emptyCheck){
				var picked = moment(picker.val(), "DD/MM/YYYY", true);
				if(!picked.isValid()){
					picker.addClass('inputerr');
					val = false;
					picker_err.text("Ingrese una fecha valida");
					picker_err.fadeIn();
				}
				if(val){
					var now = moment();
					if(picked.diff(now, 'days') + 1 < 2){
						val = false;
						picker.addClass('inputerr');
						picker_err.text("Debe ser por lo menos dos días desde ahora");
						picker_err.fadeIn();
					}
				}
		}
	}

		return val;
	}


	$("#inputCity").on('focus', function(){
		var self = $(this);
		if(self.val()){
			self.addClass('x');
		}
		if(self.hasClass('inputerr')){
			//	self.val("");
			self.removeClass('inputerr');
			//	self.removeClass('x');
			var errid = '#air-error';
			$(errid).fadeOut();
		}
	});


	$("#inputCity").on('blur', function(){
		validate(true);	
		var self = $(this);
		if(! self.val()){
			self.removeClass('x');
		}	
	})



	$("#datepicker").on('change', function(event){
		validate(false,true);	
		var self = $(this);
		if(! self.val()){
			self.removeClass('x');
		}	
	})



	$("#inputCity").keypress(function(event) {
	 	  if (event.which == 13) {
	        event.preventDefault();
	        update();
	    }
	});

	
		$("#search").on('click', function(){
			update();
		})
	}


