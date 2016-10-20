	var elementPosition = $('#review-form').offset();
	$(window).scroll(function(){
        if($(window).scrollTop() > elementPosition.top -20){
              $('#review-form').addClass("fixed-reviewform");
        } else {
            $('#review-form').removeClass("fixed-reviewform");
        }    
	});

	function initSlider(id){
	var handlesSlider = document.getElementById(id);
	noUiSlider.create(handlesSlider, {
		start: [5],
		//snap: true,
		step: 1,
		//behaviour: 'tap',
		tooltips: [wNumb({decimals:0})],
		range: {
			'min': 0,
			'max': 10
		},
		//step: minPrice - maxPrice,
	});
	}


	initSlider('comfort-slider');
	initSlider('food-slider');
	initSlider('friendliness-slider');
	initSlider('mileage-slider');
	initSlider('quality-slider');
	initSlider('punctuality-slider');