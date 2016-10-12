$(function() {
	var dateFormat = "dd/mm/yy",
			from = $( "#datepicker1" )
	.datepicker({})
	.on( "change", function() {
		to.datepicker( "option", "minDate", getDate( this ) );
	}),
			to = $( "#datepicker2" )
	.datepicker({})

	function getDate( element ) {
		var date;
		try {
			date = $.datepicker.parseDate( dateFormat, element.value );
		} catch( error ) {
			date = null;
		}
		return date;
	}
});