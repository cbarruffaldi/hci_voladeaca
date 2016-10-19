jQuery(document).ready(function(){
	$acUtils.load().then( function(){
	
	initSearchbox(window);

	new Awesomplete(document.getElementById("origen"), {
		list: $acUtils.airportList,
		minChars: 3,
		autoFirst: true}
	);

	new Awesomplete(document.getElementById("destino"), {
		list: $acUtils.airportList,
		minChars: 3,
		autoFirst: true}
	);
	});
	
}); //document.ready
