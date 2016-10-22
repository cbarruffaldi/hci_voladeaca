mapSetup = function(global){

	var mapUtils = {};
	
	mapUtils.markers = [];

	var map;
	mapUtils.current = "";

   	function initMap() {
   	map = new google.maps.Map(document.getElementById('map'), {
   		center: {lat: 0, lng: 0},
   		zoom: 2
	   });
	
	function updateMap(id, date){
		clearMarkers();

		$http({
			method: 'GET',
			url:  "http://hci.it.itba.edu.ar/v1/api/geo.groovy?method=getcitybyid&id=" + id;
		}).then( function(response) { 
			fillMap(response, date);
		})

		/*
		$.ajax({ url: "http://hci.it.itba.edu.ar/v1/api/geo.groovy?method=getcitybyid&id=" + id + "&callback=mapUtils.updateCity",
				 dataType: "jsonp"});


		$.ajax({
						 url: "http://hci.it.itba.edu.ar/v1/api/booking.groovy?method=getflightdeals&from=" + id + "&callback=mapUtils.fillMap",
						 dataType: "jsonp"
						});
		*/
	}


		function updateCity(response){
			if(response.city){
				$("#tit").text("Ofertas saliendo desde " + response.city.name);
				mapUtils.current = response.city.name;
			}
			else{
				$("#tit").text("No encontramos resultados");
				mapUtils.current = null;
			}
		}


		function fillMap(response, date){
			var deals = response.deals;

			var info;
			var details = {};

			console.log(deals);
			for(var i in deals){
				info = deals[i].city
				details['lat'] = info.latitude;
				details['lgt']= info.longitude;
			
				details['info'] = { name: info.name,
									country: info.country,
									id: info.id,
									price: deals[i].price
								  };

				details['date'] = date;

				addMarker(details);
			}

		}

		function addMarker(details){
			var deferred = $q.defer();

			
			var minPrice = details['info'].price;


			function petition(date){

			}

			function fin(){ 

			var contentString = "<strong>" + details['info'].name + "</strong>" + "<br />"
								+ "<strong>Precio: </strong>" +  details['info'].price + "<br />"
								+ "<a href='#' class='markerLink' \
										data-cityID='" + details['info'].id + "' + onclick='searchPromo(this)'>Buscar!</a>"; 

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

			var point = {lat: details.lat, lng: details.lgt}
			var marker = new google.maps.Marker({
	    	position: point,
	    	map: map,
	    	icon: img
		  	//  title: details.info.name;
		  	});

			}
		
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
		
	//mapUtils.updateMap("BUE");

	} //initMap

	mapUtils.initMap = initMap;
	global.mapUtils = mapUtils;

};
