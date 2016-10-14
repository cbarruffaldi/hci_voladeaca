var app2 = angular.module("promoApp", []);

app2.controller("promoCtrl", function($scope, $http) {

	$scope.containers = [];
	$scope.promos = [];

	$(".btn-month").on("click", function(){fill(this, "month", "duration")});
	$(".btn-duration").on("click", function(){fill(this,"duration", "dest")});
	$(".btn-dest").on("click", function(){fill(this, "dest")});

	var promocion = {};
	var selected = {};
	var query = {};
	var completedSelection = false;

	var expanded = {
		month: true,
		duration: false,
		dest: false,
	}

	function fill(btn, selected, toExpand){
		var button = $(btn);

		if(expanded[selected]){
			selectButton(button, selected);

			if(toExpand){	
				expanded[toExpand] || make_available(toExpand);
			}
		}
	}

	function make_available(category){
		$(".btn-" + category).removeClass("disabled"); 	
		expanded[category] = true;
	}


	function selectButton(button, type){
		promocion[type] = button.data("promo");

		if(selected[type]){
			selected[type].removeClass("btn-toggle");
		}

		selected[type] = button;

		selected[type].addClass("btn-toggle");

		query[type] = button.data(type);

		if (type == "dest")
			completedSelection = true;

		console.log(query);
		if (completedSelection) {
			sendPromoSearch(query)
		}

	}

	var promosInfo = {};
	promosInfo["Noviembre"] = "2016-11-";
	promosInfo["Diciembre"] = "2016-12-";
	promosInfo["Enero-2017"] = "2017-01-";
	promosInfo["Febrero-2017"] = "2017-02-";
	promosInfo["Brasil"] = ["FLN", "CGN", "GRU"];
	promosInfo["Europa"] = ["MAD", "BAR", "LON"];
	promosInfo["EEUU"] = ["MIA", "NYC", "LAX"];
	promosInfo["Argentina"] = ["COR", "RGL", "PSS"];
	promosInfo["weekend"] = 3;
	promosInfo["week"] = 7;
	promosInfo["twoweeks"] = 14;

	function sendPromoSearch(query) {
		var idate = promosInfo[query.month] + "01";
		var dur = promosInfo[query.duration];
		var vdate = promosInfo[query.month].toString() + (dur > 8 ? "" : "0") + (1 + dur).toString();

		for (var des of promosInfo[query.dest]) {
			fetchPromo(idate, vdate, "EZE", des);
		}
	}

	function fetchPromo(idate, vdate, orig, dest){
		var baseURL = "http://hci.it.itba.edu.ar/v1/api/booking.groovy?method=getonewayflights"
		baseURL += "&adults=1&children=0&infants=0";

		var URL = baseURL + "&dep_date=" + idate;
		URL += "&from=" + orig;
		URL += "&to=" + dest;

		$http({
			method: 'GET',
			url: URL
		}).then(function successCallback(response) {
			var vURL = baseURL + "&dep_date=" + vdate;
			vURL += "&from=" + dest;
			vURL += "&to=" + orig;

			$http({
				method: 'GET',
				url: vURL
			}).then(function success(vresponse){
				process(response, vresponse);
				console.log($scope.containers); // tira cualquiera
			},
							function errorCallback(response){
				console.log("Error in response");
			}
						 )
		

						}, function errorCallback(response) {
			console.log("Error in response");
		});

	}


	function addCheapestFlight() {
		//		var cheapest = $scope.containers[0];
		//		for (c of $scope.containers) {
		//			if (c.precio < cheapest.precio)
		//				cheapest = c;
		//		}
		//		$scope.promos.push($scope.containers[0]);
		console.log("Conts: " + $scope.containers);
	}

	function process(response, vresponse){
		var iFlights = stripFlights(response.data.flights);
		var vFlights = stripFlights(vresponse.data.flights);

		combineAndPush(iFlights, vFlights);
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
		for(var i in f) {
			var fli = new FlightDetails(f[i]);
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
		return this;
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
});