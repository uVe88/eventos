var apireader = function(path){
	var retorno = jQuery.Deferred();

	$.get( path, function( data ) {
	  retorno.resolve(data);
	});
	
	return retorno;
};

