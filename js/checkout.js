var MAX_NAME = 80;
var MAX_DOC_NUM = 8;
var CAMPO_OBLIGATORIO = 'Campo obligatorio'

String.prototype.toUpperFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

function setErrorState(inputForm, string) {
    var errorMsg = inputForm.next('.error-msg');
    inputForm.addClass('error-input');
    inputForm.siblings('input').addClass('error-input');
    errorMsg.text(string);
    errorMsg.fadeIn();
    errorMsg.show();
}

function removeErrorState(inputForm) {
    inputForm.removeClass('error-input');
    inputForm.siblings('input').removeClass('error-input');
    inputForm.next('.error-msg').hide();
}

/* Objetos que contienen los datos de las etapas a medida que se validan.
** Forman un mapa (id, valor), donde el id depende del formulario que se llenó */
var passenger = {};
var payment = {};
var contact= {};

/* Verifican que estén correctos los campos de cada etapa. Devuelven true si es así.
** Devuelven false sino y ponen los mensajes de error correspondientes. */
var validations = [validationPassengers, validationPayment, validationContact];

function validateStep(data, step) {
    var valid = true;

    for (var prop in step) {
        var $id = $('#' + prop);

        if (step[prop] !== null) {
            if (data[prop] === undefined) { /* No hay mensaje de error, hay que colocarlo */
                valid = false;
                setErrorState($id, CAMPO_OBLIGATORIO);
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

/* Itera sobre los campos que deberían estar en passenger y analiza su valor 
** TODO: agregar la información al cuadro de resúmen */
function validationPassengers() {
    return validateStep(passenger, inputValidationPassenger);
}

function validationPayment() {
    return validateStep(payment, inputValidationPayment);
}

function validationContact() {
    return validateStep(contact, inputValidationContact);
}

/* Funciones de validación según etapa e id del formulario.
** Las que están en null es porque no pertenecen a un input, sino que a un select.
** Es decir que no hace falta validar */

/* Función de validación de la etapa de pasajeros*/
var inputValidationPassenger = {'usr-name': validateName,
                                'usr-lname': validateName,
                                'usr-docnum': validateDocNum,
                                'birth-day': validateBirthDate,
                                'birth-month': validateBirthDate,
                                'birth-year': validateBirthDate,
                                'usr-doc': null,
                                'usr-country': null,
                                'usr-gen': null};

var inputValidationPayment = {};
var inputValidationContact = {};

/* Arreglo con los mapas de funciones. Se los accede por índice según la etapa actual. */
var inputValidations = [inputValidationPassenger, inputValidationPayment, inputValidationContact];

/* Retornan objetos que representan una validación.
** Si valid es true fue correcta y value el nuevo valor más lindo.
** Con más lindo se refiere por ejemṕlo: si es un nombre, coloca la 
** primer letra en mayúscula y quita los espacios al comienzo y al final.
** Si valid es false la validación no fue correcta y en value se devuelve
** el mensaje de error. */
function invalidValidation(string) {
    return {valid: false, value: string};
}

function validValidation(string) {
    return {valid: true, value: string};
}

function isValidDate(d, m, y) {
    var date = new Date(y, m-1, d);
    if (date && date.getFullYear() == y && (date.getMonth()+1) == m) {  /* Si cambió el mes o el año es porque se pasó de largo */
        var current = new Date();
        return date < current;
    }
    return false;
}

/* TODO: validar niño e infante */
function validateBirthDate(num, id) {
    passenger[id] = num;
    var day = passenger['birth-day'], month = passenger['birth-month'], year = passenger['birth-year'];

    if (day && month && year && !isValidDate(day, month, year)) /* Se llenaron los tres campos */
        return invalidValidation('Fecha inválida');

    return validValidation(num);
}

function validateDocNum(num, id) {
    num = num.trim();
    passenger[id] = null;
    var invalidPattern = /\D/;

    if (num.length > MAX_DOC_NUM)
        return invalidValidation('Demasiado largo. Se permiten hasta ' + MAX_DOC_NUM + ' números.');
    else if (num.length == 0)
        return invalidValidation(CAMPO_OBLIGATORIO);
    else if (invalidPattern.test(num))
        return invalidValidation('Solo se permiten números');

    passenger[id] = num;
    return validValidation(num);
}


function validateName(string, id) {
    string = string.trim();  /* Quita espacios al comienzo y final de la palabra */
    passenger[id] = null;

    var n = string.length;
    var invalidPattern = /[\d\s]/; /* Dígitos o espacios */

    if (n > MAX_NAME)
        return invalidValidation("Nombre demasiado largo. Se permiten hasta " + MAX_NAME + " caracteres");

    else if (n == 0)  /* Ingresó únicamente espacios o nada */
        return invalidValidation(CAMPO_OBLIGATORIO);

    else if (invalidPattern.test(string)) /* Si encuentra dígitos o espacios */
        return invalidValidation("Solo se permiten letras");

    string = string.toUpperFirstLetter();
    passenger[id] = string;
    return validValidation(string);
}

$(document).ready(function(){
    $('.btnNext').click(function(){
        var active = $('.nav-tabs > .active');
        var indexTab = $('.nav-tabs').children('li').index(active); /* índice para saber a qué funcíón llamar */
        var next = active.next('li'); /* siguiente tab al actual */
        var valid = validations[indexTab]();


// Está comentado porq sino no te deja pasar de etapa a menos q esté bien la info.
//        if (valid) {
            if(next.hasClass('disabled-tab')) {
                next.removeClass('disabled-tab');
                next.removeClass('disabled');
            }
            next.find('a').tab('show');
  //      }
    });

    $('input').blur(function() {
        var active = $('.nav-tabs > .active');
        var indexTab = $('.nav-tabs').children('li').index(active);
        var id = $(this).attr('id');
        var value = $(this).val();
        var inputValidationFunction = inputValidations[indexTab][id];
        var validation;

        if (inputValidationFunction) {
            var errorMsg = $(this).next('.error-msg');
            /* Se le pasa el id para que la función pueda modificar la propiedad del objeto correspondiente */
            validation = inputValidationFunction(value, id);

            if (validation.valid) {
                $(this).val(validation.value); /* Reemplaza valor del campo por uno más lindo o el mismo */
           
                if (errorMsg.length != 0) {
                    removeErrorState($(this));
                }
            }
            else if (errorMsg.length != 0) {
                setErrorState($(this), validation.value);
            }
        }
    });

});


$(document).ready(function(){
    $(".nav-tabs a").click(function(){
        if($(this).not('disabled')) {
            $(this).tab('show');
        }
    });
});

$(document).ready(function(){
    $('.btnPrev').click(function(){

        $('.nav-tabs > .active').prev('li').find('a').tab('show');

    });
});

$(document).ready(function(){
    $('[data-toggle="popover"]').popover({
        html: true,
        trigger: 'hover',

        content: function () {
            return '<img src="img/security-code.jpg"/>';
        }
})});

$(document).ready(function(){
    $('.basicField').click(function(){
        $('.openField').show();
    });
});



$(function(){
    $('.openField').hide();
    $('.basicField').on("click", function(){
        $('.openField').slideDown();
    });
});


$(document).ready(function(){
    var maxField = 5; //Input fields increment limitation
    var addButton = $('.add-Phone'); //Add button selector
    var wrapper = $('#contact-form'); //Input field wrapper
    var fieldHTML =' <div class="row"> <div class="phone-data">' +
        '<div class="col-md-2 col-md-offset-1 form-field">' +
        '<label for="phone-type">Tipo:</label>' +
        '<select class="form-control" id="phone-type">' +
        '<option>Fijo</option> ' +
        '<option>Celular</option> ' +
        '</select> ' +
        '</div> ' +
        '<div class="col-md-3 form-field"> ' +
        '<label for="phone-country">País:</label> ' +
        '<select class="form-control" id="phone-country"> ' +
        '<option>Pais1</option> ' +
        '<option>Pais2</option> ' +
        '<option>Pais3</option> ' +
        '</select> ' +
        '</div> ' +
        '<div class="col-md-2 form-field"> ' +
        '<label for="phone-area">Cód.de Área:</label> ' +
        '<input type="number" class="form-control" id="phone-area"> ' +
        '</div> ' +
        '<div class="col-md-3 form-field"> ' +
        '<label for="phone">Número:</label> ' +
        '<input type="text" class="form-control" id="phone"> ' +
        '</div> ' +
        '<div class="col-md-1 tocenter-label">' +
        '<a href="#" class="btn btn-default remove-phone add-rem-button">' +
        '<span class="glyphicon glyphicon-minus-sign"></span>' +
        '</a>' +
        '</div>'+' </div>' +'</div>' + '</div>';


    var x = 1; //Initial field counter is 1
    $(addButton).click(function(){ //Once add button is clicked
        if(x < maxField){ //Check maximum number of input fields
            x++; //Increment field counter
            $(wrapper).append(fieldHTML); // Add field html
        }
    });
    $(wrapper).on('click', '.remove-phone', function(e){ //Once remove button is clicked
        e.preventDefault();
        $(this).parent().parent().remove(); //Remove field html
        x--; //Decrement field counter
    })

});

/*
$(document).ready(function() {
// Function to get input value.
    $('#cont1').click(function() {
        var text_value =
        if (text_value == '') {
            alert("Enter Some Text In Input Field");
        } else {

        }
    })});
*/

function addSumField(field) {
    var toAdd = '<h5 ' + 'class=field-' + field + '></h5>';
    return toAdd;
}

function addSumBlockPass() {
    var passengersSummary = $('.summary-passengers');
    var passenger = $('<div class="summary-passenger"><p></p></div>');

    passengersSummary.append(passenger);
/*
    summary.append(addSumField("name"));
    summary.append(addSumField("lname"));
    summary.append(addSumField("date"));
    summary.append(addSumField("gen"));
    summary.append(addSumField("country"));
    summary.append(addSumField("doc"));
    summary.append(addSumField("docnum"));
*/
}

/* Agrega info al cuadro de resúmen 
** TODO: no se usa todavía */
function completeDataPass(name, lname, date, gen, country, doc, docnum){
    $('.summary-passenger').find('p').text([name, lname, date, gen, country, doc, docnum].join(' '));
}

/*
function validationPassengers() {

    var name = validateName(document.getElementById("usr-name").value);
    if (name == 1) {
        console.log("Nombre vacío");
        name = "Nombre vacío";
    }

    var lname = validateName(document.getElementById("usr-lname").value);
    if(lname == 1) {
        console.log("Apellido vacío");
        lname= "Apellido Vacío";
    }

    // TODO: VALIDAR DOCUMENTO Y TODO LA VERDAD...

    var day =document.getElementById("birth-day").value;
    var month = document.getElementById("birth-month").value;
    var year = document.getElementById("birth-year").value;
    date = validateDate(day,month,year);

    if( date == 1) {
        console.log("Fecha vacía");
        date =  "Fecha Vacía";
    }else if( date == 2) {
        console.log("Fecha inválida");
        date="Fecha Invalida";
    }
    console.log(date);

    var docnum = document.getElementById("usr-docnum").value;
    var doc = document.getElementById("usr-doc").value;

    if (doc == 1) {
        console.log("Documento vacío");
        doc = "Documento Vacío";
    }

    var country= document.getElementById("usr-country").value;
    var gen = document.getElementById("usr-gen").value;

    completeDataPass(name, lname, date, gen, country, doc, docnum);
}

$(document).ready(function(){

    addSumBlockPass();

});

*/