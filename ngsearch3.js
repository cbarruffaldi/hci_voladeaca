var app = angular.module("flightApp", ['ngAnimate']);

app.controller("flightCtrl", function($scope, $http) {
		$scope.twoWays = false;
		//Funcionalidad
		$scope.containers = [] //Los voy a ir llenando mientras proceso la respuesta

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
			if(activeAirlineFilter()){
				console.log(flight1.airline.id);
				airlinePass = $scope.airlineFilter[flight1.airline.id];
				if(flight2){
					pass = airlinePass || $scope.airlineFilter[flight2.airline.id];
				}
			}
			pass = pass && airlinePass;


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
		//	console.log(response);
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
				$scope.airlineFilter[filter[i].id] = false;
				$scope.airlines.indexOf(filter[i])
				
				if( < 0){
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

			this.departMoment = moment(s.departure.date);
			this.departMoment.utcOffset(parseInt(s.departure.airport.time_zone));

			this.arrivalMoment = moment(s.arrival.date);
			this.arrivalMoment.utcOffset(parseInt(s.arrival.airport.time_zone));
			
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

		function Filter(airportList, airlineList) {
			this.time = { active: false,
				dawn: false,
				morn: false,
				noon: false,
				night: false
					};

			this.airports = {
					active: false,
					list: {}	
					};

			for(var i in airportList){
				this.airports.list[airportList[i]] = false;
			}

			this.airlines = {
				active: false,
				list: {}
			}

			for(var i in airlineList){
				this.airline.list[airlineList[i]] = false;
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

		console.log("Activated: " + time);
		console.log("Activated: " + tf.active);
	}

	$scope.toggleTimeFilter = toggleTimeFilter;

	var container1 = {
		tramos: [],
		precio: 1000,
		id: 10
	};

	$scope.toggleIAir = function(s){
		console.log(s);
	};

	$scope.toggleVAir = function(s){
		console.log(s);
	};

	
	$scope.toggleAirline = function(id){
		$scope.airlineFilter[id] = !$scope.airlineFilter[id];
	};
	


	fetch();
	
});
