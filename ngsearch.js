var app = angular.module("flightApp", []);
app.controller("flightCtrl", function($scope) {


	var container1 = {
		tramos: [],
		precio: 1000,
		id: 10
	};


	var flight1 = {};
	var flight2 = {};


	flight1.airlineName = "Air Canada";
	flight1.departDate = "Viernes 10";
	flight1.departTime = "10:00hs";
	flight1.departAirport = "EZE";
	flight1.duration = "18h18m";
	flight1.flnumber = "AC3214";
	flight1.arrivalDate = "Sábado 11";
	flight1.arrivalTime = "01:00hs";
	flight1.arrivalAirport = "JFK";

	flight2.airlineName = "Aerolíneas Argentinas";
	flight2.departDate = "Viernes 10";
	flight2.departTime = "11:00hs";
	flight2.departAirport = "EZE";
	flight2.duration = "18h19m";
	flight2.flnumber = "AA3224";
	flight2.arrivalDate = "Sábado 11";
	flight2.arrivalTime = "03:00hs";
	flight2.arrivalAirport = "JFK";


	container1.tramos.push(flight1);
	container1.tramos.push(flight2);


	var container2 = {
		tramos: [],
		precio: 9000
	};

	var flight1b = {};
	var flight2b = {};

	flight1b.airlineName = "Air Chelo";
	flight1b.departDate = "Viernes 10";
	flight1b.departTime = "10:00hs";
	flight1b.departAirport = "EZE";
	flight1b.duration = "18h18m";
	flight1b.flnumber = "AC3214";
	flight1b.arrivalDate = "Sábado 11";
	flight1b.arrivalTime = "01:00hs";
	flight1b.arrivalAirport = "JFK";
	flight1b.desc = "IDA";

	flight2b.airlineName = "Aerolíneas Lucho";
	flight2b.departDate = "Viernes 10";
	flight2b.departTime = "11:00hs";
	flight2b.departAirport = "EZE";
	flight2b.duration = "18h19m";
	flight2b.flnumber = "AA3224";
	flight2b.arrivalDate = "Sábado 11";
	flight2b.arrivalTime = "03:00hs";
	flight2b.arrivalAirport = "JFK";
	flight2b.desc = "VUELTA";

	container2.tramos.push(flight1b);
	container2.tramos.push(flight2b);


	var container3 = {
		tramos: [],
		precio: 15000
	};
	var flight1c = {};
	var flight2c = {};

	flight1c.airlineName = "Air Chelo";
	flight1c.departDate = "Viernes 10";
	flight1c.departTime = "10:00hs";
	flight1c.departAirport = "EZE";
	flight1c.duration = "18h18m";
	flight1c.flnumber = "AC3214";
	flight1c.arrivalDate = "Sábado 11";
	flight1c.arrivalTime = "01:00hs";
	flight1c.arrivalAirport = "JFK";
	flight1c.desc = "IDA";

	flight2c.airlineName = "Carlineas";
	flight2c.departDate = "Viernes 10";
	flight2c.departTime = "11:00hs";
	flight2c.departAirport = "EZE";
	flight2c.duration = "18h19m";
	flight2c.flnumber = "AA3224";
	flight2c.arrivalDate = "Sábado 11";
	flight2c.arrivalTime = "03:00hs";
	flight2c.arrivalAirport = "JFK";
	flight2c.desc = "VUELTA";

	container3.tramos.push(flight1c);
	container3.tramos.push(flight2c);


	$scope.containers = [
    	container1, container2, container3   
    ]

});

