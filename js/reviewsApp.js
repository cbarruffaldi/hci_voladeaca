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

	$scope.starChange = function(){
		var cant = 6;

		var acum = getSliderValue('friendliness-slider');
		acum += getSliderValue('food-slider');
		acum += getSliderValue('comfort-slider');
		acum += getSliderValue('quality-slider');
		acum += getSliderValue('punctuality-slider');
		acum += getSliderValue('mileage-slider');
		acum = acum/6;

		$scope.calculatedStars = $sce.trustAsHtml("" + acum.toFixed(2) + "  " + $scope.getStars(acum));

	}

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


	function clearErrors() {
		$("#nroVuelo").removeClass("inputerr");
		$("#input-aerolinea").removeClass("inputerr");
		$("aerolinea-err").val("");
		$("nroVuelo-err").val("");
		$("#nroVuelo-err").hide();
		$("#aerolinea-err").hide();
		$scope.emptySearch = false;
		$scope.noConnection = false;
	}


	$scope.search = function(){
		clearErrors();

		$scope.noConnection = false;

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
				$("#aerolinea-err").text("Ingrese una aerolínea válida");
				$("#aerolinea-err").show();
				return;
			}
			URL += "&airline_id=" + name;
		}else if($("#nroVuelo").val()){
				var rgx = new RegExp("^[0-9]+$");
				if(!rgx.test($("#nroVuelo").val())) {
					$("#nroVuelo").addClass("inputerr");
					$("#nroVuelo-err").text("Ingrese un número");
					$("#nroVuelo-err").show();
					return;
				}
		} else {
				$("#nroVuelo").addClass("inputerr");
				$("#nroVuelo-err").text("Debe ingresar un número de vuelo");
				$("#nroVuelo-err").show();
				
				$("#input-aerolinea").addClass("inputerr");
				$("#aerolinea-err").text("Debe ingresar un aerolínea");
				$("#aerolinea-err").show();

				return;
		}



		$http({
			method: 'GET',  				  
			url: URL,
			timeout: 2500
		}).then(function successCallback(response){
			var added = {};
			$scope.emptySearch = true;
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
			$scope.emptySearch = $scope.reviewResults.length < 1;

			$scope.flightResults = Object.keys(added).map(function (key) { return added[key]; });
			scrollTo("reviewRes");
		}, function errorCallback(){
				$scope.noConnection = true;
				scrollTo("reviewRes");
		})
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


	$scope.toggleToFNum = function(){
		clearErrors();
		$scope.numSearch = true;
		$('ul.tabs li').removeClass('current');
		$('#vuelotab').addClass('current');
		$("#vuelobox").addClass('current');
		$("#aerobox").removeClass('current');
		$("#aerotitle").html("Aerolínea (<em>opcional<em>):");
		$("#input-aerolinea").val("");

	};

	$scope.toggleToAero = function(){
		clearErrors();
		$scope.numSearch = false;
		$("#aerotitle").html("Aerolínea:");
		$('ul.tabs li').removeClass('current');
		$('#aerotab').addClass('current');
		$("#vuelobox").removeClass('current');
		$("#aerobox").addClass('current');

		$("#nroVuelo").val("");
		$("#nroVuelo").trigger("change");
	};


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
			$('.comment-area').addClass("comment-err");
			$('.comment-area .err-msg').fadeIn();
			valid = false
		}

		if (!send.flight || !send.flight.airline.id) {
			$('.airline-input').addClass("input-err");
			$('.airline-input .err-msg').fadeIn();
			valid = false
		}

		if (!send.flight || !send.flight.number) {
			$('.number-input').addClass("input-err");
			$('.number-input .err-msg').fadeIn();
			valid = false
		}
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
			showSendingMessage(send);
			$.ajax({
				type: "POST",
				contentType: 'application/json',
				url: 'http://hci.it.itba.edu.ar/v1/api/review.groovy?method=reviewairline',
				data: JSON.stringify(send)
			}).then(function(response){
				console.log(response)
				messageSent()
			});

			console.log(send)
			console.log(JSON.stringify(send))
		}
	};
	
	function showSendingMessage(msg) {
		$('#leaveReviewModal').modal('toggle')
		$('#sendingModal').modal({backdrop: 'static', keyboard: false})
		$('#sendingModal .sending-msg').text("Enviando reseña para el vuelo " + send.flight.airline.id + send.flight.number)
	}

	function messageSent() {
		$('#sendingModal').modal('toggle')
		$('#reviewSent').modal('toggle')
	}

	$scope.yesRec = function(rec){
		$scope.yesRecommend = rec;
		if(rec){
			$("#no_rec").removeClass('selected')
			$("#yes_rec").addClass('selected')
		}else{
			$("#yes_rec").removeClass('selected')
			$("#no_rec").addClass('selected')
		}
	}
});

$(document).on('click', '.airline-input', function() {
	$(this).removeClass("input-err");
	$('.airline-input .err-msg').fadeOut()
});

$(document).on('click', '.number-input', function() {
	$(this).removeClass("input-err");
	$('.number-input .err-msg').fadeOut()
});

$(document).on('click', '.comment-area', function() {
	$(this).removeClass("comment-err");
	$('.comment-area .err-msg').fadeOut()
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
		initSlider(attrs.id);
	};
});
