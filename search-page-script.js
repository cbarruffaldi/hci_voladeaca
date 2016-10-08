jQuery(document).ready(function(){

	$(".depart-time-button img").on("click", function(){
		selectBorder(this);
	});

	var selectedTimeFilter = [];

	function selectBorder(elem) {
		var timebtn = $(elem)
		var i = timebtn.data("dep-time");
		console.log("CHANGE BORDER");
		console.log(i);

		if (selectedTimeFilter[i]) {
			selectedTimeFilter[i] = false;
			timebtn.css("border-top", "");
		} else {
			selectedTimeFilter[i] = true;
			timebtn.css("border-top", "5px solid black");
		}
	}


	$("#order-dropdown a").on("click", function() {
		$("#orderby-btn em").text(this.text);
	});

	$("#currency-dropdown a").on("click", function() {
		$("#currency-btn em").text(this.text);
	});

	var adults = 0, children = 0, infants = 0;

	$("#psg-dropdown").on("click", function(e) {
		$("#psg-dropdown").parent().toggleClass("open");

		// Listener para cerrar dropdown.
		$("body").on("click", function(e) {
			var psgdrop = $("#psg-dropdown");
			var okbtn = $("#ok-btn");

			//TODO: ver como carajo funciona esto
			if (okbtn.is(e.target) || (!psgdrop.is(e.target) && psgdrop.has(e.target).length === 0 && $(".open").has(e.target).length === 0)) {
				psgdrop.parent().removeClass("open");
			}
		});
	});

	console.log("adding listener");
	$(".passenger-row button").on("click", function() {
		updatePax(this);
	});

	function updatePax(element) {
		console.log("touched btn");
		var sum = 0;
		if ($(element).data("sum") == "minus")
			sum = -1;
		else
			sum = 1;

		var pax = $(element).parent().find(".passenger-number");
		var newnum = parseInt(pax.text()) + sum;
		if (newnum >= 0)
			pax.text(newnum);
	}

	$(".options-btn").on("click", function(){
		$(this).parent().find(".unselected-box").collapse('toggle');
	})

	$(".details-btn button").on("click", function() {
		var btn = $(this);
		btn.parent().find(".price-details").collapse('toggle');
		if (btn.text() == "+ detalles") {
			btn.text("- detalles");
		} else {
			btn.text("+ detalles");
		}
	});
});

//TODO HACER BIEN
function updateValueText(value) {
	$("#price-slider-value").text("$" + value);
}
