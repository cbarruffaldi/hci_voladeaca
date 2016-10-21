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
    if (!errorMsg.length)
        errorMsg = inputForm.parent().siblings('.error-msg').eq(0);
    inputForm.addClass('error-input');
    errorMsg.text(string);
    errorMsg.fadeIn();
}

function removeErrorState(inputForm) {
    var errorMsg = inputForm.siblings('.error-msg').eq(0);
    if (!errorMsg.length)
        errorMsg = inputForm.parent().siblings('.error-msg').eq(0);
    inputForm.removeClass('error-input');
    inputForm.siblings().removeClass('error-input');
    errorMsg.hide();
    errorMsg.text('');
}

/* 0: pasajeros
*  1: pago
*  2: contacto */

function getCurrentStage() {
    if (summaryStage !== null)
        return summaryStage;
    var active = $('.nav-tabs > .active');
    var indexTab = $('.nav-tabs').children('li').index(active);
    return indexTab;
}

var $bought = JSON.parse(localStorage.boughtFlight);
var $passengers = $bought.passengers;

var twoWay = $bought.twoWays ? 1 : 0;
var finalDate = $bought.container.flights[twoWay].flight.arrivalMoment.date;

var passengersValidator = new PassengersValidator($passengers.adults, $passengers.children, $passengers.infants, finalDate); /* Etapa 0 */
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

        if (indexTab == 3) {
            translateBookingData(passengersValidator.getData(), paymentValidator.getCardData(), paymentValidator.getBillingData(), contactValidator.getData());
        }
        else if (validator.validateStage()) {  /* Comentar si resulta molesto no poder pasar las etapas */
            if(next.hasClass('disabled-tab')) {
                next.removeClass('disabled-tab');
                next.removeClass('disabled');
            }
            next.find('a').tab('show');
            active.addClass('disabled');
            active.addClass('disabled-tab');

            if(indexTab == 0) {
                fillPassengerSum(validator.getData());
            } 
            else if(indexTab == 1) {
                fillPaymentSum(validator.getData());
                fillBillingSum(validator.getData());
            }
            else if (indexTab == 2) {
                $(this).text('Finalizar Compra');
            }


            var data = active;

            var data = $("#data");
            var sequence = parseInt(data.text()) + 1;
            var state = { value : sequence };
            history.pushState(state, "", "sequence.html");
            data.text(sequence);
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
    $(this).val(value);
    
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

$(document).on('keyup', 'input', function() {
    var indexTab = getCurrentStage();
    var id = $(this).attr('id');
    var value = $(this).val();
    var validator = validators[indexTab];
    var validation;

    if (!validator.alreadyValidated(id) || (value.length > 0 && value[value.length-1] == ' '))
        return;
    
    validation = validator.validate(id, value);

    if (validation.valid) {
        if (!validation.ignore)
            removeErrorState($(this));
    }
    else if (!validation.ignore) {
        setErrorState($(this), validation.value);
    }    
});

/*
$(document).ready(function(){
    $(".nav-tabs a").click(function(){
        if($(this).not('disabled')) {
            $(this).tab('show');
        }
    });
});

*/

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
        var stageIndex = getCurrentStage();
        if (stageIndex == 0) {
            parent.history.back();
            return false;
        } else if(stageIndex == 3) {
            $('.btnNext').text('Continuar\»');
        }

        cleanSummaryStage(stageIndex);
        $('.nav-tabs .active').addClass('disabled');
        $('.nav-tabs .active').addClass('disabled');
        $('.nav-tabs .active').prev('li').find('a').tab('show'); 



    });
});

$(document).ready(function(){
    $('#code-popover').click(function(event) {
        event.preventDefault();
    });

    $('#code-popover').popover({
        html: true,
        trigger: 'hover',

        content: function () {
            return '<img src="img/security-code.jpg"/>';
        }
})});

