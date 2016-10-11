var selectedTimeFilter = [];

function selectBorder(elem) {
	console.log(elem);
	var timebtn = $(elem)
	var i = timebtn.data("dep-time");

	if (selectedTimeFilter[i]) {
		selectedTimeFilter[i] = false;
		timebtn.removeClass("selected-time");
	} else {
		selectedTimeFilter[i] = true;
		timebtn.addClass("selected-time");
	}
}

jQuery(document).ready(function(){
	$(".depart-time-button img").on("click", function(){
		selectBorder(this);
	});

	$("#order-dropdown a").on("click", function() {
		$("#orderby-btn").text(this.text);
	});

	$("#currency-dropdown a").on("click", function() {
		$("#currency-btn").text(this.text);
	});

	$("#options-ida button").on("click", function(){
		$("#unselected-ida").collapse('toggle');
	});

	$("#options-vuelta button").on("click", function(){
		$("#unselected-vuelta").collapse('toggle');
	});

	$(".details-btn button").on("click", function() {
		var btn = $(this);
		btn.parent().find(".price-details").collapse('toggle');
		if (btn.text() == "+ detalles") {
			btn.text("- detalles");
		} else {
			btn.text("+ detalles");
		}
	});



	var handlesSlider = document.getElementById('price-slider');

	noUiSlider.create(handlesSlider, {
		start: [ 0, 10000],
		margin: ((10000 - 0) * 0.25),
		connect: true,
		tooltips: [wNumb({decimals: 0, prefix: "Desde: $"}), wNumb({decimals: 0, prefix: "Hasta: $"})],
		range: {
			'min': [0],
			'max': [10000]
		},
		step: 100,
	});

	$("#restart-price-btn").on("click", function(){
		handlesSlider.noUiSlider.reset();
	});

	handlesSlider.noUiSlider.on('update', function(){
		var max = handlesSlider.noUiSlider.get()[1];
		$("#preciobox").val(max);
	});


});
