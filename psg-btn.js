var passengers = {}
passengers.adults = 1
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
	$("#psg-dropdown .btn-content").text(str);
}

function zeroAdultsError() {
	$("#zero-adults-msg").fadeIn();
}

function updatePax(pressedbtn) {
	var sum = 0;
	if ($(pressedbtn).data("sum") == "minus")
		sum = -1;
	else
		sum = 1;
	
	var cat = $(pressedbtn).data("info");
	
	if (cat == "adults" && passengers[cat] + sum < 1)
		zeroAdultsError();
	else if(passengers[cat] + sum >= 0)
		passengers[cat] += sum;
		
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
		$("#zero-adults-msg").fadeOut();
		updatePax(this);
	});
})

window.passengers = passengers;
