(function(){

	ciudades = [];
    load();

    function load(){
      $.ajax({
        url: "http://hci.it.itba.edu.ar/v1/api/geo.groovy?method=getcities&callback=listFill",
        datatype: "jsonp"
      });
    }

    function fill(response){
      //var r = [];
      var ct = response.cities;

      for(var i = 0; i < ct.length ; i++){
        var nombre = response.cities[i].name;
        var cityID = response.cities[i].id;
        var disp = cityID + " - " + nombre;
        ciudades.push({value: cityID, label: disp}); 
      }
    }

    window.listFill = fill;

	new Awesomplete(document.getElementById("inputCity"), {
	list: ciudades,
	minChars: 1,
	autoFirst: true}
	);

})();

