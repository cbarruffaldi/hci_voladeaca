	new Awesomplete(document.getElementById("inputCity"), {
	list: $acUtils.airportList,
	minChars: 1,
	autoFirst: true}
	);


	$("#inputCity").val("Buenos Aires (todos los aeropuertos)");

	$("#inputCity").keypress(function(event) {
 	  if (event.which == 13) {
        event.preventDefault();
		mapUtils.updateMap($acUtils.id_map[$(this).val()]);  
    }
});

	$("#inputCity").on('change', function() {
									mapUtils.updateMap($acUtils.id_map[$(this).val()]);
								});
	
	$("#updateCity").on('click', function(){
		mapUtils.updateMap($acUtils.id_map[$("#inputCity").val()]);
	})