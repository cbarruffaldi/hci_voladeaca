var app = angular.module("reviewsApp", ['ngAnimate', 'infinite-scroll']);

app.controller("reviewsCtrl", function($scope, $http, $window) {
	$scope.scrollLimit = 5;
	$scope.results = [];

	$scope.search = function(){
		while(!$scope.airlineData); //Jaja
		$scope.results = [];
		var URL = 'http://hci.it.itba.edu.ar/v1/api/review.groovy?method=getairlinereviews';
  				if($("#nroVuelo").val()){
  					URL += '&flight_number=' + $("#nroVuelo").val();
  				}
  				if($("#input-aerolinea").val()){
  				  URL += "&airline_id=" + $scope.airlineData.id_map[$("#input-aerolinea").val()];
  				}
  				  console.log(URL);
	
		$http({
			 	method: 'GET',  				  
			 	url: URL,
			 }).then(function successCallback(response){
  					console.log(response);
  					for(var i in response.data.reviews){
  					//	var review = new ReviewDetails(response.data.reviews[i]);
  						$scope.results.push(response.data.reviews[i]);
  					}
		});

		}

	

	$scope.filterReviews = function(r){
		console.log(r)
		console.log($("#nroVuelo").val())
		if($("#nroVuelo").val()){
			return ('' + r.flight.number).indexOf($scope.nrovuelo) >= 0
		}
		return true;
	}
	function ReviewDetails(data){

	}


	$scope.loadMore = function(){
			$scope.scrollLimit += 5;
		}

		$('#vuelotab').click(function(){
		$('ul.tabs li').removeClass('current');
		$(this).addClass('current');
		$("#vuelobox").addClass('current');
		$("#aerotitle").html("Aerolínea (<em>opcional<em>):");
	})

	$('#aerotab').click(function(){
		$("#aerotitle").html("Aerolínea:");
		$('ul.tabs li').removeClass('current');
		$(this).addClass('current');
		$("#vuelobox").removeClass('current');
		$("#nroVuelo").val("");
		$("#nroVuelo").trigger("change");
	})

	
	function fillAirlines(){
		 return	$.ajax({
			 	//method: 'GET',
			 	dataType: "jsonp",
  				url: 'http://hci.it.itba.edu.ar/v1/api/misc.groovy?method=getairlines&callback=?'}
  				).done(function successCallback(response){
					var airlineData = { list: [], id_map: {}, name_map: {}, logo_map: {}};
					console.log(response);
					for(var i in response.airlines){
						airlineData.list.push(response.airlines[i].name);
						airlineData.id_map[response.airlines[i].name] = response.airlines[i].id;
						airlineData.name_map[response.airlines[i].id] = response.airlines[i].name;
						airlineData.logo_map[response.airlines[i].id] = response.airlines[i].logo;

					}
				localStorage.setItem('airlineData', JSON.stringify(airlineData));
		});


		}
	

	if(!localStorage.airlineData){
		fillAirlines().done(initAutocomplete)
	}
	else{
		initAutocomplete();
	}


	function initAutocomplete(){
			var airlineData = JSON.parse(localStorage.airlineData);
			console.log(airlineData.list)
			new Awesomplete(document.getElementById("input-aerolinea"), {
				list: airlineData.list,
				minChars: 1,
				autoFirst: true}
			);

			$scope.airlineData = airlineData
			console.log($scope.airlineData)			
	}


});