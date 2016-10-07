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
	
});

function updateValueText(value) {
	$("#price-slider-value").text("$" + value);
}

