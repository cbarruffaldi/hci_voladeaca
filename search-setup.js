(function(){

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

$("#resultShow").hide();

/*$("#loadingImg").on("click", function(){
	$("#searchResults").show();
	$("#loadingImg").hide();
});
*/

queryData = {}
window.queryData = queryData;

})();