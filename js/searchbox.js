(function(global){
	if(! global.$acUtils ){
		console.log("Err");
	}

	var $id_map = global.$acUtils.id_map;
	var soloIda = false;

	$("#origen, #destino").on('focus', function(){ 
		var self = $(this);
		if(self.hasClass('inputerr')){
			self.val("");
			self.removeClass('inputerr')
			var errid = '#' + self.attr("id") + '-err';
			$(errid).fadeOut();
		}

	});

	$("#origen").on('blur', function(){isValidAirport(this)});
	$("#destino").on('blur', function(){isValidAirport(this)});

	var validators = {};

	validators["origen"] = isValidAirport;
	validators["destino"] = isValidAirport;

	function isValidAirport(textbox, emptyCheck){
		textbox = $(textbox);

		textbox.removeClass('inputerr');

		var errid = "#" + textbox.attr("id") + "-err";
		var error = $(errid);

		error.fadeOut();

		if(textbox.val()){
			if(! $id_map[textbox.val()]){
				textbox.addClass('inputerr');
				error.text("Por favor ingrese algo valido");
				error.fadeIn();
				return false;
			}
			else{ 
				return true;
			}
		}
		else if(emptyCheck){
			textbox.addClass('inputerr');
			error.text("Esto no puede quedar vacío");
			error.fadeIn();
			return false;
		}
		return true;
	}


	function dateCheck(emptyCheck){
		var valid = true;

		var date1 = $("#datepicker1");
		var date2 = $("#datepicker2");

		date1.removeClass("inputerr");
		date2.removeClass("inputerr");

		$("#datepicker1-err").fadeOut();
		$("#datepicker2-err").fadeOut();

		var departure, arrival; 

		if(date1.val() || emptyCheck){
			departure = moment(date1.val(), "DD/MM/YYYY", true);
			if(!departure.isValid()){
				date1.addClass('inputerr');
				valid = false;

				$("#datepicker1-err").text("Ingrese una fecha valida");
				$("#datepicker1-err").fadeIn();
			}

		}

		if(!soloIda && (date2.val() || emptyCheck)) {
			arrival = moment(date2.val(), "DD/MM/YYYY", true);
			if(!arrival.isValid()){
				date2.addClass("inputerr");
				valid = false;
				$("#datepicker2-err").text("Ingrese una fecha valida");
				$("#datepicker2-err").fadeIn();
			}
		}

		if(valid && departure && arrival){ 
			//Si ambas estan definidas y bien formadas
			//chequeo que no sean incompatibles.

			if(!soloIda && departure.isAfter(arrival)){
				ret = false
				date1.addClass('inputerr');
				date2.addClass('inputerr');

				$("#datepicker1-err").text("La ida debe ser antes que la vuelta");
				$("#datepicker1-err").fadeIn();
			}
		}

		return valid;
	}

	global.validateInput = function(target){
		var id = ($(target).attr("id"));
		validators[id] && validators[id](target);
	}


	$(".idavuelta button").on("click", function() {
		$(".idavuelta button").removeClass("selected-iv");
		$(this).addClass("selected-iv");

		var pickerVuelta = $("#date-col-2");

		if ($(this).data("info") == "ida") {
			pickerVuelta.addClass("disabled-dp");
			pickerVuelta.find("input").prop('disabled', true);
			soloIda = true;
		}
		else {
			pickerVuelta.removeClass("disabled-dp");
			pickerVuelta.find("input").prop('disabled', false);
			soloIda = false;
		}
	})

	$("#searchButton").on('click', function(obj){

		var checker = isValidAirport($("#origen"), true);

		checker =  isValidAirport($("#destino"), true) & checker;

		checker = dateCheck(true) & checker;

		if(checker){		
			var iDate = moment($("#datepicker1").val(), "DD/MM/YYYY").format("YYYY-MM-DD");
			var vDate;
			if (soloIda)
				vDate = "##"
			else 
				vDate = moment($("#datepicker2").val(), "DD/MM/YYYY").format("YYYY-MM-DD");
			
			var uri = 'search.html?';
			uri += 'orig=' + $id_map[$("#origen").val()];
			uri += '&dest=' + $id_map[$("#destino").val()];
			uri += '&date=' + iDate;
			uri += '&vdate=' + vDate;
			uri += '&adpax=' + window.passengers.adults;
			uri += '&chpax=' + window.passengers.children;
			uri += '&inpax=' + window.passengers.infants;
			window.location.href = uri;
		}
	})

})(window);