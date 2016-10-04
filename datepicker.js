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