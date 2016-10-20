	var elementPosition = $('#review-form').offset();
	$(window).scroll(function(){
        if($(window).scrollTop() > elementPosition.top -20){
              $('#review-form').addClass("fixed-reviewform");
        } else {
            $('#review-form').removeClass("fixed-reviewform");
        }    
	});
