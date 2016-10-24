 var MAX_NAME = 80;
var MAX_DOC_NUM = 8;
var MIN_CREDIT_NUM = 13;
var MAX_CREDIT_NUM = 16;
var MIN_SEC_CODE = 3;
var MAX_SEC_CODE = 4;
var MAX_ZIP_CODE = 10;
var MAX_ADDR_NUM = 6;
var MAX_FLOOR = 3;
var MAX_PHONE = 25;
var MAX_EMAIL = 128;
var MAX_DEPT = 2;

var ADULT_YEAR = 11;
var INFANT_YEAR = 2;

var BIRTH_DAY = 'birth-day';
var BIRTH_MONTH = 'birth-month';
var BIRTH_YEAR = 'birth-year';
var EXP_MONTH = 'exp-month';
var EXP_YEAR = 'exp-year';
var CARD_NUM = 'card-num';
var SEC_CODE = 'sec-code';

var ERROR_BIRTHDATE = 'error-birthdate';
var ERROR_INPUT = 'error-input';
var ERROR_BIRTH_DAY = 'error-birth-day';
var ERROR_BIRTH_MONTH = 'error-birth-month';
var ERROR_BIRTH_YEAR = 'error-birth-year';
var ERROR_BIRTHDATE = 'error-birthdate';
var ERROR_EXP_MONTH = 'error-exp-month';
var ERROR_EXP_YEAR = 'error-exp-year';

var CAMPO_OBLIGATORIO = 'Campo obligatorio';
var ERROR_MSG_NUMBER = 'Solo se permiten dígitos';
var ERROR_MSG_SHORT = 'Demasiado corto';
var ERROR_MSG_LONG = 'Demasiado largo';
var ERROR_MSG_ALPHANUM = 'Solo se permiten dígitos y letras';

String.prototype.toUpperFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

function mandatoryFieldString(string) {
	return 'Ingrese ' + string;
}

/* Retornan objetos que representan una validación.
** Si valid es true fue correcta y value el nuevo valor más lindo.
** Con más lindo se refiere por ejemṕlo: si es un nombre, coloca la
** primer letra en mayúscula y quita los espacios al comienzo y al final.
** Si valid es false la validación no fue correcta y en value se devuelve
** el mensaje de error.
** SI el ignore es true, el checkout.js no hace nada con la respuesta. */
function invalidValidation(val) {
    return {valid: false, value: val, ignore: false};
}

function validValidation(val) {
    return {valid: true, value: val, ignore: false};
}

function ignoreInvalidValidation(val) {
    return {valid: false, value: val, ignore: true};
}

function ignoreValidValidation(val) {
    return {valid: true, value: val, ignore: true};
}

function isNumber(num) {
	return !(/\D/.test(num));
}

function isAlphaNum(value) {
	return !(/[^\w\d]/.test(value));
}

function isAlphaSpecial(string) {
	return !(/\d/.test(string));
}

