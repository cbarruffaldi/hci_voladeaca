var app = angular.module("flightApp", ['ngAnimate', 'infinite-scroll']);

app.directive('emitLastRepeaterElement', function() {
	return function(scope) {
		 if (scope.$last) setTimeout(function(){
                scope.$emit('LastRepeaterElement');
     }, 1);
	};
});

app.controller("flightCtrl", function($scope, $http, $window) {
		$scope.twoWays = false;
		$scope.containers = [] 
		$scope.scrollLimit = 10;
		$scope.orderBy = {criterion: 'price', reversed: false}

		$scope.updatePax = $window.passengers.update;

		$scope.getFlightBox = function(){
			return $scope.twoWays ? "flight-box" : "oneway-flight-box";
		}

		function fillAirlines(){
		 return	$http({
			 	method: 'GET',
  				url: 'http://hci.it.itba.edu.ar/v1/api/misc.groovy?method=getairlines'}
  				).then(function successCallback(response){
					$scope.airlineLogos = {};
					for(var i in response.data.airlines){
						$scope.airlineLogos[response.data.airlines[i].id] = response.data.airlines[i].logo;
					}
				localStorage.setItem('airlineLogos', JSON.stringify($scope.airlineLogos));
		});

		}
		

		$scope.getLogo = function(id){
			return $scope.airlineLogos[id];
		}

		function fetch(){
			$selectedFlight = {};

			var orig = getURLParameter("orig");
			var dest = getURLParameter("dest");
			var date = getURLParameter("date");
			var adults = getURLParameter("adults");
			var children = getURLParameter("children");
			var infants = getURLParameter("infants");
			var vdate = getURLParameter("vdate");

			$scope.twoWays = vdate ? true : false;
			$selectedFlight.twoWays = $scope.twoWays;

			if(!(orig && dest && date && (adults || children || infants))){
				$scope.emptySearch = true;
				$scope.paramError = true;
				$(".filter-area").addClass("greyout");
				$(".currency-menu").addClass("greyout");
				$(".order-by-menu").addClass("greyout");
				$(".currency-menu button").attr("disabled", true);
				$(".order-by-menu button").attr("disabled", true);
				$("#loadImg").hide();
				console.log("Param error");
				return;
			}

			var baseURL = "http://hci.it.itba.edu.ar/v1/api/booking.groovy?method=getonewayflights"
			baseURL += "&adults=" + (adults ? adults : 0);
			baseURL += "&children=" + (children ? children : 0);
			baseURL += "&infants=" + (infants ? infants : 0);

			var URL = baseURL + "&dep_date=" + date;
				URL += "&from=" + orig;
				URL += "&to=" + dest;


			$selectedFlight.passengers = {adults: adults ? parseInt(adults):0,
												children: children ? parseInt(children):0,
												infants: infants ? parseInt(infants) : 0,
												total: parseInt(adults )+parseInt(children)+ parseInt(infants)};

			$http({
 				method: 'GET',
  				url: URL
			}).then(function successCallback(response) {
					if(vdate){
						var vURL = baseURL + "&dep_date=" + vdate;
							vURL += "&from=" + dest;
							vURL += "&to=" + orig;

						$http({
							method: 'GET',
							url: vURL
						}).then(function success(vresponse){
							process(response, vresponse);
							$("#resultShow").show();
							$("#loadImg").hide();
						},
							function errorCallback(response){
								console.log("Error in response");
							}
						)
					}
					else {
						console.log(response);
						process(response);
						$("#resultShow").show();
						$("#loadImg").hide();
					}
  			}, function errorCallback(response) {
    				console.log("Error in response");
    		});

		}

		$scope.loadMore = function(){
			$scope.scrollLimit += 5;
		}

		$scope.buy = function(container){
			localStorage.removeItem('boughtFlight');

			$selectedFlight.container = container;
			sessionStorage.setItem('boughtFlight', JSON.stringify($selectedFlight));

			if(localStorage.boughtFlight){
				console.log("Have one in local");
				localStorage.setItem('boughtFlight', JSON.stringify($selectedFlight));
			}

			localStorage.setItem('boughtFlight', JSON.stringify($selectedFlight));
			window.location.href = "checkout2.html";


		}


		$scope.filterFn = function myFilter(container, b, c){
			var pass = true;
			var flight1 = container.flights[0].flight;
			if(container.flights[1]){
				var flight2 = container.flights[1].flight;
			}

			var airlinePass = true;
		//	if(activeAirlineFilter()){
				airlinePass = $scope.airlineFilter[flight1.airline.id];
				if(flight2){
					airlinePass = airlinePass && $scope.airlineFilter[flight2.airline.id];
				}
		//	}
			pass = pass && airlinePass;

			pass = pass && $scope.iTimeFilter.validate(flight1.departMoment.date.getHours());
		
			if(flight2){
				pass = pass && $scope.vTimeFilter.validate(flight2.departMoment.date.getHours());
			}

			if($scope.maxprice){
				pass = pass && (container.price.total.total <= $scope.maxprice)
			}
			if($scope.minprice){
				pass = pass && (container.price.total.total >= $scope.minprice)
			}

			pass = pass && $scope.airports.filter[flight1.departure.airport.id]
			pass = pass && $scope.airports.filter[flight1.arrival.airport.id]
			
			if(flight2){
					pass = pass && $scope.airports.filter[flight2.departure.airport.id]
					pass = pass && $scope.airports.filter[flight2.arrival.airport.id]
			}

			return pass;

		};



		$scope.orderFn = function(c){
			var ret = 0;
			switch($scope.orderBy.criterion) {
  			  case 'price':
        		ret = c.price.total.total;
        		break;
    	      case 'duration':
    	      	for(i in c.flights){
    	      		ret += c.flights[i].flight.flightMinutes;
    	      	}
        		break;
        	  default:
        		ret = c.price.total.total;
			}

			if($scope.orderBy.reversed){
				ret = -ret;
			}
			return ret;

		}

		function activeAirlineFilter(){
			var o = $scope.airlineFilter;
			for (var key in o) {
  				if (o.hasOwnProperty(key) && o[key]) {
 				   return true;
  				}
			}
			return false;
		}


		function process(response, vresponse){
			console.log(response);
			console.log(vresponse);

			if(response.data.flights.length == 0 || (vresponse && vresponse.data.flights.length == 0)){
				$scope.emptySearch = true;

				return;
			}
			$scope.emptySearch = false;
			$(".filter-area").removeClass("greyout");
			$(".currency-menu").removeClass("greyout");
			$(".order-by-menu").removeClass("greyout");
			$(".filter-area").removeClass("disabled");
			$(".currency-menu button").attr("disabled", false);
			$(".order-by-menu button").attr("disabled", false);
			
			var iFlights = stripFlights(response.data.flights);
			setFilters(response.data.filters[0].values);
			if(vresponse){
				var vFlights = stripFlights(vresponse.data.flights);
				setFilters(vresponse.data.filters[0].values);
				combineAndPush(iFlights, vFlights);

			} else {
				pushAll(iFlights);
			}
		}


		$scope.airports = {iList: [], 
						   vList: [], 
						   iCity: "", 
						   vCity: "", 
						   filter: {}};

		function pushAll(flights){
				var maxPrice;
				var minPrice;

				if(flights.length > 0){
					$scope.airports.iCity = flights[0].departure.airport.city.name.split(",")[0];
					$scope.airports.vCity = flights[0].arrival.airport.city.name.split(",")[0];
				}

				for(var i in flights){

					var c = new Container(flights[i]);
					$scope.containers.push(c);

					if(!$scope.airports.filter[flights[i].departure.airport.id]){
						$scope.airports.iList.push(flights[i].departure.airport);
						$scope.airports.filter[flights[i].departure.airport.id] = true;
					}

					if(!$scope.airports.filter[flights[i].arrival.airport.id]){
						$scope.airports.vList.push(flights[i].arrival.airport);
						$scope.airports.filter[flights[i].arrival.airport.id] = true;
					}


					var price = c.price.total.total;


					if(!minPrice || price < minPrice){
						minPrice = price;
					}
				
					else if(!maxPrice || maxPrice < price){
						maxPrice = price;
					}

				}
			
				initSlider(minPrice, maxPrice);
		}

		function combineAndPush(iFlights, vFlights){
			var maxPrice;
			var minPrice;


				if(iFlights.length > 0){
					$scope.airports.iCity = iFlights[0].departure.airport.city.name.split(",")[0];
				}
				if(vFlights.length > 0){
					$scope.airports.vCity = vFlights[0].departure.airport.city.name.split(",")[0];
				}


			for(var i in iFlights){
				for(var j in vFlights){
					var c = new Container(iFlights[i], vFlights[j]);
					var price = c.price.total.total;
					if(!minPrice || price < minPrice){
						minPrice = price;
					}
					if(!maxPrice || maxPrice < price){
						maxPrice = price;
					}

					$scope.containers.push(c);
						
						if(!$scope.airports.filter[iFlights[i].departure.airport.id]){
						$scope.airports.iList.push(iFlights[i].departure.airport);
						$scope.airports.filter[iFlights[i].departure.airport.id] = true;
					}

						if(!$scope.airports.filter[vFlights[j].departure.airport.id]){
						$scope.airports.vList.push(vFlights[j].departure.airport);
						$scope.airports.filter[vFlights[j].departure.airport.id] = true;
					}

				}
			}
			initSlider(minPrice, maxPrice);
		}


		function stripFlights(f){
			flights = [];
			for(var i in f){
				var fli = new FlightDetails(f[i]);
				flights.push(fli)
			}
			return flights;
		}

		function setFilters(filter){
			if(! $scope.airlines){
				$scope.airlines = [];
			}
			if(! $scope.airlineFilter){
				$scope.airlineFilter = {};
			}

			for(var i in filter){

				if($scope.airlineFilter[filter[i].id] === undefined){
					$scope.airlineFilter[filter[i].id] = true;
					$scope.airlines.push(filter[i]);
				}
			}

		}

		function FlightDetails(flight){
			this.departure = {}
			this.arrival = {}

			r = flight.outbound_routes[0]
			s = r.segments[0];

			this.departure.airport = s.departure.airport;
			this.departure.airport.name = s.departure.airport.description.split(",")[0];

			this.arrival.airport = s.arrival.airport;
			this.arrival.airport.name = s.arrival.airport.description.split(",")[0];

			var citylong = s.departure.airport.city.name;

			this.departure.cityshort = citylong.substr(0, citylong.indexOf(','));

			citylong = s.arrival.airport.city.name;

 			this.arrival.airport = s.arrival.airport;
			this.arrival.cityshort = citylong.substr(0, citylong.indexOf(','));
			
			this.airline = s.airline;

			this.departMoment = new TimeDetails(s.departure.date);
			this.arrivalMoment = new TimeDetails(s.arrival.date);
			
			var auxDur = r.duration.split(':');

			this.flightMinutes = parseInt(auxDur[0])*60 + parseInt(auxDur[1]);
			this.duration = Number(auxDur[0]).toString() + "h " + Number(auxDur[1]).toString() + "m";
			
			this.number = s.number;
			this.id = s.id;

			this.price = flight.price;
			return this; //?
		}

		function TimeDetails($date){
			this.date = new Date($date);
			this.dayName = getDayName(this.date.getDay());
			this.monthName = getMonthName(this.date.getMonth());
			this.fullDayName = this.dayName + " " + this.date.getDate(); 
			
			var t = $date.split(" ")[1].split(":");
			this.clockName = t[0] + ":" + t[1] + "hs";
		}


		function Container(flight1, flight2){
			this.flights = []
			this.flights[0] = { desc: "IDA ", flight: flight1 };

			if(flight2){
				this.flights[1] = { desc: "VUELTA ", flight: flight2};
				this.price = mergePrices(flight1.price, flight2.price);
			}else{
				this.price = flight1.price;
			}

			this.precio = this.price.total.total;
			return this;
		}


		function mergePrices(p, q){
			var price = { total : {}}
	
		  if(p.adults){
				price.adults = p.adults;
				price.adults.base_fare += q.adults.base_fare;
			}
			if(p.children){
				price.children = p.children;
				price.children.base_fare += q.children.base_fare;
			}
			if(p.infants){
				price.infants = p.infants;
				price.infants.base_fare += q.infants.base_fare;
			}

			price.total.charges = parseInt(p.total.charges) + parseInt(q.total.charges);
			price.total.fare = parseInt(p.total.fare) + parseInt(q.total.fare);
			price.total.taxes = parseInt(p.total.taxes) + parseInt(q.total.taxes);
			price.total.total = parseInt(p.total.total) + parseInt(q.total.total);

			return price;
		}

		function TimeFilter(airportList, airlineList) {
			var self = this;
			self.time = { active: false,
				dawn: false,
				morn: false,
				noon: false,
				night: false
					};

			self.validate = function(hour){
				if(!self.time.active){
					return true;
				}
				if(hour < 6) return self.time.dawn;
				else if(hour < 12) return self.time.morn ;
				else if(hour < 18) return self.time.noon;
				else return self.time.night;
			}
		};



	function toggleTimeFilter(time, filter){
		var tf = filter.time;
		tf[time] = !tf[time];
		tf.active = tf.dawn || tf.morn || tf.noon || tf.night;

	}

	$scope.toggleTimeFilter = toggleTimeFilter;
	$scope.iTimeFilter = new TimeFilter();
	$scope.vTimeFilter = new TimeFilter();

	$scope.toggleAirport = function(id){
		$scope.scrollLimit = 12;
		$scope.airports.filter[id] = !$scope.airports.filter[id]
	};


	$scope.toggleAirline = function(id){
		$scope.scrollLimit = 12;
		$scope.airlineFilter[id] = !$scope.airlineFilter[id];
	};

	$scope.toggleOrder = function(id){
		$scope.scrollLimit = 12;
		$scope.orderBy.criterion = id;
	}

	//Utilidades

	function getURLParameter(name) {
 			return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
		}


	function initSlider(minPrice, maxPrice){
	var handlesSlider = document.getElementById('price-slider');

	noUiSlider.create(handlesSlider, {
		start: [minPrice, maxPrice],
		margin: ((maxPrice - minPrice) * 0.25),
		connect: true,
		tooltips: [wNumb({decimals: 0, prefix: "Desde: $"}), wNumb({decimals: 0, prefix: "Hasta: $"})],
		range: {
			'min': [minPrice],
			'max': [maxPrice]
		},
		//step: minPrice - maxPrice,
	});

	$("#restart-price-btn").on("click", function(){
		handlesSlider.noUiSlider.reset();
	});

	handlesSlider.noUiSlider.on('update', function(){
		var min = handlesSlider.noUiSlider.get()[0];
		var max = handlesSlider.noUiSlider.get()[1];
		$("#preciomax").val(max);
		$("#preciomax").trigger("change");
		$("#preciomin").val(min);
		$("#preciomin").trigger("change");

	});
}

	
	function getDayName(d){
			var days = ["Domingo", "Lunes", "Martes",
						"Miércoles", "Jueves", "Viernes", "Sábado"]

			if(d >= 0 && d <= 6)
				return days[d];
			else
				return "";
		}

	
	function getMonthName(m){
			var months = ["enero", "febrero", "marzo",
						"abril", "mayo", "junio", "julio",
						"agosto", "septiembre", "octubre", "noviembre",
						"diciembre"];

			if(m >= 0 && m <= 11)
				return months[m];
			else
				return "";
		}
	
	$scope.$on('LastRepeaterElement', function(){
		console.log("Tooltips");
    $('[data-toggle="tooltip"]').tooltip(); 
	});

	if(!localStorage.airlineLogos){
		fillAirlines().then(fetch);
	}else{
		$scope.airlineLogos = JSON.parse(localStorage.airlineLogos);
		fetch();
	}

});
