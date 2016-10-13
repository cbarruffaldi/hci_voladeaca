var app = angular.module("flightApp", []);

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


		function process(response, vresponse){
		//	console.log(response);
			var iFlights = stripFlights(response.data.flights);
			if(vresponse){
				var vFlights = stripFlights(vresponse.data.flights);
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
			this.precio = 1000;
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

	$scope.myFilter = function(a,b,c){
		return true;
	};
	


	fetch();
	
});
