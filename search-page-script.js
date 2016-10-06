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
		console.log("clicked dropdown");
		$("#orderby-btn em").text(this.text);
	})
});

function updateValueText(value) {
	$("#price-slider-value").text("$" + value);
}