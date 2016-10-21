$(function() {
	var dateFormat = "dd/mm/yy",
			from = $( "#datepicker1" )
	.datepicker({minDate: +2, showAnim: ""})
	.on( "change", function() {
		var date = getDate( this );
		to.datepicker( "option", "minDate",date );
	}),
			to = $( "#datepicker2" )
	.datepicker({minDate: +2, showAnim: ""})

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