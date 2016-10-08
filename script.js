
jQuery(document).ready(function(){


	new Awesomplete(document.getElementById("origen"), {
	list: $acUtils.airportList,
	minChars: 3,
	autoFirst: true}
	);

	new Awesomplete(document.getElementById("destino"), {
	list: $acUtils.airportList,
	minChars: 3,
	autoFirst: true}
	);


	$(".btn-month").on("click", function(){fill(this, "month", "week")});
	$(".btn-week").on("click", function(){fill(this,"week", "dest")});
	$(".btn-dest").on("click", function(){fill(this, "dest")});

	var promocion = {};
	var selected = {};

	var expanded = {
		month: true,
		dest: false,
		week: false,
	}


	function fill(btn, selected, toExpand){
		var button = $(btn);

		if(expanded[selected]){
			selectButton(button, selected);

			if(toExpand){	
				expanded[toExpand] || make_available(toExpand);
			}

		} 
	}

	function make_available(category){
		$(".btn-" + category).removeClass("disabled"); 	
		expanded[category] = true;
	}


	function selectButton(button, type){
		console.log(button.data("promo"));
		promocion[type] = button.data("promo");


		if(selected[type]){
			selected[type].removeClass("btn-success");
			selected[type].addClass("btn-default");
		}

		selected[type]  = button;

		selected[type].removeClass("btn-default");
		selected[type].addClass("btn-success");
	}

	function showPack(){
		var s = "<em>#debugging</em> <br> <strong>El pack tiene:</strong> <br>";
		for(var selector in promocion){
			s+= selector + ": " + promocion[selector];
			s+= '<br>';
		}
		$("#showInfo").html(s);
	}
	
}); //document.ready
