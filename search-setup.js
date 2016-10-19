(function(global){

	function getURLParameter(name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
	}

	function fillSearchBox() {
		var orig = getURLParameter("orig");
		var dest = getURLParameter("dest");
		var idate = getURLParameter("date");
		var adults = getURLParameter("adults");
		var children = getURLParameter("children");
		var infants = getURLParameter("infants");
		var vdate = getURLParameter("vdate");

		$("#origen").val(orig);
		$("#destino").val(dest);
		$("#datepicker1").val(idate);

		if (vdate)
			$("#datepicker2").val(vdate);
		else {
			$(".idavuelta button").removeClass("selected-iv");
			$(".idavuelta .ida").addClass("selected-iv");
			//global.setOneWay();
		}
		
		//global.$acUtils.name_map["AEP"];
	};

	jQuery(document).ready(function(){
		$acUtils.load().then(fillSearchBox);
	});

})(window);

