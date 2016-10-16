<<<<<<< HEAD
var app = angular.module("flightApp", ['ngAnimate', 'infinite-scroll']);

app.controller("flightCtrl", function($scope, $http, $window) {
		$scope.twoWays = false;
		$scope.containers = [] 
		$scope.scrollLimit = 10;
		
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

			$selectedFlight.twoWays = vdate ? true : false;

			if(!(orig && dest && date && (adults || children || infants))){
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
												total: adults+children+infants};
			console.log($scope.selectedFlight);								

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
			$selectedFlight.container = container;
			console.log($selectedFlight);
			
			sessionStorage.set('boughtFlight', JSON.stringify($selectedFlight));
			if(localStorage.boughtFlight){
				console.log("Have one in local");
				localStorage.set('boughtFlight', JSON.stringify($selectedFlight));
			}
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
					airlinePass = airlinePass || $scope.airlineFilter[flight2.airline.id];
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
			
			return pass;
		};



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

		function pushAll(flights){
				var maxPrice;
				var minPrice;

				for(var i in flights){
					var c = new Container(flights[i]);
					$scope.containers.push(c);

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
				}
			}
			initSlider(minPrice, maxPrice);
		}


		function stripFlights(f){
			flights = [];
			for(var i in f){
				var fli = new FlightDetails(f[i]);
//				console.log(fli);
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
			
			this.airline = s.airline;

			this.departMoment = new TimeDetails(s.departure.date);
			this.arrivalMoment = new TimeDetails(s.arrival.date);
			
			this.duration = r.duration;
			
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


	function createFilters(){
		$scope.iFilter = new Filter(queryData.iAirports, queryData.vAirports);

		if(queryData.twoWays){
			$scope.vFilter = new Filter(queryData.vAirports, queryData.vAirlines);
		}
	}

	function toggleTimeFilter(time, filter){
		var tf = filter.time;
		tf[time] = !tf[time];
		tf.active = tf.dawn || tf.morn || tf.noon || tf.night;

	}

	$scope.toggleTimeFilter = toggleTimeFilter;
	$scope.iTimeFilter = new TimeFilter();
	$scope.vTimeFilter = new TimeFilter();

	$scope.toggleIAir = function(s){
		console.log(s);
	};

	$scope.toggleVAir = function(s){
		console.log(s);
	};


	$scope.toggleAirline = function(id){
		$scope.scrollLimit = 15;
		$scope.airlineFilter[id] = !$scope.airlineFilter[id];
	};


	//Utilidades

	function getURLParameter(name) {
 			return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
		}


	function initSlider(minPrice, maxPrice){
	var handlesSlider = document.getElementById('price-slider');

	noUiSlider.create(handlesSlider, {
		start: [minPrice, maxPrice],
		margin: ((minPrice - maxPrice) * 0.25),
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

	

	//Ejecucion


	if(!localStorage.airlineLogos){
		fillAirlines().then(fetch);
	}else{
		$scope.airlineLogos = JSON.parse(localStorage.airlineLogos);
		fetch();
	}

});