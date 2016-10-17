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

	if (n == 0)
		return invalidValidation(CAMPO_OBLIGATORIO);
	if (n > MAX_PHONE)
		return invalidValidation(ERROR_MSG_LONG);

	return validValidation(phone.toUpperCase());
}

function validateEmail(email) {
	var regex = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
	var n = email.length;

	if (n == 0)
		return invalidValidation(CAMPO_OBLIGATORIO);
	if (!regex.test(email))
		return invalidValidation('E-mail inválido');
	if (n > MAX_EMAIL)
		return invalidValidation(ERROR_MSG_LONG);

	return validValidation(email.toLowerCase());
}

function validateStreet(street) {
	var n = street.length;

	if (n == 0)
		return invalidValidation(CAMPO_OBLIGATORIO);
	if (n > MAX_NAME)
		return invalidValidation(ERROR_MSG_LONG);

	return validValidation(street);
}

function validateAddrNum(addrNum) {
	var n = addrNum.length;

	if (n == 0)
		return invalidValidation(CAMPO_OBLIGATORIO);
	if (!isAlphaNum(addrNum))
		return invalidValidation(ERROR_MSG_ALPHANUM);
	if (n > MAX_ADDR_NUM)
		return invalidValidation(ERROR_MSG_LONG);

	return validValidation(addrNum.toUpperCase());
}

function validateFloor(floor) {
	var n = floor.length;

	if (n > 0 && !isAlphaNum(floor))
		return invalidValidation(ERROR_MSG_ALPHANUM);
	if (n > MAX_FLOOR)
		return invalidValidation(ERROR_MSG_LONG);

	return validValidation(floor.toUpperCase());
}

function validateDepartment(dep) {
	var n = dep.length;

	if (n > 0 && !isAlphaNum(dep))
		return invalidValidation(ERROR_MSG_ALPHANUM);
	if (n > MAX_DEPT)
		return invalidValidation(ERROR_MSG_LONG);

	return validValidation(dep.toUpperCase());
}

function validateDocNum(num) {
	var n = num.length;

    if (n == 0)
        return invalidValidation(CAMPO_OBLIGATORIO);
    if (!isNumber(num))
        return invalidValidation(ERROR_MSG_NUMBER);
    if (n > MAX_DOC_NUM)
        return invalidValidation(ERROR_MSG_LONG);

    return validValidation(num);
}

function validateName(string) {
    var n = string.length;

    if (n > MAX_NAME)
        return invalidValidation(ERROR_MSG_LONG);

    if (n == 0)  /* Ingresó únicamente espacios o nada */
        return invalidValidation(CAMPO_OBLIGATORIO);

    if (!isAlphaSpecial(string))
        return invalidValidation("Solo se permiten letras y espacios");

    return validValidation(string);
}

function validateDay(d) {
	if (d.length == 0)
		return invalidValidation('Día obligatorio');
	if (!isNumber(d) || d < 1 || d > 31)
		return invalidValidation('Día inválido');
	if (d.length == 1)
		d = '0' + d;
	return validValidation(d);
}

function validateMonth(m) {
	if (m.length == 0)
		return invalidValidation('Mes obligatorio');
	if (!isNumber(m) || m < 1 || m > 12)
		return invalidValidation('Mes inválido');
	if (m.length == 1)
		m = '0' + m;
	return validValidation(m);
}

function validateYear(y) {
	if (y.length == 0)
		return invalidValidation('Año obligatorio');
	if (!isNumber(y) || y < 1880)
		return invalidValidation('Año inválido');
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
		return invalidValidation(CAMPO_OBLIGATORIO);
	if (!isAlphaNum(zipCode))
		return invalidValidation(ERROR_MSG_ALPHANUM);
	if (n > MAX_ZIP_CODE)
		return invalidValidation(ERROR_MSG_LONG);

	return validValidation(zipCode.toUpperCase());
}

