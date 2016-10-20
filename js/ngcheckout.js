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

	$scope.passengerList = buildList($bought.passengers);

	console.log($bought.container.flights[0].flight.id);

	/*Cuadro resumen de vuelo */
	if($bought.twoWays == true) {
		$scope.returnFlightDetails = getFlightDetails($bought.container.flights[1].flight);
	}

	$scope.flightPrice = $bought.container.price.total;
	$scope.idaFlightDetails = getFlightDetails($bought.container.flights[0].flight);

	/* Es re feo esto, pero es mas facil para buscar las cosas que estan super anidadas */
	function getFlightDetails(flights){
		var flight = { 	departureDate: getDepartureDate(flights),
						departureTime: getDepartureTime(flights),
						airportFromName: getFromAirportName(flights),
						airportToName: getToAirportName(flights),
						airportFromId: getFromAirportId(flights),
						airportToId: getToAirportId(flights),
						airlineName: getAirlineName(flights),
						airlineId: getAirlineId(flights),
						arrivalDate: getArrivalDate(flights),
						arrivalTime: getArrivalTime(flights),
						duration: getDuration(flights),
						number: getFlightNumber(flights),
						price: getPrice(flights)	};

		return flight;
	}

	function getDepartureDate( flight) {
		return flight.departMoment.fullDayName + ' ' + flight.departMoment.monthName;
	}

	function getFromAirportId(flight) {
		return flight.departure.airport.id;
	}
	function getToAirportId(flight) {
		return flight.arrival.airport.id;
	}

	function getDepartureTime(flight) {
		return flight.departMoment.clockName;
	}

	function getFromAirportName(flight){
		return flight.departure.airport.name;
	}

	function getAirlineId(flight) {
		return flight.airline.id;
	}
	function getAirlineName(flight){
		return flight.airline.name;
		//Quedaria mas lindo el logo
	}

	function getArrivalDate( flight) {
		return flight.arrivalMoment.fullDayName + ' ' + flight.arrivalMoment.monthName;
	}

	function getArrivalTime(flight) {
		return flight.arrivalMoment.clockName;
	}

	function getToAirportName(flight){
		return flight.arrival.airport.name;
	}

	function getDuration(flight) {
		return flight.duration;
	}

	function getFlightNumber(flight) {
		return 'Vuelo Nº ' + flight.number;
	}

	function getPrice(flight){
		return flight.price;
	}



	/* Parte de confirmación */

	$scope.fillDatas = function() {
		$scope.passengersData = passengersValidator.getData();
		$scope.paymentData = paymentValidator.getData();
		$scope.contactData = contactValidator.getData();
		$scope.phones = $scope.contactData['phones'];
	}
});