function validatePhone(phone) {
	var n = phone.length;
	var pattern = /[`!@$%^&*=\\|'/><?:;]/;


	if (n == 0)
		return invalidValidation(mandatoryFieldString('el número de teléfono'));
	if (pattern.test(phone))
		return invalidValidation('Verifique que el número de teléfono sea válido');
	if (n > MAX_PHONE)
		return invalidValidation(ERROR_MSG_LONG);

	return validValidation(phone.toUpperCase());
}

function validateEmail(email) {
	var regex = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
	var n = email.length;

	if (n == 0)
		return invalidValidation(mandatoryFieldString("el correo electrónico"));
	if (!regex.test(email))
		return invalidValidation('El correo electrónico ingresado no es válido. Verifique que tenga el siguiente formato: "ejemplo@correo.com"');
	if (n > MAX_EMAIL)
		return invalidValidation(ERROR_MSG_LONG);

	return validValidation(email.toLowerCase());
}

function validateStreet(street) {
	var n = street.length;
	var pattern = /[`!@$%^&*=\\|'/><?:;]/;

	if (n == 0)
		return invalidValidation(mandatoryFieldString("el nombre de la calle"));
	if (pattern.test(street))
		return invalidValidation('Verifique que el nombre de la calle sea válido');
	if (n > MAX_NAME)
		return invalidValidation(ERROR_MSG_LONG);

	return validValidation(street);
}

function invalidAlphaNum(name) {
	return 'Verifique que ' + name + ' sólo contenga dígitos y letras';
}

function validateAddrNum(addrNum) {
	var n = addrNum.length;

	if (n == 0)
		return invalidValidation(mandatoryFieldString("el número de la calle"));
	if (!isAlphaNum(addrNum))
		return invalidValidation(invalidAlphaNum('el número de la calle'));
	if (n > MAX_ADDR_NUM)
		return invalidValidation(ERROR_MSG_LONG);

	return validValidation(addrNum.toUpperCase());
}

function validateFloor(floor) {
	var n = floor.length;

	if (n > 0 && !isAlphaNum(floor))
		return invalidValidation(invalidAlphaNum('el piso'));
	if (n > MAX_FLOOR)
		return invalidValidation(ERROR_MSG_LONG);

	return validValidation(floor.toUpperCase());
}

function validateDepartment(dep) {
	var n = dep.length;

	if (n > 0 && !isAlphaNum(dep))
		return invalidValidation(invalidAlphaNum('el departamento'));
	if (n > MAX_DEPT)
		return invalidValidation(ERROR_MSG_LONG);

	return validValidation(dep.toUpperCase());
}

function invalidNum(name) {
	return 'Verifique que ' + name + ' sólo contenga dígitos';
}

function validateDocNum(num) {
	var n = num.length;

    if (n == 0)
        return invalidValidation(mandatoryFieldString("el número de documento"));
    if (!isNumber(num))
        return invalidValidation(invalidNum('el número de documento'));
    if (n > MAX_DOC_NUM)
        return invalidValidation(ERROR_MSG_LONG);

    return validValidation(num);
}

function validateName(string, mandatoryString, title) {
    var n = string.length;
    var pattern = /[^A-zÀ-ÿ\s]/;

    if (n > MAX_NAME)
        return invalidValidation(ERROR_MSG_LONG);

    if (n == 0)  /* Ingresó únicamente espacios o nada */
        return invalidValidation(mandatoryFieldString(mandatoryString));

    if (pattern.test(string))
        return invalidValidation("Verifique que el " + title + " sólo contenga letras y espacios");

    return validValidation(string);
}

function validateDay(d, mandatoryString) {
	if (d.length == 0)
		return invalidValidation(mandatoryFieldString(mandatoryString));
	if (!isNumber(d))
		return invalidValidation(invalidNum('el día'));
	if (d < 1 || d > 31)
		return invalidValidation('Verifique que el día se encuentre entre 1 y 31');
	if (d.length == 1)
		d = '0' + d;
	return validValidation(d);
}

function validateMonth(m, mandatoryString) {
	if (m.length == 0)
		return invalidValidation(mandatoryFieldString(mandatoryString));
	if (!isNumber(m))
		return invalidValidation(invalidNum('el mes'));
	if (m < 1 || m > 12)
		return invalidValidation('Verifique que el mes se encuentre entre 1 y 12');
	if (m.length == 1)
		m = '0' + m;
	return validValidation(m);
}

function validateYear(y, mandatoryString) {
	var currentDate = new Date();
	if (y.length == 0)
		return invalidValidation(mandatoryFieldString(mandatoryString));
	if (!isNumber(y))
		return invalidValidation(invalidNum('el año'));
	if (y < 1880 && mandatoryString.includes('nacimiento'))
		return invalidValidation('Verifique que el año sea mayor a 1880');
	if (!mandatoryString.includes('nacimiento') && y < currentDate.getFullYear())
		return invalidValidation('Tarjeta vencida');

	return validValidation(y);
}

function removeBirthErrorState(fieldId, errorNodeId) {
	var errorNode = $('#' + errorNodeId);
	$('#' + fieldId).removeClass(ERROR_INPUT);
	errorNode.hide();
	errorNode.text('');
}

function setBirthErrorState(fieldId, errorNodeId, string) {
	var errorNode = $('#' + errorNodeId);
	errorNode.text(string);
	errorNode.fadeIn();
	$('#' + fieldId).addClass(ERROR_INPUT);
}

function manageBirthErrors(validation, fieldId, errorNodeId) {
	if (validation.valid) {
		removeBirthErrorState(fieldId, errorNodeId);
		return ignoreValidValidation(validation.value);
	}

 	/* Mensaje como fecha inválida o tarjeta vencida */
	var globalError = $('#' + fieldId).siblings('.error-msg').eq(0);

	if (globalError.is(":visible")) {
		globalError.hide();
		globalError.siblings('input').removeClass(ERROR_INPUT);
	}

	setBirthErrorState(fieldId, errorNodeId, validation.value);
	return ignoreInvalidValidation(validation.value);
}

function validateZipCode(zipCode) {
	var n = zipCode.length;

	if (n == 0)
		return invalidValidation(mandatoryFieldString("el código postal"));
	if (!isAlphaNum(zipCode))
		return invalidValidation(invalidAlphaNum('el código postal'));
	if (n > MAX_ZIP_CODE)
		return invalidValidation(ERROR_MSG_LONG);

	return validValidation(zipCode.toUpperCase());
}

function validateCardNumber(num) {
	var n = num.length;

	if (!isNumber(num))
		return invalidValidation(invalidNum('el número de la tarjeta'));
	if (n == 0)
		return invalidValidation(mandatoryFieldString("el número de la tarjeta"));

	return validValidation(num);
}

function validateExpMonth(num) {
	var validation = validateMonth(num, "el mes de vencimiento de la tarjeta");
	return manageBirthErrors(validation, EXP_MONTH, ERROR_EXP_MONTH);
}

function validateExpYear(num) {
	if (num.length == 2)
		num = '20' + num;
	var validation = validateYear(num, "el año de vencimiento de la tarjeta");
	return manageBirthErrors(validation, EXP_YEAR, ERROR_EXP_YEAR);
}

function validateSecCode(num) {
	var n = num.length;

	if (!isNumber(num))
		return invalidValidation(invalidNum('el código de seguridad de la tarjeta'));
	if (n == 0)
		return invalidValidation(mandatoryFieldString("el código de seguridad de la tarjeta"));
	if (n < MIN_SEC_CODE)
		return invalidValidation(ERROR_MSG_SHORT);
	if (n > MAX_SEC_CODE)
		return invalidValidation(ERROR_MSG_LONG);

	return validValidation(num);
}

function validateCardholder(cardholder) {
	var validation = validateName(cardholder, "el nombre del titular de la tarjeta", "nombre del titular de la tarjeta");

	if (validation.valid && cardholder.split(' ').length < 2)
		validation = invalidValidation("Incluya nombre y apellido del titutar de la tarjeta");

	return validation;
}

var noInternetError = false;

function validateCreditCardAPI(number, expDate, secCod, callback, id, validation) {

	if (noInternetError) {
		$('#' + CARD_NUM).removeClass(ERROR_INPUT);
		$('#' + EXP_YEAR).removeClass(ERROR_INPUT);
		$('#' + EXP_MONTH).removeClass(ERROR_INPUT);
		$('#' + SEC_CODE).removeClass(ERROR_INPUT);
		$('#error-internet-card').hide();
		noInternetError = false;
	}


	$.ajax({
        url: "http://hci.it.itba.edu.ar/v1/api/booking.groovy?method=validatecreditcard&number="+number+"&exp_date="+expDate+"&sec_code="+secCod+"&callback=?",
        dataType: "jsonp",
        timeout: 4000,
        success: function(data) {
        	callback(data.valid, id, validation);
        },
        error: function() {
        	if (!noInternetError) {
	        	$('#error-internet-card').fadeIn();
				$('#' + CARD_NUM).addClass(ERROR_INPUT);
				$('#' + EXP_YEAR).addClass(ERROR_INPUT);
				$('#' + EXP_MONTH).addClass(ERROR_INPUT);
				$('#' + SEC_CODE).addClass(ERROR_INPUT);
			}
	        validCreditCard = false;
			noInternetError = true;
        }
    });
}

function validateDate(day, month, year) {
    var birthDate = new Date(year, month - 1, day);
	var months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    if (birthDate.getMonth()+1 != month)
        return invalidValidation('No existe la fecha ' + day + ' de ' + months[month-1] + ' de ' + year);

    return validValidation();
}

function validateBirthDay(d, passengerId) {
	var validation = validateDay(d, "el día de nacimiento");

	return manageBirthErrors(validation, BIRTH_DAY + '-' + passengerId, ERROR_BIRTH_DAY + '-' + passengerId);
}
function validateBirthMonth(m, passengerId) {
	var validation = validateMonth(m, "el mes de nacimiento");

	return manageBirthErrors(validation, BIRTH_MONTH + '-' + passengerId, ERROR_BIRTH_MONTH + '-' + passengerId);
}
function validateBirthYear(y, passengerId) {
	var validation = validateYear(y, "el año de nacimiento");

	return manageBirthErrors(validation, BIRTH_YEAR + '-' + passengerId, ERROR_BIRTH_YEAR + '-' + passengerId);
}

function validateAdultDate(day, month, year, travelDate) {
	var birthDate = new Date(year, month - 1, day);
	var maxBirthDate = new Date(travelDate);
	maxBirthDate.setFullYear(maxBirthDate.getFullYear() - ADULT_YEAR);

	if (birthDate > maxBirthDate)
		return invalidValidation('Verifique que el pasajero tenga una edad de 11 años o más al finalizar el viaje');

	return validValidation();
}

function validateInfantDate(day, month, year, travelDate) {
	var birthDate = new Date(year, month - 1, day);
	var minBirthDate = new Date(travelDate);
	minBirthDate.setFullYear(minBirthDate.getFullYear() - INFANT_YEAR);

	if (birthDate < minBirthDate || birthDate > travelDate)
		return invalidValidation('Verifique que el pasajero tenga una edad menor de 2 años al finalizar el viaje');

	return validValidation();
}

function validateChildDate(day, month, year, travelDate) {
	var birthDate = new Date(year, month - 1, day);

	if (validateAdultDate(day, month, year, travelDate).valid || validateInfantDate(day, month, year, travelDate).valid || birthDate > travelDate)
		return invalidValidation('Verifique que el pasajero tenga una edad entre 2 y 11 años al finalizar el viaje');

	return validValidation();
}

function validateCountry(name) {
	var validation = invalidValidation('País inválido');

	if (!name.length)
		return invalidValidation(mandatoryFieldString("el país"));

	countries.forEach(function (country) {
		if (country['name'].toUpperCase() == name.toUpperCase())
			validation = validValidation(name);
	});

	return validation;
}


function validateCity(name) {
	var validation = invalidValidation('Ciudad inválida');

	if(!name.length)
		return invalidValidation(mandatoryFieldString("la ciudad"));

	if (currentCities) {
		currentCities.forEach(function(city) {
			if (city['name'].toUpperCase() == name.toUpperCase())
				validation = validValidation(name);
		});
	}
	
	return validation;
}

function validateFirstName(value) {
	return validateName(value, "el nombre del pasajero", "nombre del pasajero");
}

function validateLastName(value) {
	return validateName(value, "el apellido del pasajero", "apellido del pasajero");
}

/* VALIDADORES
** Métodos públicos:
**
** validate(id, value)
** 		Valida el valor del campo con ese id y value.
** validateStage()
**		Valida la etapa entera. Si hubo un campo que ni se tocó
**		muestra error de campo obligatorio dependiendo del campo.
** getData()
**      Devuelve los datos.
**
** Atributos:
**
** data: objeto que guarda cada valor de los campos de la etapa según id
**       del campo. Estos valores pueden ser null si fue el campo visitado
**       pero no es correcto y es undefined si nunca fue visitado.
**
** Después tienen cosas muy propias de la etapa como flags, mapa de id-->función,
** lo que pinte.
*/


/* cantidad de adultos, niños, infantes y fecha de finalización de viaje */
function PassengersValidator(ad, ch, inf, travelDate) {

	this.passengerValidators = [];
	this.adults = ad;
	this.childs = ch;
	this.infants = inf;

	this.amount = 0;

	while (ad--)
		this.passengerValidators.push(new PassengerValidator("Adulto", validateAdultDate, travelDate, this.amount++));

	while (ch--)
		this.passengerValidators.push(new PassengerValidator("Niño", validateChildDate, travelDate, this.amount++));

	while (inf--)
		this.passengerValidators.push(new PassengerValidator("Infante", validateInfantDate, travelDate, this.amount++));

	this.getData = function() {
		var data = [];

		this.passengerValidators.forEach(function(passValidator) {
			data.push(passValidator.getData());
		});

		return data;
	}

	this.alreadyValidated = function(id) {
		var split = id.split('-');
		var passId = split.pop();

		return this.passengerValidators[passId].alreadyValidated(split.join('-'));				
	}

	this.validate = function(id, value) {
		var split = id.split('-');
		var passId = split.pop();

		return this.passengerValidators[passId].validate(split.join('-'), value);
	}

	this.validateStage = function() {
		var valid = true;

		this.passengerValidators.forEach(function(passValidator) {
			if(!passValidator.validateStage())
				valid = false;
		});

		return valid;
	}

	this.generateBackup = function() {
		this.passengerValidators.forEach(function(passValidator) {
			passValidator.generateBackup();
		});
	}

	this.applyBackup = function() {
		this.passengerValidators.forEach(function(passValidator) {
			passValidator.applyBackup();
		});
	}
}

function PassengerValidator(type, validateFunction, trDate, passId) {

	/* Mapa id-->función. Las que tienen función null es porque no son input, sino de selección
	** (no hay que validar) */

    this.data = {'type': type};
    this.backup = {};
    this.validDate = false;
    this.travelDate = trDate;
    this.validateBirthCategory = validateFunction;
    this.passengerId = passId;

	this.inputValidations = {	'usr-name': validateFirstName,
                                'usr-lname': validateLastName,
                                'usr-docnum': validateDocNum,
                                'birth-day': validateBirthDay,
                                'birth-month': validateBirthMonth,
                                'birth-year': validateBirthYear,
                                'usr-doc': null,
                            };


    this.getData = function() {
    	return $.extend(true, {}, this.data);
    }

    this.generateBackup = function() {
    	this.backup = this.getData();
    }

    this.applyBackup = function() {
    	for (var prop in this.backup) {
    		if (!prop.includes('$$')) {
	    		var form = $('#' + prop + '-' + this.passengerId);
	    		this.data[prop] = this.backup[prop];
	    		form.val(this.data[prop]);
	    		removeErrorState(form);
	    		form.siblings('.error-msg').hide();
    		}
    	}
    	this.backup = {};
    	this.validDate = true;
    }

    this.birthDateReady = function() {
    	return this.data[BIRTH_DAY] && this.data[BIRTH_MONTH] && this.data[BIRTH_YEAR];
    }

    this.birthId = function(id) {
    	return id ==  BIRTH_DAY || id == BIRTH_MONTH || id == BIRTH_YEAR;
    }

    this.validateBirthDate = function(day, month, year) {
    	this.validDate = false;

    	var validation = validateDate(day, month, year);

    	if (validation.valid) {
    		validation = this.validateBirthCategory(day, month, year, this.travelDate);
    		this.validDate = validation.valid;
    	}

    	return validation;
    }

	this.alreadyValidated = function(id) {
		return this.data[id] !== undefined;
	}

    this.validate = function(id, value) {
    	var validateFunction = this.inputValidations[id];
    	var validation;

 		/* Flag de campo visitado; por ahora erróneo hasta que la
 		** validación demuestre lo contrario. */
    	this.data[id] = null;

    	if (validateFunction) {
    		validation = validateFunction(value, this.passengerId);

    		if (validation.valid) {
    			this.data[id] = validation.value; /* agregamos a los datos */

    			if (this.birthDateReady() && this.birthId(id)) {
    				var niceValue = validation.value;
    				validation = this.validateBirthDate(this.data[BIRTH_DAY], this.data[BIRTH_MONTH], this.data[BIRTH_YEAR]);
    				this.validDate = validation.valid;

    				if (!validation.valid) {/* Pone en rojo todos los campos de cumpleaños */
    					var $focused = $('#' + id + '-' + this.passengerId);
    					$focused.siblings('input').addClass(ERROR_INPUT);
	    				$focused.addClass(ERROR_INPUT);
	    				$focused.val(niceValue);
	    			}
	    			else
	    				validation.value = niceValue;
    			}
    		}
    	}

    	return validation;
    }

    this.validateStage = function() {
    	/* Es necesario que se llame a validateStep pues coloca los mensaje de campo obligatorio,
    	** más allá de que la fecha sea válida o no. Sino podría devolver un arreglo con los ids
    	** de los campos no llenados. */
    	return validateStep(this.data, this.inputValidations, undefined, this.passengerId) && this.validDate;
    }
}

var isErrorCardShowed = false;
var validCreditCard = false;

function PaymentCardValidator() {

	this.callback = function(valid, id, validation) {
		validCreditCard = valid;
		if (!valid) {
			setCreditCardError();
			isErrorCardShowed = true;
			validation.ignore = true;
			$('#' + id).siblings('p').hide();
		}		
	}

	this.expDateReady = function() {
		return this.data[EXP_YEAR] && this.data[EXP_MONTH];
	}

	this.expId = function(id) {
		return EXP_YEAR == id || EXP_MONTH == id;
	}

	this.creditCardReady = function() {
		return this.expDateReady() && this.validExpDate && this.data[CARD_NUM] && this.data[SEC_CODE];
	}

	this.validateExpDate = function() {
		var currentDate = new Date();
		var currentYear = currentDate.getFullYear();
		var currentMonth = currentDate.getMonth()+1;
		var expYear = this.data[EXP_YEAR];
		var expMonth = this.data[EXP_MONTH];

		if (!expYear || !expMonth || expYear < currentYear || (expYear == currentYear && expMonth < currentMonth)) {
			this.validExpDate = false;
			return invalidValidation('Tarjeta vencida');
		}

		this.validExpDate = true;

	    return validValidation();
	}

	this.creditCardId = function(id) {
		return this.expId(id) || CARD_NUM == id || SEC_CODE == id;
	}

	this.validateCreditCard = function(id, validation) {
		var expDate = this.data[EXP_MONTH] + this.data[EXP_YEAR].slice(-2);
		this.validCreditCard = validateCreditCardAPI(this.data[CARD_NUM], expDate, this.data[SEC_CODE], this.callback, id, validation);

		return this.validCreditCard;
	}

	this.inputValidations = { 'card-num': validateCardNumber,
							  'exp-month': validateExpMonth,
							  'exp-year': validateExpYear,
							  'sec-code': validateSecCode,
							  'cardholder': validateCardholder,
							};

	this.validExpDate = false;
	this.data = {};
    this.backup = {};

	this.getData = function() {
		return $.extend(true, {}, this.data);
	}

    this.generateBackup = function() {
    	this.backup = this.getData();
    }

    this.applyBackup = function() {
    	for (var prop in this.backup) {
    		var form = $('#' + prop)
    		this.data[prop] = this.backup[prop];
    		form.val(this.data[prop]);
    		removeErrorState(form);
    	    form.siblings('.error-msg').hide();
    	}
    	this.backup = {};
    	this.validCreditCard = true;
    	this.validExpDate = true;
    	this.isErrorCardShowed = false;
    	removeCreditCardError();
    }

	this.alreadyValidated = function(id) {
		return this.data[id] !== undefined;
	}

	this.validate = function(id, value) {
		var validateFunction = this.inputValidations[id];

		if (!validateFunction)
			return undefined;

		this.data[id] = null;

		/* Se quita cartel de error de tarjeta de cŕedito si
		** modifica algo relacionado a la tarjeta de crédito */
		if (this.creditCardId(id) && (isErrorCardShowed || noInternetError)) {
			$('#error-internet-card').hide();
			removeCreditCardError();
			isErrorCardShowed = false;
			noInternetError = false;
		}

		var validation = validateFunction(value);


		if (validation.valid) {
			this.data[id] = validation.value;

			if (this.expDateReady() && this.expId(id)) {
				var niceValue = validation.value;
				validation = this.validateExpDate();
   				if (!validation.valid) {  /* Pone en rojo todos los campos de vencimiento */
    				var $focused = $('#' + id);
    				$focused.siblings('input').addClass(ERROR_INPUT);
	    			$focused.addClass(ERROR_INPUT);
	    			$focused.val(niceValue);
	    		}
	    		else
	    			validation.value = niceValue;
			}

	    	if (this.creditCardReady() && this.creditCardId(id)) {
	    		this.validateCreditCard(id, validation);
	    	}
		}

		return validation;
	}

	this.validateStage = function() {
    	return validateStep(this.data, this.inputValidations) && validCreditCard;
	}


}

function removeCreditCardError() {
	$('#error-card').hide();
	$('#' + CARD_NUM).removeClass(ERROR_INPUT);
	$('#' + EXP_YEAR).removeClass(ERROR_INPUT);
	$('#' + EXP_MONTH).removeClass(ERROR_INPUT);
	$('#' + SEC_CODE).removeClass(ERROR_INPUT);
}

function setCreditCardError() {
	$('#error-card').fadeIn();
	$('#' + CARD_NUM).addClass(ERROR_INPUT);
	$('#' + EXP_YEAR).addClass(ERROR_INPUT);
	$('#' + EXP_MONTH).addClass(ERROR_INPUT);
	$('#' + SEC_CODE).addClass(ERROR_INPUT);
}

function getCityData(city) {
	for (var i = 0; i < currentCities.length; i++) {
		if(currentCities[i]["name"].toUpperCase() == city.toUpperCase())
			return currentCities[i];
	}
}

function PaymentAddressValidator() {

	this.isOptional = function(id) {
		return this.optionalValidations[id] !== undefined;
	}

	this.inputValidations = { 'street': validateStreet,
							  'addr-num': validateAddrNum,
							  'zip-code': validateZipCode,
							  'country': validateCountry,
							  'city': validateCity
							};

	this.optionalValidations = { 'floor': validateFloor,
							  	 'department': validateDepartment
							   };

	this.data = {'floor':'', 'department':''};
    this.backup = {};

	this.getData = function() {
		return $.extend(true, {}, this.data);
	}

    this.generateBackup = function() {
    	this.backup = this.getData();
    }

    this.applyBackup = function() {
    	for (var prop in this.backup) {
    		var form = $('#' + prop)
    		this.data[prop] = this.backup[prop];
    		form.val(this.data[prop]);
    		removeErrorState(form);
    	}
    	this.backup = {};
    }

	this.alreadyValidated = function(id) {
		return this.data[id] !== undefined;
	}

	this.validate = function(id, value) {
		var inputValidation = this.inputValidations[id] || this.optionalValidations[id];

		if (!inputValidation)
			return undefined;

		this.data[id] = null;

		var validation = inputValidation(value);

		if (validation.valid) {
			this.data[id] = validation.value;
			if (id == 'city')
				this.data['city-data'] = getCityData(validation.value);
		}

		return validation;
	}

	this.validateStage = function() {
		return validateStep(this.data, this.inputValidations, this.optionalValidations);
	}
}

function PaymentValidator() {
	this.addrValidator = new PaymentAddressValidator();
	this.cardValidator = new PaymentCardValidator();

    this.generateBackup = function() {
    	this.addrValidator.generateBackup();
    	this.cardValidator.generateBackup();
    }

    this.applyBackup = function() {
 		this.addrValidator.applyBackup();
 		this.cardValidator.applyBackup();
    }

	this.getCardData = function() {
		return this.cardValidator.getData();
	}

	this.getBillingData = function() {
		return this.addrValidator.getData();
	}

	this.validateCreditCard = function() {
		this.cardValidator.validateCreditCard('', validValidation(''));
	}

	this.alreadyValidated = function(id) {
		return this.cardValidator.alreadyValidated(id) || this.addrValidator.alreadyValidated(id);
	}

	this.getData = function() {
		var data = {};

		$.extend(data, this.cardValidator.getData());
		$.extend(data, this.addrValidator.getData());

		return data;
	}

	this.validate = function(id, value) {
		return this.cardValidator.validate(id, value) || this.addrValidator.validate(id, value);
	}

	this.validateStage = function() {
		var valid = this.cardValidator.validateStage();
		return this.addrValidator.validateStage() && valid;
	}
}


function ContactValidator() {

	this.email;
    this.phones = {'phone-0': undefined}; /* pares id: teléfono*/

    this.backupEmail;
    this.backupPhones = {};

	this.phoneId = function(id) {
		return id != 'email';
	}

    this.addPhone = function(id) {
    	this.phones['phone-' + id] = undefined;
    }

    this.removePhone = function(id) {
    	delete this.phones['phone-' + id];
    }
    this.getBackupPhones = function() {
    	return this.backupPhones;
    }

    this.generateBackup = function() {
    	this.backupPhones = $.extend(true, {}, this.phones);
    	this.backupEmail = this.email;
    }

    this.applyBackup = function() {
    	this.phones = {};

    	for (var prop in this.backupPhones) {
    		var form = $('#' + prop);
    		this.phones[prop] = this.backupPhones[prop];
    		form.val(this.phones[prop]);
    		removeErrorState(form);
    		form.siblings('.error-msg').hide();
    	}

    	this.email = this.backupEmail;

    	var form = $('#email');
    	form.val(this.email);
    	removeErrorState(form);
    	form.siblings('.error-msg').hide();

    	this.backup = {};
    }

	this.getData = function() {
		var data = {'email': this.email, 'phones': []};
		for (var prop in this.phones) {
			var type = $('#' + 'phone-type-' + prop.split('-')[1]).val();
			data['phones'].push({'type': type, 'number': this.phones[prop]});
		}
		return data;
	}

	this.alreadyValidated = function(id) {
		if (id == 'email')
			return this.email !== undefined;
		else
			return this.phones[id] !== undefined;
	}

	this.validate = function(id, value) {
		var validation;
		if (id.includes('phone')) {
			this.phones[id] = null;
			validation = validatePhone(value);
			if (validation.valid)
				this.phones[id] = validation.value;
		}
		else if (id == 'email') {
			this.email = null
			validation = validateEmail(value);
			if (validation.valid)
				this.email = validation.value;
		}

		return validation;
	}

	this.invalidPhones = function() {
		var invalid = false;
		for(var prop in this.phones) {
			if (this.phones[prop] === null)
				invalid = true;
			else if (this.phones[prop] === undefined || this.phones[prop].length == 0) {
				setErrorState($('#' + prop), validatePhone('').value);
				this.phones[prop] = null;
				invalid = true;
			}
		}
		return invalid;
	}

	this.validateStage = function() {
		var valid = !this.invalidPhones();
		return validateStep({'email': this.email}, {'email': validateEmail}) && valid;
	}
}

/* Itera sobre los campos de step y se fija que en data
** estén los valores de dichos campos válidos. Si vale
** null algún campo significa que fue visitado por el
** usuario pero quedó erróneo. Si vale undefined ni fue
** visitado. */
function validateStep(data, step, optionals, extraId) {
    var valid = true;

    for (var prop in step) {
        var $id = $('#' + prop);

        if (step[prop] !== null) {
            if (data[prop] === undefined) { /* No hay mensaje de error, hay que colocarlo */
                valid = false;
                data[prop] = null;   /* Mensaje de error colocado --> reemplazamos undefined por null */
                var errorValidation = step[prop]('', extraId);
                if (extraId === undefined && !errorValidation.ignore)
                	setErrorState($id, errorValidation.value); /* Esta función se encuentra en checkout.js*/
                else if (!errorValidation.ignore)
                	setErrorState($('#' + prop + '-' + extraId), errorValidation.value);
            }
            else if (data[prop] === null) { /* Ya tiene el mensaje de error correspondiente */
                valid = false;
            }
        }
        else if (extraId === undefined) { /* Retira el valor de algo que no es input */
            data[prop] = $id.val();
        }
        else {
        	data[prop] = $('#' + prop + '-' + extraId).val();
        }
    }

    if (optionals) {
    	for (var prop in optionals) {
    		if (data[prop] === null)
    			valid = false;
    	}
    }

    return valid;
}
