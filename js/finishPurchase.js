$(document).ready(function(){

	$(".failedPurchase").hide();
	$(".successfulPurchase").hide();

	$("#buying-modal").find(".buying-text").text('Comprando vuelo' + (localStorage.bookingVuelta ? 's' : '') + '...');

	$("#reset").click(function() {
		buyFlight(localStorage.bookingIda, localStorage.bookingVuelta);
	});
});


$(document).ready(function(){
	var booking = getURLParameter("booking");
	if(booking == 'true'){
		$(".successfulPurchase").show();
	} else {
		$(".failedPurchase").show();
	}
});


function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}