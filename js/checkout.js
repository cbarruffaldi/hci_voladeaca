$(document).ready(function(){
    $('.btnNext').click(function(){
        $('.nav-tabs > .active').next('li').find('a').trigger('click');

        if($('.nav-tabs > .active').hasClass('disabled')) {
            $('.nav-tabs > .active').removeClass('disabled');
        }
    });
});

$(document).ready(function(){
    $('.btnPrev').click(function(){
        $('.nav-tabs > .active').prev('li').find('a').trigger('click');

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
    var maxField = 3; //Input fields increment limitation
    var addButton = $('.add-Phone'); //Add button selector
    var wrapper = $('#contact-form'); //Input field wrapper
    var fieldHTML =' <div class="phone-data">' +
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
        '</div>'+' </div>' +'</div>';


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

$(document).ready(function(){
    $('.tooltipLink').click(function(){

    });
});

