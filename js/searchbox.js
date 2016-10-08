(function(global){
	if(! global.acUtils ){
		console.log("Err");
	}

	var $id_map = global.acUtils.id_map;

//	$(".formError").fadeOut();

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
	$(".awesomeplete li").click(function(){ console.log("Yeah!")});
	$("#destino").on('blur', function(){isValidAirport(this)});

	var validators = {};

	validators["origen"] = isValidAirport;
	validators["destino"] = isValidAirport;

	function isValidAirport(textbox){
		textbox = $(textbox);

		textbox.removeClass('inputerr');

		if(textbox.val()){
			if(! $id_map[textbox.val()]){
				textbox.addClass('inputerr');
				var errid = "#" + textbox.attr("id") + "-err";
				//$(errid).text("Por favor ingrese algo valido (!)");
				$(errid).fadeIn();
			}
		}
	}

	global.validateInput = function(target){
		var id = ($(target).attr("id"));
		validators[id] && validators[id](target);
	}
})(window);