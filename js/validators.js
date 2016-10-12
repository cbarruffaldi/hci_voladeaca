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
	var regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
	var n = email.length;

	if (n == 0)
		return invalidValidation(CAMPO_OBLIGATORIO);
	if (!regex.test(email))
		return invalidValidation('Email inválido');
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
	if (d < 1 || d > 31)
		return invalidValidation('Día inválido');
	return validValidation(d);
}

function validateMonth(m) {
	if (m.length == 0)
		return invalidValidation('Mes obligatorio');
	if (m < 1 || m > 12)
		return invalidValidation('Mes inválido');
	if (m.length == 1)
		m = '0' + m;
	return validValidation(m);
}

function validateYear(y) {
	if (y.length == 0)
		return invalidValidation('Año obligatorio');
	if (y < 1900)
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

/* TODO: cambiar el random cuando ande la API */
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

/* TODO: cantidad de adultos, infantes y niños */
function PassengerValidator() {

	/* Son de clase porq quizás cuando haya más pasajeros haya que concatenar
	** las constantes con algún identificador más */
	this.validateBirthDay = function(d) {
		var validation = validateDay(d);
		
		return manageBirthErrors(validation, BIRTH_DAY, ERROR_BIRTH_DAY);
	}

	this.validateBirthMonth = function(m) {
		var validation = validateMonth(m);
		
		return manageBirthErrors(validation, BIRTH_MONTH, ERROR_BIRTH_MONTH);
	}

	this.validateBirthYear = function(y) {
		var validation = validateYear(y);
		
		return manageBirthErrors(validation, BIRTH_YEAR, ERROR_BIRTH_YEAR);
	}

	/* Mapa id-->función. Las que tienen función null es porque no son input, sino de selección 
	** (no hay que validar) */
	this.inputValidations = {	'usr-name': validateName,
                                'usr-lname': validateName,
                                'usr-docnum': validateDocNum,
                                'birth-day': this.validateBirthDay,
                                'birth-month': this.validateBirthMonth,
                                'birth-year': this.validateBirthYear,
                                'usr-doc': null,
                                'usr-country': null,
                                'usr-gen': null };

    this.data = {};
    this.validDate = false;

    this.getData = function() {
    	return this.data;
    }

    this.birthDateReady = function() {
    	return this.data[BIRTH_DAY] && this.data[BIRTH_MONTH] && this.data[BIRTH_YEAR];
    }

    this.birthId = function(id) {
    	return id ==  BIRTH_DAY || id == BIRTH_MONTH || id == BIRTH_YEAR;
    }

 	/* TODO: Validar niño e infante */
    this.validateBirthDate = function() {
	    var birthDate = new Date(this.data[BIRTH_YEAR], this.data[BIRTH_MONTH] - 1, this.data[BIRTH_DAY]);
	    var currentDate = new Date();

	    if (birthDate > currentDate || (birthDate.getMonth()+1 != this.data[BIRTH_MONTH])) {
	    	this.validDate = false;
	        return invalidValidation('Fecha inválida');
	    }

	    this.validDate = true;
	    return validValidation();
    }

    this.validate = function(id, value) {
    	var validateFunction = this.inputValidations[id];
    	var validation;

 		/* Flag de campo visitado; por ahora erróneo hasta que la
 		** validación demuestre lo contrario. */
    	this.data[id] = null;
 
    	if (validateFunction) {
    		validation = validateFunction(value);
 
    		if (validation.valid) {
    			this.data[id] = validation.value; /* agregamos a los datos */

    			if (this.birthDateReady() && this.birthId(id)) {
    				validation = this.validateBirthDate();

    				if (!validation.valid) {/* Pone en rojo todos los campos de cumpleaños */
    					var $focused = $('#' + id);
    					$focused.siblings('input').addClass(ERROR_INPUT);
	    				$focused.addClass(ERROR_INPUT);
	    			}
	    			else
	    				validation.value = value;
    			}
    		}
    	}

    	return validation;
    }

    this.validateStage = function() {
    	/* Es necesario que se llame a validateStep pues coloca los mensaje de campo obligatorio,
    	** más allá de que la fecha sea válida o no. Sino podría devolver un arreglo con los ids
    	** de los campos no llenados. */
    	return validateStep(this.data, this.inputValidations) && this.validDate;
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
		return this.validExpDate && this.data[CARD_NUM] && this.data[SEC_CODE];
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

	this.getData = function() {
		return this.data;
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
				validation = this.validateExpDate();
   				if (!validation.valid) {  /* Pone en rojo todos los campos de vencimiento */
    				var $focused = $('#' + id);
    				$focused.siblings('input').addClass(ERROR_INPUT);
	    			$focused.addClass(ERROR_INPUT);
	    		}
	    		else
	    			validation.value = value;
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
							  'country': null,
							  'prov': null,
							  'city': null
							};

	this.optionalValidations = { 'floor': validateFloor,
							  	 'department': validateDepartment
							   };

	this.data = {};

	this.getData = function() {
		return this.data;
	}

	this.validate = function(id, value) {
		var inputValidation = this.inputValidations[id] || this.optionalValidations[id];

		if (!inputValidation)
			return undefined;

		this.data[id] = null;

		var validation = inputValidation(value);

		if (validation.valid) {
			this.data[id] = validation.value;

			if (this.isOptional(id) && validation.value.length == 0)
				delete this.data[id];
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

/* TODO: tema telefonos */
function ContactValidator() {
	this.inputValidations = { 'phone': validatePhone,
							  'email': validateEmail
							}

	this.data = {};

	this.getData = function() {
		return this.data;
	}

	this.validate = function(id, value) {
		return validValidation(value);
	}

	this.validateStage = function() {
		return true;
	}
}

/* Itera sobre los campos de step y se fija que en data
** estén los valores de dichos campos válidos. Si vale
** null algún campo significa que fue visitado por el
** usuario pero quedó erróneo. Si vale undefined ni fue
** visitado. */
function validateStep(data, step, optionals) {
    var valid = true;

    for (var prop in step) {
        var $id = $('#' + prop);

        if (step[prop] !== null) {
            if (data[prop] === undefined) { /* No hay mensaje de error, hay que colocarlo */
                valid = false;
                data[prop] = null;   /* Mensaje de error colocado --> reemplazamos undefined por null */
                setErrorState($id, CAMPO_OBLIGATORIO); /* Esta función se encuentra en checkout.js*/
            }
            else if (data[prop] === null) { /* Ya tiene el mensaje de error correspondiente */
                valid = false;
            }
        }
        else { /* Retira el valor de algo que no es input */
            data[prop] = $id.val();
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


