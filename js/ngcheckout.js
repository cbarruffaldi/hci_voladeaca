var app = angular.module("checkoutApp", []);
app.controller('PassengersController', function($scope) {
	$scope.passengerList = [
							{type: "Adulto"},
							{type: "Adulto"},
							{type: "Niño"},
							{type: "Infante"}
							];

});