function validateCardNumber(num) {
	var n = num.length;

	if (!isNumber(num))
		return invalidValidation(ERROR_MSG_NUMBER);
	if (n == 0)
		return invalidValidation(CAMPO_OBLIGATORIO);
	if (n < MIN_CREDIT_NUM) 
		return invalidValidation(ERROR_MSG_SHORT);
	if (n > MAX_CREDIT_NUM)
		return invalidValidation(ERROR_MSG_LONG);

	return validValidation(num);
}

function validateExpMonth(num) {
	var validation = validateMonth(num);
	return manageBirthErrors(validation, EXP_MONTH, ERROR_EXP_MONTH);
}

function validateExpYear(num) {
	if (num.length == 2)
		num = '20' + num;
	var validation = validateYear(num);
	return manageBirthErrors(validation, EXP_YEAR, ERROR_EXP_YEAR);
}

function validateSecCode(num) {
	var n = num.length;

	if (!isNumber(num))
		return invalidValidation(ERROR_MSG_NUMBER);
	if (n == 0)
		return invalidValidation(CAMPO_OBLIGATORIO);
	if (n < MIN_SEC_CODE)
		return invalidValidation(ERROR_MSG_SHORT);
	if (n > MAX_SEC_CODE)
		return invalidValidation(ERROR_MSG_LONG);

	return validValidation(num);
}

/* TODO: Preguntar. En las tarjetas de crédito aparece más que primer nombre y apellido */
function validateCardholder(cardholder) {
	return validateName(cardholder);
}

function validateCreditCardAPI(number, expDate, secCod) {
    var valid = false;
    $.ajax({
        url: "http://hci.it.itba.edu.ar/v1/api/booking.groovy?method=validatecreditcard&number="+number+"&exp_date="+expDate+"&sec_code="+secCod+"&callback=?",
        dataType: "jsonp"
    }).done(function(data) {
        valid = data.valid;
    });
    return Math.random() > 0.5;
    return valid;
}

function validateDate(day, month, year) {
    var birthDate = new Date(year, month - 1, day);

    if (birthDate.getMonth()+1 != month)
        return invalidValidation('Fecha inválida');

    return validValidation();    	
}

var ADULT_YEAR = 11;
var INFANT_YEAR = 2;

function validateAdultDate(day, month, year, travelDate) {
	var birthDate = new Date(year, month - 1, day);
	var maxBirthDate = new Date(travelDate);
	maxBirthDate.setFullYear(maxBirthDate.getFullYear() - ADULT_YEAR);

	if (birthDate > maxBirthDate)
		return invalidValidation('Fecha inválida de adulto');

	return validValidation();
}

function validateInfantDate(day, month, year, travelDate) {
	var birthDate = new Date(year, month - 1, day);
	var minBirthDate = new Date(travelDate);
	minBirthDate.setFullYear(minBirthDate.getFullYear() - INFANT_YEAR);

	if (birthDate < minBirthDate || birthDate > travelDate)
		return invalidValidation('Fecha inválida de infante');

	return validValidation();
}

function validateChildDate(day, month, year, travelDate) {
	var birthDate = new Date(year, month - 1, day);

	if (validateAdultDate(day, month, year, travelDate).valid || validateInfantDate(day, month, year, travelDate).valid || birthDate > travelDate)
		return invalidValidation('Fecha inválida de niño');

	return validValidation();
}

