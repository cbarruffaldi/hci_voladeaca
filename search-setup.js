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

		if(orig && dest && idate && adults && children && infants){
		idate = idate.split('-').reverse().join('/');

		$("#origen").val($acUtils.name_map[orig]);
		$("#destino").val($acUtils.name_map[dest]);
		$("#datepicker1").val(idate);

		if (vdate) {
			vdate = vdate.split('-').reverse().join('/');
			$("#datepicker2").val(vdate);
		}
		else {
			$(".idavuelta button").removeClass("selected-iv");
			$(".idavuelta .ida").addClass("selected-iv");
			global.setOneWay();
		}
	}
		global.passengers.adults = parseInt(adults) || 1;
		global.passengers.children = parseInt(children) || 0;
		global.passengers.infants = parseInt(infants) || 0;
	};

	$(document).ready(function(){
		$acUtils.load().then(function(){
			fillSearchBox();
		});
	});

})(window);

