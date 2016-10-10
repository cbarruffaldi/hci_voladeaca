(function(global){

	var airports = [];
  var idMap = {};

    function load(){
      $.ajax({
        url: "http://hci.it.itba.edu.ar/v1/api/geo.groovy?method=getairports&callback=$acUtils.listFill",
        datatype: "jsonp"
      });

      $.ajax({
        url: "http://hci.it.itba.edu.ar/v1/api/geo.groovy?method=getcities&callback=$acUtils.cityFill",
        datatype: "jsonp"
      });

    }

    function fill(response){
      var airs = response.airports;

      for(var i = 0; i < airs.length ; i++){
        var nombre = airs[i].description;
        var cityID = airs[i].id;
        var disp = cityID + " - " + nombre;
        airports.push({value: disp, label: disp}); 
        idMap[disp] = cityID;
      }
    }


  function cfill(response){
      
      var cities = response.cities;

      for(var i = 0; i < cities.length ; i++){
        var nombre = cities[i].name;
        var cityID = cities[i].id;
        var disp = cityID + " - " + nombre + " (todos los aeropuertos)";
        airports.push({value: disp, label: disp}); 
        idMap[disp] = cityID;
      }

    }
    
    //Este es el objeto que le voy a exponer a global (namespace de estas funciones)
    var acUtils = {
      listFill: fill,
      cityFill: cfill,
      id_map: idMap,
      airportList: airports
    }
    
    global.$acUtils = acUtils;

    load();
    
})(window);

