jQuery(document).ready(function(){
	$acUtils.load().then( function(){
	

	new Awesomplete(document.getElementById("origen"), {
		list: $acUtils.airportList,
		blist: ["Chelo", "Es", "Un", "Idolo", "Buenos Dias", "Buenos Aires", "Buena Vida"],
		minChars: 3,
		autoFirst: true}
	);

	new Awesomplete(document.getElementById("destino"), {
		list: $acUtils.airportList,
		minChars: 3,
		autoFirst: true}
	);

		initSearchbox(window);

	});
	
}); //document.ready
