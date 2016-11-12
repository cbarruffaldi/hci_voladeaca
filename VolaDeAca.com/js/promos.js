app = angular.module("flightApp", []);

app.controller("promoCtrl", function($scope, $http, $q) {
	$scope.containers = [];
	$scope.promos = {};

	function resetData() {
		$scope.containers = [];
		$scope.promos = {};
	}

	$(".btn-month").on("click", function(){
		resetData();
		fill(this, "month", "duration");
	});
	$(".btn-duration").on("click", function(){
		resetData();
		fill(this,"duration", "dest");
	});
	$(".btn-dest").on("click", function(){
		resetData();
		fill(this, "dest");
	});

	$(document).on('mouseenter', ".promo-text", function(e) {
		$(this).parent().find(".place-img").addClass("hover-img");
	});

	$(document).on('mouseleave', ".promo-text", function(e) {
		$(this).parent().find(".place-img").removeClass("hover-img");	});

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
		if(selected[type]){
			selected[type].removeClass("btn-toggle");
		}

		selected[type] = button;

		selected[type].addClass("btn-toggle");

		query[type] = button.data(type);

		if (type == "dest")
			completedSelection = true;

		if (completedSelection) {
			$("#loadImg").css('visibility', 'visible');
			$("#loadImg").show();
			$("#promoResultShow").hide();
			$(".botonera button").attr("disabled", true); // desactiva los botones hasta que termine la busqueda.
			sendPromoSearch(query);
		}
	}

	var promosInfo = {};
	promosInfo["Noviembre"] = "2016-11-";
	promosInfo["Diciembre"] = "2016-12-";
	promosInfo["Enero-2017"] = "2017-01-";
	promosInfo["Febrero-2017"] = "2017-02-";
	promosInfo["Brasil"] = ["FLN", "CGN", "GRU", "VCP"];
	promosInfo["Europa"] = ["MAD", "BAR", "LON", "CIA", "FCO"];
	promosInfo["EEUU"] = ["MIA", "NYC", "LAX"];
	promosInfo["Argentina"] = ["COR", "PSS", "MDZ", "REL", "SLA", "FTE"];
	promosInfo["weekend"] = 3;
	promosInfo["week"] = 7;
	promosInfo["twoweeks"] = 14;

	$scope.searchPromo = function (city) {
		var p = $scope.promos[city];
		var iDate = moment(p.flights[0].flight.departMoment.date).format("YYYY-MM-DD");

		var vDate = moment(p.flights[1].flight.departMoment.date).format("YYYY-MM-DD");

		var uri = 'search3.html?';
		uri += 'orig=' + 'BUE'; // TODO cambiar BUE
		uri += '&dest=' + p.flights[0].flight.arrival.airport.city.id;
		uri += '&date=' + iDate;
		uri += '&vdate=' + vDate;
		uri += '&adults=' + window.passengers.adults;
		uri += '&children=' + window.passengers.children;
		uri += '&infants=' + window.passengers.infants;
		uri += '&promo=true'
		window.location.href = uri;
	}

	function toDayString(num) {
		var str = num.toString();
		if (num < 10)
			str = "0" + str;
		return str;
	}

	function sendPromoSearch(query) {
		$scope.noConnection = false;

		var dayida = parseInt(Math.random() * 15) + 1;
		var strida = toDayString(dayida);

		var idate = promosInfo[query.month] + strida;

		var dayvuelta = promosInfo[query.duration] + dayida;
		var strvuelta = toDayString(dayvuelta);

		var vdate = promosInfo[query.month].toString() + strvuelta;
		var promises = [];

		for (var des of promosInfo[query.dest]) {
			promises.push(fetchPromo(idate, vdate, "BUE", des));
		}

		$q.all(promises).then(function(response){
			setImages();
			$("#promoResultShow").show();
			$("#loadImg").hide();
			$(".botonera button").attr("disabled", false);
		});
	}

	function fetchPromo(idate, vdate, orig, dest){
		var deferred = $q.defer();
		var baseURL = "http://hci.it.itba.edu.ar/v1/api/booking.groovy?method=getonewayflights"
		baseURL += "&adults=1&children=0&infants=0";

		var URL = baseURL + "&dep_date=" + idate;
		URL += "&from=" + orig;
		URL += "&to=" + dest;

		$http({
			method: 'GET',
			url: URL,
			timeout: 7000
		}).then(function successCallback(response) {
			var vURL = baseURL + "&dep_date=" + vdate;
			vURL += "&from=" + dest;
			vURL += "&to=" + orig;

			$http({
				method: 'GET',
				url: vURL,
				timeout: 7000
			}).then(function success(vresponse){
				process(response, vresponse);
				$scope.promos = getCheapestFlights($scope.containers);
				deferred.resolve();
			},
							function errorCallback(response){
				promoTimeOutError();
				deferred.reject();
			}
						 )


		}, function errorCallback(response) {
			promoTimeOutError();
			deferred.reject();
		});

		return deferred.promise;
	}

	function setImages() {
		for (var p in $scope.promos) {
			$scope.promos[p].imgsrc = "./img/cityimg/" + $scope.promos[p].shortName.split(' ').join('').toLocaleLowerCase() + ".jpg";
		}
	}

	function promoTimeOutError() {
		$scope.noConnection = true
		$("#promoResultShow").show();
		$("#loadImg").hide();
		$(".botonera button").attr("disabled", false);
	}

	$scope.retryPromoSearch = function() {
		$scope.noConnection = false;
		$("#loadImg").css('visibility', 'visible');
		$("#loadImg").show();
		$("#promoResultShow").hide();
		$(".botonera button").attr("disabled", true);
		sendPromoSearch(query);
	}

	function getCheapestFlights(containers) {
		var f = {};
		if (containers.length == 0)
			return f;

		for (var co of containers) {
			var city = destCityName(co);
			if (f[city]) {
				if (co.precio < f[city].precio)
					f[city] = co;
			}
			else {
				f[city] = co;
			}
			f[city].shortName = city;
		}

		return f;
	}

	function destCityName(container) {
		return container.flights[0].flight.arrival.cityshort;
	}

	function process(response, vresponse){
		var iFlights = stripFlights(response.data.flights);
		if(vresponse){
			var vFlights = stripFlights(vresponse.data.flights);
			combineAndPush(iFlights, vFlights);

		} else {
			pushAll(iFlights);
		}
	}


	$scope.airports = {iList: [],
										 vList: [],
										 iCity: "",
										 vCity: ""};

	function pushAll(flights){
		var maxPrice;
		var minPrice;

		if(flights.length > 0){
			$scope.airports.iCity = flights[0].departure.airport.city.name.split(",")[0];
			$scope.airports.vCity = flights[0].arrival.airport.city.name.split(",")[0];
		}

		for(var i in flights){

			var c = new Container(flights[i]);
			$scope.containers.push(c);

		}
	}

	function combineAndPush(iFlights, vFlights){
		if(iFlights.length > 0){
			$scope.airports.iCity = iFlights[0].departure.airport.city.name.split(",")[0];
		}
		if(vFlights.length > 0){
			$scope.airports.vCity = vFlights[0].departure.airport.city.name.split(",")[0];
		}


		for(var i in iFlights){
			for(var j in vFlights){
				var c = new Container(iFlights[i], vFlights[j]);

				$scope.containers.push(c);
			}
		}
	}


	function stripFlights(f){
		flights = [];
		for(var i in f){
			var fli = new FlightDetails(f[i]);
			flights.push(fli)
		}
		return flights;
	}


	function FlightDetails(flight){
		this.departure = {}
		this.arrival = {}

		r = flight.outbound_routes[0]
		s = r.segments[0];

		this.departure.airport = s.departure.airport;
		this.departure.airport.name = s.departure.airport.description.split(",")[0];

		this.arrival.airport = s.arrival.airport;
		this.arrival.airport.name = s.arrival.airport.description.split(",")[0];

		var citylong = s.departure.airport.city.name;

		this.departure.cityshort = citylong.substr(0, citylong.indexOf(','));

		citylong = s.arrival.airport.city.name;

		this.arrival.airport = s.arrival.airport;
		this.arrival.cityshort = citylong.substr(0, citylong.indexOf(','));

		this.airline = s.airline;

		this.departMoment = new TimeDetails(s.departure.date);
		this.arrivalMoment = new TimeDetails(s.arrival.date);

		var auxDur = r.duration.split(':');

		this.flightMinutes = parseInt(auxDur[0])*60 + parseInt(auxDur[1]);
		this.duration = Number(auxDur[0]).toString() + "h " + Number(auxDur[1]).toString() + "m";

		this.number = s.number;
		this.id = s.id;

		this.price = flight.price;
		return this; //?
	}

	function TimeDetails($date){
		this.date = new Date($date);
		this.dayName = getDayName(this.date.getDay());
		this.monthName = getMonthName(this.date.getMonth());
		this.fullDayName = this.dayName + " " + this.date.getDate();

		var t = $date.split(" ")[1].split(":");
		this.clockName = t[0] + ":" + t[1] + "hs";
	}


	function Container(flight1, flight2){
		this.flights = []
		this.flights[0] = { desc: "IDA ", flight: flight1 };

		if(flight2){
			this.flights[1] = { desc: "VUELTA ", flight: flight2};
			this.price = mergePrices(flight1.price, flight2.price);
		}else{
			this.price = flight1.price;
		}

		this.precio = this.price.total.total;
		return this;
	}

	function getDayName(d){
		var days = ["Domingo", "Lunes", "Martes",
								"Miércoles", "Jueves", "Viernes", "Sábado"]

		if(d >= 0 && d <= 6)
			return days[d];
		else
			return "";
	}


	function getMonthName(m){
		var months = ["enero", "febrero", "marzo",
									"abril", "mayo", "junio", "julio",
									"agosto", "septiembre", "octubre", "noviembre",
									"diciembre"];

		if(m >= 0 && m <= 11)
			return months[m];
		else
			return "";
	}


	function mergePrices(p, q){
		var price = { total : {}}

		if(p.adults){
			price.adults = p.adults;
			price.adults.base_fare += q.adults.base_fare;
		}
		if(p.children){
			price.children = p.children;
			price.children.base_fare += q.children.base_fare;
		}
		if(p.infants){
			price.infants = p.infants;
			price.infants.base_fare += q.infants.base_fare;
		}

		price.total.charges = parseInt(p.total.charges) + parseInt(q.total.charges);
		price.total.fare = parseInt(p.total.fare) + parseInt(q.total.fare);
		price.total.taxes = parseInt(p.total.taxes) + parseInt(q.total.taxes);
		price.total.total = parseInt(p.total.total) + parseInt(q.total.total);

		return price;
	}
});
