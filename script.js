//Defino cosas en el scope global?
var promocion = {};

var selected = {
	month: null,
	dest: null,
	week: null
};

var expanded = {
	month: true,
	dest: false,
	week: false
}


function fillMonth(event){
	selectButton(event.target, "month");
	expanded["week"] || make_available("week");
	showPack(); //DEDUG
}


function fillWeeks(event){
	if(expanded.week){
		selectButton(event.target, "week");
		expanded["dest"] || make_available("dest");
	}
	
	showPack(); //DEDUG

}


function fillDest(event){
	if(expanded.dest){
		selectButton(event.target, "dest");
	}

showPack(); //DEDUG

}


function make_available(category){
	$(".btn-" + category).attr("class", "btn btn-default btn-"+category); 	
	expanded[category] = true;
}



function selectButton(target, processing){
	var id = target.getAttribute("id");
	var obj = $('#' + id);
 	
	promocion[processing] = obj.attr("value");
	changeSelected(processing, obj);

}


function changeSelected(type, obj){

	if(selected[type]){
		selected[type].attr("class", "btn btn-default btn-" + type);
	}

	selected[type]  = obj;
	selected[type].attr("class", "btn btn-success btn-" + type);
}

function showPack(){
	var s = "<em>#debugging</em> <br> <strong>El pack tiene:</strong> <br>";
	for(var selector in promocion){
		s+= selector + ": " + promocion[selector];
		s+= '<br>';
	}
	$("#showInfo").html(s);
}
