	console.log($("#inputCity"));

	$("#inputCity").keypress(function(event) {
    if (event.which == 13) {
        event.preventDefault();
		mapUtils.updateMap($(this).val());  
    }
});

	$("#inputCity").on('change', function() {
									mapUtils.updateMap($(this).val());
								});
