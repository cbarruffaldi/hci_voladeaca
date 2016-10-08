(function(){

	airports = [];
    load();

    function load(){
      $.ajax({
        url: "http://hci.it.itba.edu.ar/v1/api/geo.groovy?method=getairports&callback=listFill",
        datatype: "jsonp"
      });

      $.ajax({
        url: "http://hci.it.itba.edu.ar/v1/api/geo.groovy?method=getcities&callback=cityFill",
        datatype: "jsonp"
      });

    }

    function fill(response){
      //var r = [];
      var ct = response.airports;

      for(var i = 0; i < ct.length ; i++){
        var nombre = response.airports[i].description;
        var cityID = response.airports[i].id;
        var disp = cityID + " - " + nombre;
        airports.push({value: cityID, label: disp}); 
      }
    }

        function cfill(response){
      //var r = [];
      var ct = response.cities;

      for(var i = 0; i < ct.length ; i++){
        var nombre = response.cities[i].name;
        var cityID = response.cities[i].id;
        var disp = cityID + " - " + nombre + " (todos los aeropuertos)";
        airports.push({value: cityID, label: disp}); 
      }
    }


    window.listFill = fill;
    window.cityFill = cfill;
	new Awesomplete(document.getElementById("inputCity"), {
	list: airports,
	minChars: 1,
	autoFirst: true}
	);

})();

