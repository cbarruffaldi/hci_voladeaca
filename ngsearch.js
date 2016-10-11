var app = angular.module("flightApp", []);
app.controller("flightCtrl", function($scope) {

	var filters = {
		time: { active: false,
				dawn: false,
				morn: false,
				noon: false,
				night: false
				},
		airports: {
				active: false,
				list: {}
			}
		}





	function toggleTimeFilter(time){
		var tf = filters.time;
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
	}

	$scope.toggleVAir = function(s){
		console.log(s);
	}


	$scope.changeSelected = function(flight, tramo){
		tramo.selected.selected = false;
		flight.selected = true;
		tramo.selected = flight;
	}



	//RAW DATA

	$scope.i_Airports = [{name: "Aero1", id: "A1"}, {name: "Aero2", id: "A2"},{name: "Aero3", id: "A3"}];
	$scope.v_Airports = [{name: "Aero1", id: "A1"}, {name: "Aero2", id: "A2"},{name: "Aero3", id: "A3"}];

	for(var i in $scope.i_Airports){
		filters.airports.list[$scope.i_Airports[i].id] = false;
	}

	for(var i in $scope.v_Airports){
		filters.airports.list[$scope.v_Airports[i].id] = false;
	}

	$scope.aerolineas = [{name: "Air Chelo", id: "CAI"}, {name: "Air Lucho", id: "LCH"}, {name: "Tomafly", id: "TFL"}]

	var flight1 = {};
	var flight2 = {};


	flight1.airlineName = "Air Canada";
	flight1.departDate = "Viernes 10";
	flight1.departTime = "10:00hs";
	flight1.duration = "18h18m";
	flight1.flnumber = "AC3214";
	flight1.arrivalDate = "Sábado 11";
	flight1.arrivalTime = "01:00hs";
	flight2.selected = false;

	flight2.airlineName = "Aerolíneas Argentinas";
	flight2.departDate = "Viernes 10";
	flight2.departTime = "11:00hs";
	flight2.duration = "18h19m";
	flight2.flnumber = "AA3224";
	flight2.arrivalDate = "Sábado 11";
	flight2.arrivalTime = "03:00hs";
	flight2.selected =false;


	/*var container2 = {
		tramos: [],
		precio: 5000
	};*/

	var flight1b = {};
	var flight2b = {};

	flight1b.airlineName = "Air Chelo";
	flight1b.departDate = "Viernes 10";
	flight1b.departTime = "10:00hs";
	flight1b.duration = "18h18m";
	flight1b.flnumber = "AC3214";
	flight1b.arrivalDate = "Sábado 11";
	flight1b.arrivalTime = "01:00hs";
	flight1b.selected = true;

	flight2b.airlineName = "Aerolíneas Lucho";
	flight2b.departDate = "Viernes 10";
	flight2b.departTime = "11:00hs";
	flight2b.duration = "18h19m";
	flight2b.flnumber = "AA3224";
	flight2b.arrivalDate = "Sábado 11";
	flight2b.arrivalTime = "03:00hs";
	flight2b.selected = true;

	/*container2.tramos.push(flight1b);
	container2.tramos.push(flight2b);*/


	var container = {
		tramos: [ {desc: "ida", departAirport:"EZE", arrivalAirport: "JFK", vuelos: [], selected: null}, 
					{desc:"vuelta", departAirport:"JFK", arrivalAirport: "BUE", vuelos: [], selected: null} ],
		precio: 6000
	};


	var flight1c = {};
	var flight2c = {};

	flight1c.airlineName = "Air Chelivery";
	flight1c.departDate = "Viernes 10";
	flight1c.departTime = "10:00hs";
	flight1c.duration = "18h18m";
	flight1c.flnumber = "ACAJAJS4";
	flight1c.arrivalDate = "Sábado 11";
	flight1c.arrivalTime = "01:00hs";
	flight1c.selected = false;

	flight2c.airlineName = "Carlineas";
	flight2c.departDate = "Viernes 10";
	flight2c.departTime = "11:00hs";
	flight2c.duration = "18h19m";
	flight2c.flnumber = "AA3224";
	flight2c.arrivalDate = "Sábado 11";
	flight2c.arrivalTime = "03:00hs";
	flight2c.selected = false;

	container.tramos[0].vuelos.push(flight1c);
	container.tramos[0].vuelos.push(flight1b);
	container.tramos[0].selected = flight1b;

	container.tramos[1].vuelos.push(flight2c);
	container.tramos[1].vuelos.push(flight2b);
	container.tramos[1].vuelos.push(flight2);
	container.tramos[1].selected = flight2b;

	container.idx = 0;
	containers = [
    	container   
    ]

    $scope.containers = containers;

	function newCont() {
		console.log("Added container");
		$scope.containers.push(container3);
	};
	
	$scope.newCont = newCont;
	
});

