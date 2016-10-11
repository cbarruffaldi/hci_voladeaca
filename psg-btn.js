var passengers = {}
passengers.adults = 0
passengers.children = 0
passengers.infants = 0

passengers.total = function() {
	return this.adults + this.children + this.infants;
}

function updateNumbers() {
	$("#adult-number").text(passengers.adults);
	$("#child-number").text(passengers.children);
	$("#infant-number").text(passengers.infants);
	var t = passengers.total();
	var str = t + " Pasajero" + ((t == 1) ? "" : "s");
	$("#psg-dropdown").text(str);
}

function updatePax(element) {
	var sum = 0;
	if ($(element).data("sum") == "minus")
		sum = -1;
	else
		sum = 1;
	
	if (passengers[$(element).data("info")] + sum >= 0)
		passengers[$(element).data("info")] += sum;
		
	updateNumbers();
}

function totalPassengers() {
	return adults + children + infants;
}

jQuery(document).ready(function() {
	$("#psg-dropdown").on("click", function(e) {
		$("#psg-dropdown").parent().toggleClass("open");

		// Listener para cerrar dropdown.
		$("body").on("click", function(e) {
			var psgdrop = $("#psg-dropdown");
			var okbtn = $("#ok-btn");

			if (okbtn.is(e.target) || (!psgdrop.is(e.target) && psgdrop.has(e.target).length === 0 && $(".open").has(e.target).length === 0)) {
				psgdrop.parent().removeClass("open");
			}
		});
	});	

	$(".passenger-row button").on("click", function() {
		updatePax(this);
	});
})

window.passengers = passengers;
