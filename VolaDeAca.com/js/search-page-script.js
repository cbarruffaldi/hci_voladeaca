var selectedTimeFilter = [];

function selectBorder(elem) {
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
});

$("#order-dropdown a").on("click", function() {
	var orderbtn = $("#orderby-btn")
	orderbtn.text(this.text);
	orderbtn.append('<span class="caret"></span>');
});


$(".options-btn button").on("click", function(obj){
	var toggleID = $(this).attr("data-toggle");
	$("[data-toggleinfo = " + toggleID + "]").collapse('toggle');
});

$(document).on("click", ".details-btn button", function() {
	var btn = $(this);
	btn.parent().find(".price-details").collapse('toggle');
	if (btn.text() == "+ detalles") {
		btn.text("- detalles");
	} else {
		btn.text("+ detalles");
	}
});