$(document).on('focus', '.basicField', function(){
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
        '<input maxlength="25" autocomplete="off" type="text" class="form-control" id="phone-' + id + '"> ' +
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
    var wrapper = $('#modify-modal .modal-body').children('.form-group');
    var addButton = $('.add-Phone'); //Add button selector

    $('.extra-phone').remove();

    if (backupPhonesId.length == 5)
        addButton.hide();       
    else
        addButton.show();

    backupPhonesId.forEach(function(stringId) {
        if (stringId != 'phone-0')
            wrapper.append(addPhone(stringId.split('-')[1]));
    });
}

var SUM_PASSENGERS = '.summary-passengers';
var CONF_PASSENGERS = '.conf-passengers';
var SUM_PAYMENT = '.summary-payment, .conf-payment';
var SUM_BILLING = '.summary-billing, .conf-billing';

function getModifyStage(modify) {
    if (modify.parents(SUM_PASSENGERS).length) {
        var passIndex = modify.parent().index();
        return [0, passIndex];
    }
    if (modify.parents(CONF_PASSENGERS).length) {
        var passIndex = modify.parent().parent().index();  
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
    var modalHeader = modal.find('.modal-title');

    validators[summaryStage].generateBackup();

    var formGroup = tabId.find('.form-group').eq(modifyStage[1]);
    formGroupParent = formGroup.parent();
    modal.find('.modal-body').append(formGroup);

    if (summaryStage == 0) {
        modalHeader.text('Modificar Información del Pasajero');
    }
    else if (summaryStage == 1) {
        if (modifyStage[1])
            modalHeader.text('Modificar Información de Facturación');
        else
            modalHeader.text('Modificar Información de Tarjeta');
    }
    else if (summaryStage == 2) {
            modalHeader.text('Modificar Información de Contacto');
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
/*        var modalStage = getCurrentStage();
        var validator = validators[modalStage];

        if (validator.validateStage()) {
            saveModal(validator);
        } */
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

function addPassData(doctype, docnum, birth, obj){
    var x2 = '<div class="sum-field col-md-6">' + doctype + ':'+ docnum +'</div>';
    var x4 = '<div class="sum-field col-md-6">' + birth +'</div>';
    var x5 = '<a href="#" class="col-md-offset-9 sum-modal" data-toggle="modal" data-target="#modify-modal">Modificar...</a>';

    obj.append(x2);
    obj.append(x4);
    obj.append(x5);
}

function fillPassengerSum(passengersData) {

    passengersData.forEach(function(data) {
        var passengerSum = $('<div class="summary-passenger"></div>');
        addName(data["usr-name"] + ' ' + data["usr-lname"], passengerSum);
        addPassData(data["usr-doc"], data["usr-docnum"], data["birth-day"] + '/' + data["birth-month"] + '/' + data["birth-year"], passengerSum);
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
    if (floor.length)
        floor = 'Piso: ' + floor + ' ';
    if (department.length)
        department = 'Dpto.: ' + department + ' ';

    var x1 = '<div class="sum-field col-md-12">' + country + '</div>';
    var x2 = '<div class="sum-field col-md-12"">' + street +'</div>';
    var x3 = '<div class="sum-field col-md-12">' + floor  + department +  zipcode +'</div>';
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
    addBillingData(data["city"] + ', ' + data["country"], data["street"]+ ' ' + data["addr-num"],data["zip-code"],data["floor"], data["department"], $(".summary-billing"));
}


var countries;
var currentCities;

/*Eleccion de Paises */

function removeDisabledInput(id) {
    var input = $('#' + id);
    input.removeAttr('disabled');
    input.removeClass('disabled');
    input.removeAttr('placeholder');
}

function addDisabledInput(id) {
    var input = $('#' + id);
    input.attr('disabled', 'disabled');
    input.addClass('disabled');
    input.attr('placeholder', 'Ingrese país primero');
    input.val(''); 
    removeErrorState(input);
}

$(document).on('click', '.tt-dataset', function() {
    removeDisabledInput('city');

    removeErrorState($(this).parent().siblings('input'));
});

$(document).ready(function () {

    var prevCountry;

    $('#country').keyup(function() {
        var validation = validateCountry($('#country').val());
        if(validation.valid) {
            removeDisabledInput('city');
        }
        else {
            addDisabledInput('city');
        }          
    });

    var cityTypeahead;

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
            .on('blur', function() {
                var countryName = $('#country').val();
                if(cityTypeahead) {
                    cityTypeahead.typeahead('destroy');
                    currentCities = undefined;
                }

                if (prevCountry && prevCountry.toLowerCase() != countryName.toLowerCase())
                    $("#city").val('');

                var countryId = findCountryId(countryName);
                if (countryId) {
                    prevCountry = countryName;
                    currentCities = createCityJSON(cities, countryId);
                }           
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

            countries = createCountryJSON(data);
        },
        type: 'GET'
    });

    function createCountryJSON(data) {
        var jsonObj = [];

        $.each(data.countries, function () {
            var item = {};
            item ["id"] = $(this).attr('id');
            item ["name"] = decodeHtml($(this).attr('name'));

            jsonObj.push(item);
        });

        loadCountries(jsonObj);

        return jsonObj;
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

        cityTypeahead =$('.city-typeahead').typeahead(null, {
            name: 'stocks',
            displayKey: function (stock) {
                return stock.name;
            },
            source: stocks.ttAdapter()
        }).on('blur', function (event, data) {
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

    function findCountryId(name) {
        var id;

        countries.forEach(function(country) {
            if (country['name'].toUpperCase() == name.toUpperCase())
                id = country['id'];
        });

        return id;
    }

    function createCityJSON(data, id) {
        var jsonObj = [];

        $.each(data.cities, function () {
            if ($(this).attr('country').id == id) {

                var split = decodeHtml($(this).attr('name')).split(',');
                split.pop();

                item = {};
                item ["id"] = $(this).attr('id');
                item ["name"] = split.join(',');
                item ["country"] = $(this).attr('country').id;

                jsonObj.push(item);

            }
        });

        console.log(jsonObj);
        loadCities(jsonObj);
        return jsonObj;
    };

});

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}
