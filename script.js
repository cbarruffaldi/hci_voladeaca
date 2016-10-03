//Defino cosas en el scope global?
var promocion = {
};

var selected = {};

var expanded = {
	month: true,
	dest: false,
	weeks: false
}



function fillMonth(event){
	selectButton(event.target, "month");

	expand("weeks", "#promo_weeks", 
                '<button type="button" class="btn btn-default" value="0" id="2w" onclick="fillWeeks(event)">Fin de semana</button>'
               + '<button type="button" class="btn btn-default" value="1" id="3w" onclick="fillWeeks(event)">Una semana</button>'
               + '<button type="button" class="btn btn-default" value="2" id="4w" onclick="fillWeeks(event)">Dos semanas</button>'
              + '<button type="button" class="btn btn-default" value="3" id="5w" onclick="fillWeeks(event)">¡Cualquier momento!</button>'
		);

	showPack(); //DEDUG
}


function fillWeeks(event){
	if(expanded.weeks){
		selectButton(event.target, "weeks");

		expand("dest","#promo_dest",
					 '<button type="button" class="btn btn-default" value="0" id="pb" onclick="fillDest(event)">Playas de Brasil</button>'
	               + '<button type="button" class="btn btn-default" value="1" id="pp" onclick="fillDest(event)">Paris</button>'
	               + '<button type="button" class="btn btn-default" value="2" id="lon" onclick="fillDest(event)">Londres</button>'
	               + '<button type="button" class="btn btn-default" value="3" id="mun" onclick="fillDest(event)">Munich</button>' );

	}

showPack(); //DEDUG

}


function fillDest(event){
	if(expanded.dest){
		selectButton(event.target, "dest");
	}

showPack(); //DEDUG

}


function selectButton(target, processing){
	var id = target.getAttribute("id");
	var obj = $('#' + id);
 	
	promocion[processing] = obj.attr("value");
	changeSelected(processing, obj);

}


function expand(processing, id, code){
	if(!expanded[processing]){
			expanded[processing] = true;
			$( id ).html( code );
	}
}

function changeSelected(type, obj){

	if(selected[type]){
		selected[type].attr("class", "btn btn-default");
	}

	selected[type]  = obj;
	selected[type].attr("class", "btn btn-primary");
}

function showPack(){
	var s = "<em>#debugging</em> <br> <strong>El pack tiene:</strong> <br>";
	for(var selector in promocion){
		s+= selector + ": " + promocion[selector];
		s+= '<br>';
	}
	$("#showInfo").html(s);
}
