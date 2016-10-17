var app = angular.module("checkoutApp", []);
app.controller('CheckoutController', function($scope) {

	/* Genera información para los pasajeros */

	function buildList(passengers) {
		var list = [];
		var adults = passengers.adults;
		var children = passengers.children;
		var infants = passengers.infants;

		while (adults--)
			list.push({type: "Adulto"});
		while (children--)
			list.push({type: "Niño"});
		while (infants--)
			list.push({type: "Infante"});

		return list;
	}

	var $bought;
    if(!localStorage.boughtFlight){
      console.log("No se que haces en esta pagina plebeyo, volve a la busqueda");
    }
    else{
        $bought = JSON.parse(localStorage.boughtFlight);
    }

    console.log($bought.container.flights[0].flight.arrivalMoment);

	$scope.passengerList = buildList($bought.passengers);


	/* Parte de confirmación */

	$scope.fillDatas = function() {
		$scope.passengersData = passengersValidator.getData();
		$scope.paymentData = paymentValidator.getData();
		$scope.contactData = contactValidator.getData();
		$scope.phones = $scope.contactData['phones'];
	}
});