/* VALIDADORES 
** Métodos públicos: 
** 
** validate(id, value)
** 		Valida el valor del campo con ese id y value.
** validateStage()
**		Valida la etapa entera. Si hubo un campo que ni se tocó
**		muestra error CAMPO_OBLIGATORIO.
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

function validateCountry(name) {
	var validation = invalidValidation('País inválido');

	countries.forEach(function (country) {
		if (country['name'].toUpperCase() == name.toUpperCase())
			validation = validValidation(name);
	});

	return validation;
}


function validateCity(name) {
	var validation = invalidValidation('Ciudad inválida');

	if (currentCities) {
		currentCities.forEach(function(city) {
			if (city['name'].toUpperCase() == name.toUpperCase())
				validation = validValidation(name);
		});
	}
	return validation;
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

	this.validateBirthDay = function(d, passengerId) {
		var validation = validateDay(d);
		
		return manageBirthErrors(validation, BIRTH_DAY + '-' + passengerId, ERROR_BIRTH_DAY + '-' + passengerId);
	}

	this.validateBirthMonth = function(m, passengerId) {
		var validation = validateMonth(m);
		
		return manageBirthErrors(validation, BIRTH_MONTH + '-' + passengerId, ERROR_BIRTH_MONTH + '-' + passengerId);
	}

	this.validateBirthYear = function(y, passengerId) {
		var validation = validateYear(y);
		
		return manageBirthErrors(validation, BIRTH_YEAR + '-' + passengerId, ERROR_BIRTH_YEAR + '-' + passengerId);
	}

	this.inputValidations = {	'usr-name': validateName,
                                'usr-lname': validateName,
                                'usr-docnum': validateDocNum,
                                'birth-day': this.validateBirthDay,
                                'birth-month': this.validateBirthMonth,
                                'birth-year': this.validateBirthYear,
                                'usr-country': validateCountry,
                                'usr-doc': null,
                                'usr-gen': null };


    this.getData = function() {
    	return this.data;
    }

    this.generateBackup = function() {
    	this.backup = $.extend(true, {}, this.getData());
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

function PaymentCardValidator() {

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

	this.validateCreditCard = function() {
		var expDate = this.data[EXP_MONTH] + this.data[EXP_YEAR].slice(-2);
		this.validCreditCard = validateCreditCardAPI(this.data[CARD_NUM], expDate, this.data[SEC_CODE]);

		return this.validCreditCard;
	}

	this.inputValidations = { 'card-num': validateCardNumber,
							  'exp-month': validateExpMonth,
							  'exp-year': validateExpYear,
							  'sec-code': validateSecCode,
							  'cardholder': validateCardholder,
							  'installments': null
							};

	this.validCreditCard = false;
	this.validExpDate = false;
	this.isErrorCardShowed = false;
	this.data = {};
    this.backup = {};

	this.getData = function() {
		return this.data;
	}

    this.generateBackup = function() {
    	this.backup = $.extend(true, {}, this.getData());
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

	this.validate = function(id, value) {
		var validateFunction = this.inputValidations[id];

		if (!validateFunction)
			return undefined;

		this.data[id] = null;

		/* Se quita cartel de error de tarjeta de cŕedito si 
		** modifica algo relacionado a la tarjeta de crédito */
		if (this.creditCardId(id) && this.isErrorCardShowed) {
			removeCreditCardError();
			this.isErrorCardShowed = false;
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
	    		if (!this.validateCreditCard()) {
	    			setCreditCardError();
	    			this.isErrorCardShowed = true;
	    			validation.ignore = true;
	    			$('#' + id).siblings('p').hide();
	    		}
	    	}
		}

		return validation;
	}

	this.validateStage = function() {
    	return validateStep(this.data, this.inputValidations) && this.validCreditCard;
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
		return this.data;
	}

    this.generateBackup = function() {
    	this.backup = $.extend(true, {}, this.getData());
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

	this.validate = function(id, value) {
		var inputValidation = this.inputValidations[id] || this.optionalValidations[id];

		if (!inputValidation)
			return undefined;

		this.data[id] = null;

		var validation = inputValidation(value);

		if (validation.valid) {
			this.data[id] = validation.value;
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

	this.getAddressData = function() {
		return this.addrValidator.getData();
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
    		var form = $('#' + prop)
    		this.phones[prop] = this.backupPhones[prop];
    		form.val(this.data[prop]);
    		removeErrorState(form);
    		form.siblings('.error-msg').hide();
    	}

    	this.email = this.backupEmail;

    	var form = $('#email')
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
		for(var prop in this.phones)
			if (this.phones[prop] == null)
				return true;
	}

	this.validateStage = function() {
		var valid = validateStep(this.phones, this.phones) && !this.invalidPhones();
		return validateStep({'email': this.email}, {'email': this.email}) && valid;
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
                if (extraId === undefined)
                	setErrorState($id, CAMPO_OBLIGATORIO); /* Esta función se encuentra en checkout.js*/
                else 
                	setErrorState($('#' + prop + '-' + extraId), CAMPO_OBLIGATORIO);
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