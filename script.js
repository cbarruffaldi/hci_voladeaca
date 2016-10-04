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


$(".btn-month").on("click", function(){fill(this, "month", "week")});
$(".btn-week").on("click", function(){fill(this,"week", "dest")})
$(".btn-dest").on("click", function(){fill(this, "dest")})

var promocion = {};
var selected = {};

var expanded = {
	month: true,
	dest: false,
	week: false,
}


function fill(btn, selected, toExpand){
	var button = $(btn);
	selectButton(button, selected);
	
	if(toExpand){	
		expanded[toExpand] || make_available(toExpand);
		showPack();
	}
}

function make_available(category){
	$(".btn-" + category).removeClass("disabled"); 	
	expanded[category] = true;
}


function selectButton(button, type){
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
