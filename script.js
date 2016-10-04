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
/*var buttons = document.querySelectorAll(".btn-month");
for(var i = 0; i < buttons.length ; i++)
  buttons[i].addEventListener("click", fillMonth); 
*/

buttons = document.querySelectorAll(".btn-week");
for(var i = 0; i < buttons.length ; i++)
	buttons[i].addEventListener("click", function(){fill("week", "dest")}); 

buttons = document.querySelectorAll(".btn-dest");
for(var i = 0; i < buttons.length ; i++)
	buttons[i].addEventListener("click", function(){fill("dest", "fin")}); 


$(".btn-month").on("click", function(){fill(this, "month", "week")});

var promocion = {};
var selected = {};
var expanded = {
	month: true,
	dest: false,
	week: false,
}


function fill(a, selected, toExpand){
	var self = $(a);
	selectButton(self, selected);
	
	expanded[toExpand] || make_available(toExpand);
	showPack();
}

function make_available(category){
	$(".btn-" + category).attr("class", "btn btn-default btn-"+category); 	
	expanded[category] = true;
}


function selectButton(btn, type){
	promocion[type] = btn.attr("value");

	if(selected[type]){
		selected[type].removeClass("btn-success");
		selected[type].addClass("btn-default");
	}

	selected[type]  = btn;

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
