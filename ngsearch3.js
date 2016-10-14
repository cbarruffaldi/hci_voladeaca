var app = angular.module("flightApp", ['ngAnimate', 'infinite-scroll']);

app.controller("flightCtrl", function($scope, $http, $window) {
		$scope.twoWays = false;
		//Funcionalidad
		$scope.containers = [] //Los voy a ir llenando mientras proceso la respuesta

		$scope.scrollLimit = 10;
		
		$scope.loadMore = function(){
			$scope.scrollLimit += 5;
		}

		function getURLParameter(name) {
  			return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
		}


		function fetch(){
			var orig = getURLParameter("orig");
			var dest = getURLParameter("dest");
			var date = getURLParameter("date");
			var adults = getURLParameter("adults");
			var children = getURLParameter("children");
			var infants = getURLParameter("infants");
			var vdate = getURLParameter("vdate");

			$scope.twoWays = vdate ? true : false;

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
							console.log("CONTS: " + $scope.containers);
							$("#resultShow").show();
							$("#loadImg").hide();
						},
							function errorCallback(response){
								console.log("Error in response");
							}
						)
					}
					else {
						process(response);
						$("#resultShow").show();
						$("#loadImg").hide();
					}
  			}, function errorCallback(response) {
    				console.log("Error in response");
    		});

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

			pass = pass && $scope.iTimeFilter.validate(flight1.departMoment.getHours());
		
			if(flight2){
				pass = pass && $scope.vTimeFilter.validate(flight2.departMoment.getHours());
			}

			if($scope.precio){
				pass = pass && container.precio <= $scope.precio
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
				for(var i in iFlights){
				$scope.containers.push(new Container(iFlights[i]));
				}
				console.log($scope.containers);
			}
		}

		function combineAndPush(iFlights, vFlights){
			for(var i in iFlights){
				for(var j in vFlights){
					$scope.containers.push(new Container(iFlights[i], vFlights[j]));
				}
			}
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
				console.log(filter);
				if($scope.airlineFilter[filter[i].id] === undefined){
					$scope.airlineFilter[filter[i].id] = true;
					$scope.airlines.push(filter[i]);
				}
			}
		}

		function FlightDetails(flight){
			r = flight.outbound_routes[0]
			s = r.segments[0];

			this.departAirport = s.departure.airport;
			this.arrivalAirport = s.arrival.airport;
			this.airline = s.airline;

			this.departMoment = new Date(s.departure.date);
			//console.log("Departure obj: ");
			//console.log(s.departure.date);
			//console.log("Departure mom: ");
			//this.departMoment.utcOffset(parseInt(s.departure.airport.time_zone));
			//console.log(this.departMoment);

			this.arrivalMoment = new Date(s.arrival.date);
			//this.arrivalMoment.utcOffset(parseInt(s.arrival.airport.time_zone));
			console.log("Arrival moment: ")
			console.log(this.arrivalMoment);
			console.log("Duration " + r.duration);
			this.duration = r.duration;
			this.flnumber = s.number;
			this.flid = s.id;

			this.price = flight.price;
			return this; //?
		}

		function Container(flight1, flight2){
			this.flights = []
			this.flights[0] = { desc: "IDA ", flight: flight1 };
			this.precio = 5000 + Math.floor(25000*Math.random());
			if(flight2){
				this.flights[1] = { desc: "VUELTA ", flight: flight2};
			}
			return this;
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



	fetch();

});
