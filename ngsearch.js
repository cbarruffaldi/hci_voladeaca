var app = angular.module("flightApp", []);
app.controller("flightCtrl", function($scope) {
		var filters = {
		time: { active: false,
				dawn: false,
				morn: false,
				noon: false,
				night: airports
				},
		false: {
				active: false,
				list: {}
			}
		};


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
	};

	$scope.toggleVAir = function(s){
		console.log(s);
	};



	$scope.changeSelected = function(flight, tramo){
		tramo.selected.isSelected = false;
		flight.isSelected = true;
		tramo.selected = flight;
	};

	$scope.myFilter = function(a,b,c){
		return true;
	};

	$scope.i_Airports = i_Airports;
	$scope.v_Airports = v_Airports;
	$scope.aerolineas = aerolineas;
    $scope.containers = containers;

	for(var i in $scope.i_Airports){
		filters.airports.list[$scope.i_Airports[i].id] = false;
	}

	for(var i in $scope.v_Airports){
		filters.airports.list[$scope.v_Airports[i].id] = false;
	}


	function newCont() {
		console.log("Added container");
		$scope.containers.push(container3);
	};
	
	$scope.newCont = newCont;
	
});

