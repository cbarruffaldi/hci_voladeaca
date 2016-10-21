
function translateUserDoc(passData, translatedData) {
	translatedData["id_type"] = passData["usr-doc"] == "DNI" ? 1 : 2;
}

function translateBirthday(passData, translatedData) {
	translatedData["birthdate"] = passData['birth-year'] + '-' + passData['birth-month'] + '-' + passData['birth-day'];
}

function translateCardholder(cardData, translatedData) {
	var splitted = cardData["cardholder"].split(' ');

	translatedData['last_name'] = splitted.pop();
	translatedData['first_name'] = splitted.join(' ');
}

function translateExpiration(cardData, translatedData) {
	var expYear = cardData['exp-year'].slice(-2);
	translatedData['expiration'] = cardData['exp-month'] + expYear;
}

function translateStreet(billingData, translatedData) {
	translatedData["street"] = billingData["street"] + ' ' + billingData["addr-num"];
}

var translatorHandlers = {
	"birth-day": translateBirthday,
	"usr-doc": translateUserDoc,
	"cardholder": translateCardholder,
	"exp-year": translateExpiration,
	"street": translateStreet,
}

var translators = {
	"usr-name": "first_name",
	"usr-lname": "last_name",
	"usr-docnum": "id_number",
	"card-num": "number",
	"sec-code": "security_code",
	"zip-code": "zip_code",
	"floor": "floor",
	"department": "apartment",
	"email": "email",
}

function translateData(data) {
	var translatedData = {};

	for (var prop in data) {
		var translation = translators[prop];
		var handler = translatorHandlers[prop];

		if (translation !== undefined)
			translatedData[translation] = data[prop];

		else if (handler !== undefined)
			handler(data, translatedData);
	}

	return translatedData;
}

function translatePassengersData(passengersData) {
	var dataArray = [];

	passengersData.forEach(function(passengerData) {
		dataArray.push(translateData(passengerData));
	});

	return dataArray;
}

function translatePaymentData(cardData, billingData) {
	var translatedPaymentData = {"installments": 1};

	translatedPaymentData["credit_card"] = translateData(cardData);
	translatedPaymentData["billing_address"] = translateBillingData(billingData);

	return translatedPaymentData;
}

function translateCityData(cityData) {
	var translatedData = {};

	translatedData["id"] = cityData["id"];
	translatedData["state"] = cityData["name"];
	translatedData["country"] = {"id": cityData["country"]};

	return translatedData;
}

function translateBillingData(billingData) {
	var translatedData = {};

	translatedData["city"] = translateCityData(billingData['city-data']);

	return $.extend({}, translatedData, translateData(billingData));
}

function translatePhones(phones) {
	var translatedPhones = [];

	phones.forEach(function(phone) {
		translatedPhones.push(phone["number"]);
	});

	return translatedPhones;
}

function translateContactData(contactData) {
	var translatedData = {"email": contactData["email"]};
	translatedData["phones"] = translatePhones(contactData["phones"]);
	return translatedData;
}


/* Metodo publico */

function translateBookingData(passengersData, cardData, billingData, contactData) {
	var translatedData = {};
	var $bought = JSON.parse(sessionStorage.boughtFlight);

	translatedData["passengers"] = translatePassengersData(passengersData);
	translatedData["payment"] = translatePaymentData(cardData, billingData);
	translatedData["contact"] = translateContactData(contactData);

	console.log(JSON.stringify(translatedData));

	var bookingData = $.extend({"flight_id": $bought.container.flights[0].flight.id}, translatedData);

	console.log(JSON.stringify(bookingData));

	$.ajax({ 
        url: "http://hci.it.itba.edu.ar/v1/api/booking.groovy?method=bookflight2&booking=" + encodeURI(JSON.stringify(bookingData)) + "&callback=?",
        dataType: "jsonp"
    }).done(function(data) {
    	alert("booking = " + data["booking"]);
    });


    if ($bought.twoWays) {
		var otherBookingData = $.extend({"flight_id": $bought.container.flights[1].flight.id}, translatedData);
		console.log(JSON.stringify(otherBookingData));
		$.ajax({ 
	        url: "http://hci.it.itba.edu.ar/v1/api/booking.groovy?method=bookflight2&booking=" + encodeURI(JSON.stringify(otherBookingData)) + "&callback=?",
	        dataType: "jsonp"
	    }).done(function(data) {
	    	alert("booking = " + data["booking"]);
	    });
	}
}