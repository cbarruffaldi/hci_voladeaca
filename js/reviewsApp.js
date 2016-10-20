var app = angular.module("reviewsApp", ['ngAnimate', 'infinite-scroll']);

app.controller("reviewsCtrl", function($scope, $http, $sce, $window) {
	$scope.scrollLimit = {details: 10, reviews: 5}
	$scope.reviewResults = [];
	$scope.flightResults = [];

	$scope.flightSelected;
	var selectedDetails = {};

	$scope.getStars = function(score){
		ret = "";
		for(var i = 1 ; i <= 5; i++){
			if(2*i <= score){
				ret += '<span class="star on"></span>'
			}else if(2*i - 1 <= score){
				ret += '<span class="star half"></span>'	
			}
			else{
				ret += '<span class="star"></span>'
			}
		}
		return $sce.trustAsHtml(ret);
	}

	$scope.selectFlight = function (f){
		selectedDetails = {number: f.flight.number, airline: f.flight.airline.id};
		$scope.flightSelected = true;
	}

	$scope.deselectFlight = function(){
		$scope.flightSelected = false;
	}

	$scope.search = function(){
		while(!$scope.airlineData); //Jaja
		$scope.reviewResults = [];
		$scope.flightResults = [];
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
  					var added = {};
  					for(var i in response.data.reviews){
  						var r = response.data.reviews[i];
  						var rid = r.flight.airline.id + r.flight.number;
  						if(added[rid]){
  							added[rid].merge(r);
  						} else {
  							added[rid] = new ReviewDetails(r);
  						}
  						r.comments = decodeURIComponent(decodeHtml(r.comments));
  						$scope.reviewResults.push(r);
  						
  					}
					$scope.flightResults = Object.keys(added).map(function (key) { return added[key]; });
					scrollTo("reviewRes");
		});
	}

	function scrollTo(id){
    $('html,body').animate({
        scrollTop: $("#"+id).offset().top - 100},
        'slow');
	}	

	function decodeHtml(html) {
    	var txt = document.createElement("textarea");
    	txt.innerHTML = html;
    	return txt.value;
	}

	$scope.filterReviews = function(r){
		return (r.flight.number == selectedDetails.number) && (r.flight.airline.id == selectedDetails.airline);
	}

	function ReviewDetails(seed){
		var self = this;
			this.flight = $.extend(true, {}, seed.flight);
			this.rating = $.extend(true, {}, seed.rating);
//		this.flight = JSON.parse(JSON.stringify(seed.flight));
//		this.rating = JSON.parse(JSON.stringify(seed.rating));
		this.totalReviews = 1;
		this.wouldRecommendCount = seed.yes_recommend ? 1 : 0;

		this.merge = function(other){
			self.rating.comfort = (self.rating.comfort + other.rating.comfort)/2.0			
			self.rating.food = (self.rating.food + other.rating.food)/2.0			
			self.rating.friendliness = (self.rating.friendliness + other.rating.friendliness)/2.0			
			self.rating.mileage_program = (self.rating.mileage_program + other.rating.mileage_program)/2.0			
			self.rating.overall = (self.rating.overall + other.rating.overall)/2.0			
			self.rating.punctuality = (self.rating.punctuality + other.rating.punctuality)/2.0;
			self.rating.quality_price = (self.rating.quality_price + other.rating.quality_price)/2.0;
			self.totalReviews++;
			self.wouldRecommendCount += other.yes_recommend ? 1: 0;

		}	
	}


	$scope.loadMore = function(which){
			$scope.scrollLimit[which] += 5;
		}

		$('#vuelotab').click(function(){
		$('ul.tabs li').removeClass('current');
		$(this).addClass('current');
		$("#vuelobox").addClass('current');
		$("#aerobox").removeClass('current');
		$("#aerotitle").html("Aerolínea (<em>opcional<em>):");
		})

	$('#aerotab').click(function(){
		$("#aerotitle").html("Aerolínea:");
		$('ul.tabs li').removeClass('current');
		$(this).addClass('current');
		$("#vuelobox").removeClass('current');
		$("#aerobox").addClass('current');

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
	
	function getSliderValue(id){
		var slider = document.getElementById(id);
		return parseInt(slider.noUiSlider.get());
	}

	$scope.send = function(){
		send = {};
		rating = {};
		rating.friendliness = getSliderValue('friendliness-slider');
		rating.food = getSliderValue('food-slider');
		rating.comfort = getSliderValue('comfort-slider');
		rating.quality_price = getSliderValue('quality-slider');
		rating.punctuality = getSliderValue('punctuality-slider');
 		rating.mileage_program = getSliderValue('mileage-slider');

 		send.rating = rating;
 		send.yes_recommend = true;
 		send.comments = $("#rating-comments").val();

 		send.flight = {
 			airline: {id: selectedDetails.airline},
 			number: selectedDetails.number
 		}

 		console.log(send);
 		console.log(JSON.stringify(send));

		$.ajax({
		  type: "POST",
		  	url: 'http://hci.it.itba.edu.ar/v1/api/review.groovy?method=reviewairline',
  			data: JSON.stringify(send)
		}).then(function(response){
			console.log(response);
		});

		};

});