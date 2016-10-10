var MAX_NAME = 80;
var MAX_DOC_NUM = 8;
var MIN_CREDIT_NUM = 13;
var MAX_CREDIT_NUM = 16;
var MIN_SEC_CODE = 3;
var MAX_SEC_CODE = 4;
var CAMPO_OBLIGATORIO = 'Campo obligatorio';
var BIRTH_DAY = 'birth-day';
var BIRTH_MONTH = 'birth-month';
var BIRTH_YEAR = 'birth-year';
var ERROR_BIRTHDATE = 'error-birthdate';
var ERROR_INPUT = 'error-input';
var ERROR_BIRTH_DAY = 'error-birth-day';
var ERROR_BIRTH_MONTH = 'error-birth-month';
var ERROR_BIRTH_YEAR = 'error-birth-year';
var ERROR_BIRTHDATE = 'error-birthdate';

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

function validateDocNum(num, id) {
    num = num.trim();
    var invalidPattern = /\D/;

    if (num.length > MAX_DOC_NUM)
        return invalidValidation('Demasiado largo. Se permiten hasta ' + MAX_DOC_NUM + ' números.');
    else if (num.length == 0)
        return invalidValidation(CAMPO_OBLIGATORIO);
    else if (invalidPattern.test(num))
        return invalidValidation('Solo se permiten números');

    return validValidation(num);
}

function validateName(string, id) {
    string = string.trim();  /* Quita espacios al comienzo y final de la palabra */

    var n = string.length;
    var invalidPattern = /[\d\s]/; /* Dígitos o espacios */

    if (n > MAX_NAME)
        return invalidValidation("Nombre demasiado largo. Se permiten hasta " + MAX_NAME + " caracteres");

    else if (n == 0)  /* Ingresó únicamente espacios o nada */
        return invalidValidation(CAMPO_OBLIGATORIO);

    else if (invalidPattern.test(string)) /* Si encuentra dígitos o espacios */
        return invalidValidation("Solo se permiten letras");

    string = string.toUpperFirstLetter();
    return validValidation(string);
}

function validValidation(string) {
    return {valid: true, value: string};
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
	return validValidation(m);
}

function validateYear(y) {
	if (y.length == 0)
		return invalidValidation('Año obligatorio');
	if (y < 1900)
		return invalidValidation('Año inválido');
	return validValidation(y);
}

/* Ni idea si anda */
function validateCreditCard(number, expDate, secCod) {
    var valid = false;
    $.ajax({
        url: "http://hci.it.itba.edu.ar/v1/api/booking.groovy?method=validatecreditcard&number="+number+"&exp_date="+expDate+"&sec_code="+secCod+"&callback=?",
        dataType: "jsonp"
    }).done(function(data) {
        valid = data.valid;
    });
    return valid;
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

	setBirthErrorState(fieldId, errorNodeId, validation.value);
	return ignoreInvalidValidation(validation.value);	
}

/* VALIDADORES 
** Métodos públicos: 
** 
** validate(id, value)
** 		Valida el valor del campo con ese id y value.
** validateStage()
**		Valida la etapa entera. Si hubo un campo que ni se tocó
**		muestra error CAMPO_OBLIGATORIO.
**
** Atributos:
**
** Data: objeto que guarda cada valor de los campos de la etapa según id
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

	    if (birthDate > currentDate) {
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

function PaymentValidator() {
	this.validate = function(id, value) {
		return validValidation(value);
	}

	this.validateStage = function() {
		return true;
	}
}

function ContactValidator() {
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
function validateStep(data, step) {
    var valid = true;

    for (var prop in step) {
        var $id = $('#' + prop);

        if (step[prop] !== null) {
            if (data[prop] === undefined) { /* No hay mensaje de error, hay que colocarlo */
                valid = false;
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

    return valid;    
}


