(function(global){

	var airports = [];
  var idMap = {};
  var nameMap = {};

  var acUtils = {
      listFill: fill,
      cityFill: cfill,
      id_map: idMap,
      name_map: nameMap,
      airportList: airports
    }

    function load(){
      if(!localStorage.acUtils){
      return $.ajax({
        url: "http://hci.it.itba.edu.ar/v1/api/geo.groovy?method=getairports&callback=$acUtils.listFill",
        datatype: "jsonp"
      }).then(function(){
          $.ajax({
          url: "http://hci.it.itba.edu.ar/v1/api/geo.groovy?method=getcities&callback=$acUtils.cityFill",
          datatype: "jsonp"});
        });
    }
    else{
//      console.log("Here");
      var ac =JSON.parse(localStorage.acUtils);
      acUtils.id_map = ac.id_map;
      acUtils.name_map = ac.name_map;
      acUtils.airportList = ac.airportList;
//      console.log(window.$acUtils);
      return $.Deferred().resolve();
    }

    }

    function fill(response){
      var airs = response.airports;

      for(var i = 0; i < airs.length ; i++){
        var nombre = airs[i].description;
        var cityID = airs[i].id;
        var disp = cityID + " - " + nombre;
        airports.push({value: disp, label: disp}); 
        idMap[disp] = cityID;
        nameMap[cityID] = disp;
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

      localStorage.setItem('acUtils', JSON.stringify(acUtils));
      console.log("wacho")
      console.log(localStorage.acUtils);

    }
    
    global.$acUtils = acUtils;
    global.$acUtils.load = load;  
})(window);

