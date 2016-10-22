$(document).ready(function(){

	$(".failedPurchase").hide();
	$(".successfulPurchase").hide();
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