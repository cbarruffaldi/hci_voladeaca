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



	$(function() {

    var $sidebar   = $(".filter-area"), 
        $window    = $(window),
        offset     = $sidebar.offset(),
        topPadding = 15;
	
  	 var lastScroll = 0;


$(function() {
    var $sidebar   = $(".filter-area"), 
        $window    = $(window),
        offset     = $sidebar.offset(),
        topPadding = 15,
        bottomPadding = 350,
        windowHeight = $window.height();

        var lastScroll = 0;

    $window.scroll(function() {
    	var st = $(this).scrollTop();

    	if(st < lastScroll){
        if ($window.scrollTop() < $sidebar.offset().top) {
            $sidebar.stop().animate({
                marginTop: $window.scrollTop() - offset.top + topPadding
            }, {duration: 0}, "_default");
        } else {
            $sidebar.stop().animate({
                marginBottom: 0
            }, {duration:50}, "_default");

    	}
    	}
    	else if(st > lastScroll){
        if ($window.scrollTop() + $window.height() > $sidebar.position().top + $sidebar.outerHeight(true)) {
            $sidebar.stop().animate({
                marginTop: $window.scrollTop() - offset.top - bottomPadding
            }, {duration: 0}, "_default");
        } else {
            $sidebar.stop().animate({
                marginBottom: 0
            }, {duration:50}, "_default");

    	}

	}
    lastScroll = st;

    });
    
});


    
});






	$("#order-dropdown a").on("click", function() {
		var orderbtn = $("#orderby-btn")
		orderbtn.text(this.text);
		orderbtn.append('<span class="caret"></span>');
	});

	$("#currency-dropdown a").on("click", function() {
		var currbtn = $("#currency-btn")
		currbtn.text(this.text);
		currbtn.append('<span class="caret"></span>');
	});

	$(".options-btn button").on("click", function(obj){
		var toggleID = $(this).attr("data-toggle");
		$("[data-toggleinfo = " + toggleID + "]").collapse('toggle');
	});



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