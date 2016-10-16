var MAX_NAME = 80;
var MAX_DOC_NUM = 8;
var MIN_CREDIT_NUM = 13;
var MAX_CREDIT_NUM = 16;
var MIN_SEC_CODE = 3;
var MAX_SEC_CODE = 4;
var CAMPO_OBLIGATORIO = 'Campo obligatorio';

var summaryStage = null;

String.prototype.toUpperFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

function setErrorState(inputForm, string) {
    var errorMsg = inputForm.siblings('.error-msg').eq(0); /* Agarra el primer sibling con clase error-msg */
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

/* 0: pasajeros
*  1: pago
*  2: contacto*/

function getCurrentStage() {
    if (summaryStage !== null)
        return summaryStage;
    var active = $('.nav-tabs > .active');
    var indexTab = $('.nav-tabs').children('li').index(active);
    return indexTab;
}

var $passengers = JSON.parse(localStorage.boughtFlight).passengers;

/* TODO: obtener verdadera cantidad de adultos, niños, infantes y fecha de fin de viaje */
var passengersValidator = new PassengersValidator($passengers.adults, $passengers.children, $passengers.infants, new Date()); /* Etapa 0 */
var paymentValidator = new PaymentValidator();     /* Etapa 1 */
var contactValidator = new ContactValidator();     /* Etapa 2 */

/* Validadores por cada etapa */
var validators = [passengersValidator, paymentValidator, contactValidator];

$(document).ready(function() {

    $('.btnNext').click(function(){
        var active = $('.nav-tabs > .active');
        var indexTab = getCurrentStage(); /* índice para saber a qué funcíón llamar */
        var next = active.next('li'); /* siguiente tab al actual */
        var validator = validators[indexTab];

    /* Comentar siguiente if si resulta molesto no poder pasar las etapas */
        if (validator.validateStage()) {
            if(next.hasClass('disabled-tab')) {
                next.removeClass('disabled-tab');
                next.removeClass('disabled');
            }

            next.find('a').tab('show');
            
            if(indexTab == 0) {
                fillPassengerSum(validator.getData());
            } 
            else if(indexTab == 1) {
                fillPaymentSum(validator.getData());
                fillBillingSum(validator.getData());
            }
        }
    });
});

$(document).on('blur', 'input', function() {
    var indexTab = getCurrentStage();
    var id = $(this).attr('id');
    var value = $(this).val();
    var validator = validators[indexTab];
    var validation;

    value = value.trim();
    if (value.length > 0) {
        var words = value.split(/[\s]+/);
        words = words.map(function (word) {return word.toUpperFirstLetter();});
        value = words.join(' ');
    }
    
    validation = validator.validate(id, value);

    if (validation.valid) {
        $(this).val(validation.value); /* Reemplaza valor del campo por uno más lindo o el mismo */
        if (!validation.ignore)
            removeErrorState($(this));
    }
    else if (!validation.ignore) {
        setErrorState($(this), validation.value);
    }    
});

$(document).ready(function(){
    $(".nav-tabs a").click(function(){
        if($(this).not('disabled')) {
            $(this).tab('show');
        }
    });
});

function cleanSummaryStage(stage) {
    if (stage == 1) {
        $(".summary-passengers").children().remove();
    } 
    else if (stage == 2){
        $(".summary-payment").children().remove();
        $(".summary-billing").children().remove();
    }    
}

$(document).ready(function() {
    $('.btnPrev').click(function() {
        cleanSummaryStage(getCurrentStage());
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

$(document).on('click', '.basicField', function(){
    $(this).closest('.form-group').find('.openField').show();
});


function addPhone(id){
    var fieldHTML =' <div class="row extra-phone"> <div class="phone-data">' +
        '<div class="col-md-2 col-md-offset-1 form-field">' +
        '<label for="phone-type-' + id + '">Tipo:</label>' +
        '<select class="form-control" id="phone-type-' + id + '">' +
        '<option>Fijo</option> ' +
        '<option>Celular</option> ' +
        '</select> ' +
        '</div> ' +
        '<div class="col-md-8 form-field phone-input"> ' +
        '<label for="phone-' + id + '">Número:</label> ' +
        '<input autocomplete="off" type="text" class="form-control" id="phone-' + id + '"> ' +
        '<p class="error-msg"></p> ' +
        '</div> ' +
        '<div class="col-md-1 tocenter-label">' +
        '<a href="#" class="btn btn-default remove-phone add-rem-button">' +
        '<span class="glyphicon glyphicon-minus-sign"></span>' +
        '</a>' +
        '</div>'+' </div>' +'</div>' + '</div>';

        return fieldHTML;
};

var fieldCounter = 1; //Initial field counter is 1
$(document).ready(function(){
    var maxField = 5; //Input fields increment limitation
    var addButton = $('.add-Phone'); //Add button selector
    var wrapper = $('#contact-form').children('.form-group'); //Input field wrapper
    var count = 1;

    function getPhoneId(buttonClicked) {
        return buttonClicked.parent().siblings('.phone-input').find('input').attr('id').split('-')[1];
    }

    addButton.click(function(e) { //Once add button is clicked
        e.preventDefault();
        if(fieldCounter < maxField){ //Check maximum number of input fields
            wrapper.append(addPhone(count)); // Add field html
            contactValidator.addPhone(count);
            fieldCounter++; //Increment field counter
            count++;
        }
        
        if (fieldCounter == maxField) {
            addButton.hide();
        }
    });

    wrapper.on('click', '.remove-phone', function(e) { //Once remove button is clicked
        e.preventDefault();
        addButton.fadeIn();
        contactValidator.removePhone(getPhoneId($(this)));
        $(this).parent().parent().parent().remove(); //Remove field html
        fieldCounter--; //Decrement field counter
    })

});

function restorePhones(phonesId) {
    var backupPhonesId = Object.keys(contactValidator.getBackupPhones());
    fieldCounter = backupPhonesId.length;
    var wrapper = $('#contact-form').children('.form-group');

    $('.extra-phone').remove();

    backupPhonesId.forEach(function(stringId) {
        wrapper.append(addPhone(stringId.split('-')[1]));
    });
}

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

var SUM_PASSENGERS = '.summary-passengers';
var SUM_PAYMENT = '.summary-payment';
var SUM_BILLING = '.summary-billing';

function getModifyStage(modify) {
    /* TODO: para varios pasajeros */
    if (modify.parents(SUM_PASSENGERS).length) {
        var passIndex = modify.parent().index();
        return [0, passIndex];
    }
    else if (modify.parents(SUM_PAYMENT).length)
        return [1, 0];
    else if (modify.parents(SUM_BILLING).length)
        return [1, 1];
    return [2, 0];
}
 /* El div padre del form group del input */
var formGroupParent;

$(document).on('show.bs.modal', '#modify-modal', function(event) {
    var modifyLink = $(event.relatedTarget);
    var modal = $(this);
    var modifyStage = getModifyStage(modifyLink);
    summaryStage = modifyStage[0];
    var tabId = $('#' + (summaryStage + 1));

    validators[summaryStage].generateBackup();

    /* TODO: ver que pasajero es */
    if (summaryStage == 0) {
        var formGroup = tabId.find('.form-group').eq(modifyStage[1]);
        formGroupParent = formGroup.parent();
        modal.find('.modal-body').append(formGroup);
    }
    else if (summaryStage == 1) {
        var formGroup = tabId.find('.form-group').eq(modifyStage[1]);
        formGroupParent = formGroup.parent();
        modal.find('.modal-body').append(formGroup);
    }
});

function closeModal() {
    summaryStage = null;
    var formGroup = $('.modal-body').find('.form-group');
    formGroupParent.append(formGroup);
    formGroupParent = null;
    $('#modify-modal').modal('hide');
}

function saveModal(validator) {
    var data = validator.getData();
    cleanSummaryStage(summaryStage+1);

    if (summaryStage == 0) {
        fillPassengerSum(data);
    }
    else if (summaryStage == 1) {
        fillPaymentSum(data);
        fillBillingSum(data);
    }
    closeModal();
}

function cancelModal(validator) {
    if(validator == contactValidator) {
        restorePhones();
    }
    validator.applyBackup(); /* Reemplaza todo por los valores del backup */
    closeModal();
}

$(document).ready(function() {
    $('.save-btn').click(function() {
        var modalStage = getCurrentStage();
        var validator = validators[modalStage];

        if (validator.validateStage())
            saveModal(validator);
    });

    $('.cancel-btn').click(function() {
        var modalStage = getCurrentStage();

        cancelModal(validators[modalStage]);        
    });
});

$(document).ready(function(){
   $('#pass-popover').popover({
       html: true,
       trigger: 'hover',

       content: function () {
          return '<img src="img/security-code.jpg"/>'
            }
        })});


function addName(name, obj) {
    obj.append('<h5 class="sum-passname">' + name + '</h5>');
}

function addPassData(country, doctype, docnum, gen, birth, obj){
    var x1 = '<div class="sum-field col-md-6">' + country + '</div>';
    var x2 = '<div class="sum-field col-md-6">' + doctype + ':'+ docnum +'</div>';
    var x3 = '<div class="sum-field col-md-6">' + gen + '</div>';
    var x4 = '<div class="sum-field col-md-6">' + birth +'</div>';
    var x5 = '<a href="#" class="col-md-offset-9 sum-modal" data-toggle="modal" data-target="#modify-modal">Modificar...</a>';

    obj.append(x1);
    obj.append(x2);
    obj.append(x3);
    obj.append(x4);
    obj.append(x5);
}

function fillPassengerSum(passengersData) {

    passengersData.forEach(function(data) {
        var passengerSum = $('<div class="summary-passenger"></div>');
        addName(data["usr-name"] + ' ' + data["usr-lname"], passengerSum);
        addPassData(data["usr-country"], data["usr-doc"], data["usr-docnum"], data["usr-gen"], data["birth-day"] + '/' + data["birth-month"] + '/' + data["birth-year"], passengerSum);
        $(".summary-passengers").append(passengerSum);
    });
}

function addPaymentData(card, installments, expdate, secCode,obj){
    var x1 = '<div class="sum-field col-md-12">' + card+ '</div>';
    var x2 = '<div class="sum-field col-md-6">' + secCode +'</div>';
    var x3 = '<div class="sum-field col-md-6"">' + expdate +'</div>';
    var x4 = '<div class="sum-field col-md-12">' +'Cuotas: '+ installments+'</div>';
    var x5 = '<a href="#" class="col-md-offset-9 sum-modal" data-toggle="modal" data-target="#modify-modal">Modificar...</a>';

    obj.append(x1);
    obj.append(x2);
    obj.append(x3);
    obj.append(x4);
    obj.append(x5);
}

function addBillingData(country, street ,zipcode, floor, department, obj){
    var x1 = '<div class="sum-field col-md-12">' + country + '</div>';
    var x2 = '<div class="sum-field col-md-12"">' + street +'</div>';
    var x3 = '<div class="sum-field col-md-12">' +floor + 'º ' + department+ ' ' + zipcode +'</div>';
    var x4 = '<a href="#" class="col-md-offset-9 sum-modal" data-toggle="modal" data-target="#modify-modal">Modificar...</a>';

    obj.append(x1);
    obj.append(x2);
    obj.append(x3);
    obj.append(x4);
}

function fillPaymentSum(data) {
    addPaymentData(data["card-num"],data["installments"],data["exp-month"] + '/' + data["exp-year"], data["sec-code"],$(".summary-payment"));
}

function fillBillingSum(data){
    addBillingData(data["country"]+ ', ' + data["city"], data["street"]+ ' ' + data["addr-num"],data["zip-code"],data["floor"], data["department"], $(".summary-billing"));
}



/*Eleccion de Paises */

$(document).ready(function () {

    function loadCountries(document) {

        var stocks = new Bloodhound({
            datumTokenizer: function (d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            limit: 3,
            local: document,
            identify: function(obj) { return obj.id; },

        });
        stocks.initialize();

        var countryTypeahead = $('#country').typeahead(null, {
            name: 'stocks',
            displayKey: function (stock) {
                return stock.name;
            },
            source: stocks.ttAdapter()
        })
            .on('typeahead:selected', function (event, data) {
            $("#city").val('');
            createCityJSON(cities,data.id);
        })
            .on('change', function() {
                console.log('Por favor elija un país de la lista');
                //TODO:MANDAR AL VALIDADOR PARA QUE LO PONGA EN ROJITO
            });


        /*El de los pasajeros */
        $('.country-typeahead').typeahead(null, {
            name: 'stocks',
            displayKey: function (stock) {
                return stock.name;
            },
            source: stocks.ttAdapter()
        }).on('change', function() {
            console.log('Por favor elija un país de la lista');
            //TODO:MANDAR AL VALIDADOR PARA QUE LO PONGA EN ROJITO
    });
    };


    $.ajax({
        url: 'http://hci.it.itba.edu.ar/v1/api/geo.groovy?method=getcountries',
        data: {
            format: 'json'
        },
        dataType: 'jsonp',
        success: function (data) {

            createCountryJSON(data);
        },
        type: 'GET'
    });

    function createCountryJSON(data) {
        jsonObj = [];

        $.each(data.countries, function () {
            item = {};
            item ["id"] = $(this).attr('id');
            item ["name"] = $(this).attr('name');

            jsonObj.push(item);
        });

        loadCountries(jsonObj);
    };

    /*Eleccion de ciudades */

    function loadCities(document) {

        $('.city-typeahead').typeahead('destroy');

        var stocks = new Bloodhound({
            datumTokenizer: function (d) {
                return Bloodhound.tokenizers.whitespace(d.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            limit: 3,
            local: document,


        });
        stocks.initialize();

        var cityTypeahead =$('.city-typeahead').typeahead(null, {
            name: 'stocks',
            displayKey: function (stock) {
                return stock.name;
            },
            source: stocks.ttAdapter()
        }).on('typeahead:selected', function (event, data) {
            console.log(data);
            cityTypeahead.typeahead('destroy');
        }).on('change', function() {
            console.log('Por favor elija un país de la lista');
            //TODO:MANDAR AL VALIDADOR PARA QUE LO PONGA EN ROJITO
        });

    };

    /* Solo se pide una vez las ciudades */
    var cities;

    $.ajax({
        url: 'http://hci.it.itba.edu.ar/v1/api/geo.groovy?method=getcities',
        data: {
            format: 'json'
        },
        dataType: 'jsonp',
        success: function (data) {

            cities = data;
        },
        type: 'GET'
    });

    function createCityJSON(data,id) {
        jsonObj = [];

        $.each(data.cities, function () {
            if ($(this).attr('country').id == id) {

            item = {};
            item ["id"] = $(this).attr('id');
            item ["name"] = $(this).attr('name');
            item ["country"] = $(this).attr('country').id;

            jsonObj.push(item);
        }
        });

        console.log(jsonObj);
        loadCities(jsonObj);
    };

});
