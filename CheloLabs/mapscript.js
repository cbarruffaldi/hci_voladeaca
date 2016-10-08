	new Awesomplete(document.getElementById("inputCity"), {
	list: $airportList,
	minChars: 1,
	autoFirst: true}
	);


	$("#inputCity").val("Buenos Aires (todos los aeropuertos)");

	$("#inputCity").keypress(function(event) {
 	  if (event.which == 13) {
        event.preventDefault();
		mapUtils.updateMap($idMap[$(this).val()]);  
    }
});

	$("#inputCity").on('change', function() {
									mapUtils.updateMap($idMap[$(this).val()]);
								});
	
	$("#updateCity").on('click', function(){
		mapUtils.updateMap($idMap[$("#inputCity").val()]);
	})