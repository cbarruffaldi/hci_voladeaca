$(document).ready( function(){
	
	$acUtils.load().then(function() {
		formSetup();
		mapSetup(window);
	});

	function formSetup(){
		new Awesomplete(document.getElementById("inputCity"), {
		list: $acUtils.airportList,
		minChars: 1,
		autoFirst: true}
		);
	

	$( "#datepicker" ).datepicker({minDate: +2, showAnim: ""});


	function update(city, date){
		if(validate(true, true, true)){
			mapUtils.updateMap($acUtils.id_map[city]);
		}

	}

	function validate(city, date, emptyCheck){
		var val = true;
		if(city){
			var textbox = $("#inputCity");

			textbox.removeClass('inputerr');
			var error = $("#air-error");

			error.fadeOut();

			if(textbox.val()){
				if(!$acUtils.id_map[textbox.val()]){
					textbox.addClass('inputerr');
					error.text("Por favor ingrese algo valido");
					error.fadeIn();
					val = false;
				}
			}
			else if(emptyCheck){
				textbox.addClass('inputerr');
				error.text("Esto no puede quedar vacío");
				error.fadeIn();
				val = false;
			}
		}
		
		if(date){
			var picker = $("#datepicker");
			picker.removeClass('inputerr');
			var picker_err = $("#datepicker-err");
			picker_err.fadeOut();

			if(picker.val() || emptyCheck){
				var picked = moment(picker.val(), "DD/MM/YYYY", true);
				if(!picked.isValid()){
					picker.addClass('inputerr');
					val = false;
					picker_err.text("Ingrese una fecha valida");
					picker_err.fadeIn();
				}
				if(val){
					var now = moment();
					if(picked.diff(now, 'days') + 1 < 2){
						val = false;
						picker.addClass('inputerr');
						picker_err.text("Debe ser por lo menos dos días desde ahora");
						picker_err.fadeIn();
					}
				}
		}
	}

		return val;
	}


	$("#inputCity").on('focus', function(){
		var self = $(this);
		if(self.val()){
			self.addClass('x');
		}
		if(self.hasClass('inputerr')){
			//	self.val("");
			self.removeClass('inputerr');
			//	self.removeClass('x');
			var errid = '#air-error';
			$(errid).fadeOut();
		}
	});


	$("#inputCity").on('blur', function(){
		validate(true);	
		var self = $(this);
		if(! self.val()){
			self.removeClass('x');
		}	
	})

	//$("#datepicker").on('blur', function(){
	//	validate(false, true);		
	//})

	$("#inputCity").keypress(function(event) {
	 	  if (event.which == 13) {
	        event.preventDefault();
	        update($(this).val());
	    }
	});

	//	$("#inputCity").on('change', function() {
	//									mapUtils.updateMap($acUtils.id_map[$(this).val()]);
	//								});
	
		$("#updateCity").on('click', function(){
			update($("#inputCity").val(), $("#datepicker").val());
		})
	}

});