(function(){

	$acUtils.load().then(function() {

	new Awesomplete(document.getElementById("inputCity"), {
	list: $acUtils.airportList,
	minChars: 1,
	autoFirst: true}
	);

	});


	(function formSetup(){
		new Awesomplete(document.getElementById("inputCity"), {
		list: $acUtils.airportList,
		minChars: 1,
		autoFirst: true}
		);
	

	$( "#datepicker" ).datepicker({minDate: +2});



	function update(){
		if(validate(true, true, true)){
			
			var city = $("#inputCity").val()
			var date = moment($("#datepicker").val(), "DD/MM/YYYY", true);

			mapUtils.updateMap($acUtils.id_map[city], date);
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



	$("#datepicker").on('change', function(event){
		validate(false,true);	
		var self = $(this);
		if(! self.val()){
			self.removeClass('x');
		}	
	})



	$("#inputCity").keypress(function(event) {
	 	  if (event.which == 13) {
	        event.preventDefault();
	        update();
	    }
	});

	
		$("#search").on('click', function(){
			update();
		})
	})();



})();