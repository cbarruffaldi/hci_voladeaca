var MAX_NAME = 80;
var MAX_DOC_NUM = 8;
var MIN_CREDIT_NUM = 13;
var MAX_CREDIT_NUM = 16;
var MIN_SEC_CODE = 3;
var MAX_SEC_CODE = 4;
var CAMPO_OBLIGATORIO = 'Campo obligatorio';

String.prototype.toUpperFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

/* OJO: estás dos funciones usan next, no siblings */
function setErrorState(inputForm, string) {
    var errorMsg = inputForm.siblings('.error-msg').eq(0); /* Agarrá el primer sibling con clase error-msg */
    inputForm.addClass('error-input');
    errorMsg.text(string);
    errorMsg.fadeIn();
}

function removeErrorState(inputForm) {
    var errorMsg = inputForm.siblings('.error-msg').eq(0);
    inputForm.removeClass('error-input');
    inputForm.siblings().removeClass('error-input');
    errorMsg.hide();
    errorMsg.text('');
}

var passengerValidator = new PassengerValidator();

$(document).ready(function() {
    var validators = [passengerValidator, new PaymentValidator(), new ContactValidator()];

    $('.btnNext').click(function(){
        var active = $('.nav-tabs > .active');
        var indexTab = $('.nav-tabs').children('li').index(active); /* índice para saber a qué funcíón llamar */
        var next = active.next('li'); /* siguiente tab al actual */
        var validator = validators[indexTab];

/* Comentar siguiente if si resulta molesto no poder pasar las etapas */
        if (validator.validateStage()) {
            if(next.hasClass('disabled-tab')) {
                next.removeClass('disabled-tab');
                next.removeClass('disabled');
            }
            next.find('a').tab('show');
            if( indexTab == 0) {
                getPassengerData();
            } else if(indexTab == 1) {
                //getPaymentinfo()
            }
        }
    });

    $('input').blur(function() {
        var active = $('.nav-tabs > .active');
        var indexTab = $('.nav-tabs').children('li').index(active);
        var id = $(this).attr('id');
        var value = $(this).val();
        var validator = validators[indexTab];
        var validation;
        
        validation = validator.validate(id, value);

        if (validation.valid && !validation.ignore) {
            $(this).val(validation.value); /* Reemplaza valor del campo por uno más lindo o el mismo */
            removeErrorState($(this));
        }
        else if (!validation.ignore) {
            setErrorState($(this), validation.value);
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

/* 0: pasajeros
*  1: pago
*  2: contacto*/

function getCurrentStage() {
    var active = $('.nav-tabs > .active');
    var indexTab = $('.nav-tabs').children('li').index(active);
    return indexTab;
}

$(document).ready(function(){
    $('.btnPrev').click(function(){
        var i = getCurrentStage();
        if( i == 1) {
            $(".summary-passengers").children().remove();
        } else if (i == 2){
            $(".summary-payment").children().remove();
        }
        $('.nav-tabs > .active').prev('li').find('a').tab('show');

    });
});

$(document).ready(function(){
    $('#code-popover').popover({
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


function addPhone(id){
    var fieldHTML =' <div class="row"> <div class="phone-data">' +
        '<div class="col-md-2 col-md-offset-1 form-field">' +
        '<label for="phone-type-' + id + '">Tipo:</label>' +
        '<select class="form-control" id="phone-type-' + id + '">' +
        '<option>Fijo</option> ' +
        '<option>Celular</option> ' +
        '</select> ' +
        '</div> ' +
        '<div class="col-md-3 form-field"> ' +
        '<label for="phone-country-' + id + '">País:</label> ' +
        '<select class="form-control" id="phone-country-' + id + '"> ' +
        '<option>Pais1</option> ' +
        '<option>Pais2</option> ' +
        '<option>Pais3</option> ' +
        '</select> ' +
        '</div> ' +
        '<div class="col-md-2 form-field"> ' +
        '<label for="phone-area-' + id + '">Cód.de Área:</label> ' +
        '<input type="number" class="form-control" id="phone-area-' + id + '"> ' +
        '</div> ' +
        '<div class="col-md-3 form-field"> ' +
        '<label for="phone-' + id + '">Número:</label> ' +
        '<input type="text" class="form-control" id="phone-' + id + '"> ' +
        '</div> ' +
        '<div class="col-md-1 tocenter-label">' +
        '<a href="#" class="btn btn-default remove-phone add-rem-button">' +
        '<span class="glyphicon glyphicon-minus-sign"></span>' +
        '</a>' +
        '</div>'+' </div>' +'</div>' + '</div>';

        return fieldHTML;
};

$(document).ready(function(){
    var x = 1; //Initial field counter is 1
    var maxField = 5; //Input fields increment limitation
    var addButton = $('.add-Phone'); //Add button selector
    var wrapper = $('#contact-form'); //Input field wrapper
    var count = 1;

    $(addButton).click(function(){ //Once add button is clicked
        if(x < maxField){ //Check maximum number of input fields
            $(wrapper).append(addPhone(count)); // Add field html
            x++; //Increment field counter
            count++;
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


function addName(name, obj) {
    obj.append('<h5 class="sum-passname">' + name + '</h5>');
}
function addPassData(country, doctype, docnum, gen, birth, obj){
    var x1 = '<div class="sum-field">' + country + ' ' + doctype + ':'+ docnum +'</div>';
    var x2 = '<div class="sum-field">' + gen + ' ' + birth +'</div>';
    var x3 = '<a href="#" class="col-md-offset-9 sum-modal" data-toggle="modal" data-target="#pass-modal">' + 'Modificar...' + '</a>';

    obj.append(x1);
    obj.append(x2);
    obj.append(x3);


}


$(document).ready(function(){
   $('#pass-popover').popover({
       html: true,
       trigger: 'hover',

       content: function () {
          return '<img src="img/security-code.jpg"/>'
            }
        })});

function fillPassengerSum(data){
    addName(data["usr-name"] + ' ' + data["usr-lname"], $(".summary-passengers"));
    addPassData(data["usr-country"], data["usr-doc"], data["usr-docnum"], data["usr-gen"], data["birth-day"] + '/' + data["birth-month"] + '/' + data["birth-year"],$(".summary-passengers"));
}

function getPassengerData(){
    var passData = passengerValidator.data;
    fillPassengerSum(passData);
}

function fillPassengerModal(){

}

$()









