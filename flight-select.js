var flight1 = {};
var flight2 = {};
var selectedFlight;

flight1.airlineName = "Air Canada";
flight1.departDate = "Viernes 10";
flight1.departTime = "10:00hs";
flight1.departAirport = "EZE";
flight1.duration = "18h18m";
flight1.flnumber = "AC3214";
flight1.arrivalDate = "Sábado 11";
flight1.arrivalTime = "01:00hs";
flight1.arrivalAirport = "JFK";

flight2.airlineName = "Aerolíneas Argentinas";
flight2.departDate = "Viernes 10";
flight2.departTime = "11:00hs";
flight2.departAirport = "EZE";
flight2.duration = "18h19m";
flight2.flnumber = "AA3224";
flight2.arrivalDate = "Sábado 11";
flight2.arrivalTime = "03:00hs";
flight2.arrivalAirport = "JFK";

function fillFlight(item, flight) {
  item.find(".air-name").text(flight.airlineName);
  item.find(".depart-date").text(flight.departDate);
  item.find(".depart-time").text(flight.departTime);
  item.find(".depart-air").text(flight.departAirport);
  item.find(".land-air").text(flight.arrivalAirport);
  item.find(".land-date").text(flight.arrivalDate);
  item.find(".land-time").text(flight.arrivalTime);
  item.find(".duration").text(flight.duration);
  item.find(".fl-number").text(flight.flnumber);
}

function fillSelectedIda(flight) {
  var selectedIda = $("#selected-ida");
  fillFlight(selectedIda, flight);
}

function fillUnSelectedIda(flight) {
  var unSelectedIda = $("#unselected-ida");
  fillFlight(unSelectedIda, flight);
}

jQuery(document).ready(function() {
  // var selectedVuelta = $()
  var selected = flight1;
  var unselected = flight2;
  fillSelectedIda(selected);
  fillUnSelectedIda(unselected);

  $("#unselected-ida .unselected-item").on("click", function() {
    var aux = selected;
    selected = unselected;
    unselected = aux;
    fillSelectedIda(selected);
    fillUnSelectedIda(unselected);

    console.log("collapsing");
    $("#unselected-ida").collapse('toggle');
  });
});
