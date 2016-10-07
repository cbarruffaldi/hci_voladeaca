(function(global){

$("#ciudad").keypress(function(event) {
    if (event.which == 13) {
        event.preventDefault();
		updateMap($(this).val());  
    }
});
	
	global.markers = [];

	var map;
   	function initMap() {
   	map = new google.maps.Map(document.getElementById('map'), {
   	center: {lat: 25.12, lng: -24.51},
   	zoom: 2
	   });
	}

	function updateMap(id){
		clearMarkers();
		
		$.ajax({ url: "http://hci.it.itba.edu.ar/v1/api/geo.groovy?method=getcitybyid&id=" + id + "&callback=updateCity",
				 dataType: "jsonp"});


		var req = "http://hci.it.itba.edu.ar/v1/api/booking.groovy?method=getflightdeals&from=" + id
		$.ajax({
						 url: req + "&callback=fillMap",
						 dataType: "jsonp"
						});
	}


		function updateCity(response){
			if(response.city){
				$("#tit").text("Ofertas saliendo desde " + response.city.name);
			}
			else{
				$("#tit").text("No encontramos resultados");
			}
		}

		function fillMap(response){
			console.log(response);
			var deals = response.deals;

			var info;
			var details = {};

			for(var i in deals){
				info = deals[i].city
				details['lat'] = info.latitude;
				details['lgt']= info.longitude;
			
				details['info'] = { name: info.name,
									country: info.country,
									price: deals[i].price
								  };

				addMarker(details);
			}

		}

		function addMarker(details){


			var point = {lat: details.lat, lng: details.lgt}
			var marker = new google.maps.Marker({
	    	position: point,
	    	map: map,
		  //  title: details.info.name;
		  	});


			var contentString = "<strong>" + details['info'].name + "</strong>" + "<br />"
								+ "<strong>Precio: </strong>" +  details['info'].price + "<br />"
								+ "<a href='#'>Buscar!</a>"; 

			var infowindow  = new google.maps.InfoWindow({
	    				content: contentString
						  });


			  marker.addListener('click', function() {
	    		infowindow.open(map, marker);
	  		});

			  infowindow.addListener('blur', function(){
			  	this.close()
			  })

			markers.push(marker);
		}


		function clearMarkers(){
			for(var i in markers){
				markers[i].setMap(null);
			}
		}

	//le expongo los metodos a global	
	global.initMap = initMap;
	global.fillMap = fillMap;
	global.updateMap = updateMap;
	global.updateCity = updateCity;
})(window);
