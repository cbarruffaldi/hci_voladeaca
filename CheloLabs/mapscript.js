var app = angular.module("mapApp", []);

app.controller('mapCtrl', function($scope, $http, $q){

	$acUtils.load().then(function() {
		formSetup();
		mapSetup(window);
	});

	function formSetup(){
		new Awesomplete(document.getElementById("inputCity"), {
		list: $acUtils.airportList,
		minChars: 1,
		autoFirst: true}
		);
	

	$( "#datepicker" ).datepicker({minDate: +2, showAnim: ""});





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

	//$("#datepicker").on('blur', function(){
	//	validate(false, true);		
	//})

	$("#inputCity").keypress(function(event) {
	 	  if (event.which == 13) {
	        event.preventDefault();
	        update();
	    }
	});

	//	$("#inputCity").on('change', function() {
	//									mapUtils.updateMap($acUtils.id_map[$(this).val()]);
	//								});
	
		$("#search").on('click', function(){
			update();
		})
	}


function mapSetup(global){

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
		console.log(date);
		$http({
			method: 'GET',
			url:  "http://hci.it.itba.edu.ar/v1/api/booking.groovy?method=getflightdeals&from=" + id
		}).then( function(response) { 
			fillMap(response.data, date);
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

			petition(date);

			function petition(date){
				$http.
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


});