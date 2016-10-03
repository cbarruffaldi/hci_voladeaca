 //DATEPICKER
  $( function() {
    var dateFormat = "dd/mm/yy",
      from = $( "#datepicker1" )
        .datepicker({
          defaultDate: "+1w",
          changeMonth: true,
        })
        .on( "change", function() {
          to.datepicker( "option", "minDate", getDate( this ) );
        }),
      to = $( "#datepicker2" ).datepicker({
        defaultDate: "+1w",
        changeMonth: true,
      })
 

    function getDate( element ) {
      var date;
      try {
        date = $.datepicker.parseDate( dateFormat, element.value );
      } catch( error ) {
        date = null;
      }
      return date;
    }
  } );


// Fin datepicker

//Defino cosas en el scope global?
var buttons = document.querySelectorAll(".btn-month");
for(var i = 0; i < buttons.length ; i++)
	buttons[i].addEventListener("click", fillMonth); 

buttons = document.querySelectorAll(".btn-week");
for(var i = 0; i < buttons.length ; i++)
	buttons[i].addEventListener("click", fillWeeks); 

buttons = document.querySelectorAll(".btn-dest");
for(var i = 0; i < buttons.length ; i++)
	buttons[i].addEventListener("click", fillDest); 


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


function fillMonth(){
	console.log(this);
	selectButton(this, "month");
	expanded["week"] || make_available("week");
	showPack(); //DEDUG
}


function fillWeeks(){
	if(expanded.week){
		selectButton(this, "week");
		expanded["dest"] || make_available("dest");
	}
	
	showPack(); //DEDUG

}


function fillDest(){
	if(expanded.dest){
		selectButton(this, "dest");
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
