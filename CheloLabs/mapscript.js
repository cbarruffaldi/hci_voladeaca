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
		if(validate()){
			mapUtils.updateMap($acUtils.id_map[city]);
		}

	}

	function validate(city, date){
		var val = true;
		if(city){
			textbox = $("#inputCity");

			textbox.removeClass('inputerr');
			var error = $("#air-error");

			error.fadeOut();

			if(textbox.val()){
				if(!$acUtils.id_map[textbox.val()]){
					textbox.addClass('inputerr');
					error.text("Por favor ingrese algo valido");
					error.fadeIn();
					return false;
				}
				else{
					return true;
				}
			}
			else{
				textbox.addClass('inputerr');
				error.text("Esto no puede quedar vacío");
				error.fadeIn();
				return false;
			}
		}
		
		if(date){
		var timestamp=Date.parse($("#datepicker").val());

		if (isNaN(timestamp)){

		}


			departure = moment(date1.val(), "DD/MM/YYYY", true);
			if(!departure.isValid()){
				date1.addClass('inputerr');
				valid = false;

				$("#datepicker1-err").text("Ingrese una fecha valida");
				$("#datepicker1-err").fadeIn();
		}

		return true;

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
		validate($(this).val());		
	})

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
			update($("#inputCity").val());
		})
	}

});