var app = angular.module("reviewsApp", ['ngAnimate', 'infinite-scroll']);

app.directive('setReviewColors', function() {
	return function(scope) {
		if (scope.$last) setTimeout(function(){
			$(".ratings .rate-num").each(function() {
				var rate = parseFloat($(this).text());
				if (rate < 6)
					$(this).addClass("red");
				else if (rate < 8)
					$(this).addClass("orange");
				else 
					$(this).addClass("green");
			})     
		}, 1);
	};
});

app.controller("reviewsCtrl", function($scope, $http, $sce, $window) {
	$scope.scrollLimit = {details: 10, reviews: 5}
	$scope.reviewResults = [];
	$scope.flightResults = [];
	$scope.flightSelected = false;
	var selectedDetails = {};



	$scope.yesRecommend = true;

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

	$scope.getSelectedFlightName = function(){
		if(!$scope.airlineData){
			return "";
		}
		return $scope.flightName(selectedDetails.airline, selectedDetails.number);
	}

	$scope.flightName = function(id, number){
		return $scope.airlineData.name_map[id] + " #" + number;
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
			var name = $scope.airlineData.id_map[$("#input-aerolinea").val()];
			if(!name){
				$("#input-aerolinea").addClass("inputerr");
				$("#aerolinea-err").text("Ingrese una fecha valida");
				return;
			}
			URL += "&airline_id=" + name;
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

	$scope.triggerForm = function(event){
		console.log(event);
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
		$scope.airlineData = airlineData
		console.log($scope.airlineData)			
	}

	function getSliderValue(id){
		var slider = document.getElementById(id);
		return parseInt(slider.noUiSlider.get());
	}

	$window.validateInput = function(){
		//$scope.search();
	}

	function validateReview(send) {
		valid = true;
		if (send.comments == '') {
			$('.bubble').addClass("comment-err");
			console.log("INVALID COMMENT")
			valid = false
		}

		if (!send.flight || !send.flight.airline.id) {
			$('#input-aerolinea-rev').addClass("input-err");
			console.log("INVALID AIRLINE")
			valid = false
		}

		if (!send.flight || !send.flight.number) {
			$('input-number-rev').addClass("input-err");
			console.log("INVALID FL NUMBER")
			valid = false
		}
		console.log("VALID REVIEW: " + valid)
		return valid
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
		send.yes_recommend = $scope.yesRecommend;
		send.comments = $("#rating-comments").val();

		if($scope.flightSelected){
			send.flight = {
				airline: {id: selectedDetails.airline},
				number: selectedDetails.number
			}
		}
		else{
			send.flight = {
				airline : {id: $scope.airlineData.id_map[$("#input-aerolinea-rev").val()]},
				number: parseInt($("#input-number-rev").val())
			}
		}

		if (validateReview(send)) {
			$.ajax({
				type: "POST",
				contentType: 'application/json',
				url: 'http://hci.it.itba.edu.ar/v1/api/review.groovy?method=reviewairline',
				data: JSON.stringify(send)
			}).then(function(response){
				console.log(response);
			});

			console.log(send);
			console.log(JSON.stringify(send));
		}
	};


	$scope.yesRec = function(rec){
		$scope.yesRecommend = rec;
		if(rec){
			$("#no_rec").removeClass('selected');
			$("#yes_rec").addClass('selected');
		}else{
			$("#yes_rec").removeClass('selected');
			$("#no_rec").addClass('selected');
		}
	}
});

$(document).on('click', '#input-aerolinea-rev', function() {
	console.log("removing")
	$(this).removeClass("input-err");
});

$(document).on('click', '#input-number-rev', function() {
	console.log("removing")
	$(this).removeClass("input-err");
});

app.directive('myEnter', function () {
	return function (scope, element, attrs) {
		element.bind("keydown keypress", function (event) {
			if(event.which === 13) {
				scope.$apply(function (){
					scope.search()
				});

				event.preventDefault();
			}
		});
	};
});

app.directive('reviewAutocomplete', function () {
	return function (scope, element, attrs) {
		new Awesomplete(document.getElementById(attrs.id), {
			list: scope.airlineData.list,
			minChars: 1,
			autoFirst: true}
									 );
	};
});



function initSlider(id){
	var handlesSlider = document.getElementById(id);
	noUiSlider.create(handlesSlider, {
		start: [5],
		//snap: true,
		step: 1,
		//behaviour: 'tap',
		tooltips: [wNumb({decimals:0})],
		range: {
			'min': 1,
			'max': 10
		},

		pips: {
			mode: 'positions',
			stepped: true,
			values: [0,100],
			density: 11
		}

		//step: minPrice - maxPrice,
	});
}

app.directive('vdaSlider', function () {
	return function (scope, element, attrs) {
		console.log(attrs.id);
		initSlider(attrs.id);
	};
});
