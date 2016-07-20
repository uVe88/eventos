var eventos_populares = function(){
	$.when( apireader("/eventos/api/eventos/populares") ).then(
		function( data ) {
			// Origen y destino de datos
			var arr_from_data = JSON.parse( data );
			
			// Crear el listview en el dom
			$( "#populares .ui-content" ).listview({
			  create: function( event, ui ) {}
			});
		
			// Renderizado
			var html = '';
			for (var i = 0; i < arr_from_data.length; i++) {
				html += '<li><a href="javascript:detalle_evento('+arr_from_data[i].id+')">';
				html += '<img src="img/eventos/'+arr_from_data[i].id+'.jpg">';
				html += '<h2>'+arr_from_data[i].titulo+'</h2>';
				html += '</li>';
			}
			// Asignar el contenido al listviewe
			$( "#populares .ui-content" ).html(html);
			
			// refrescar el listview
			$( "#populares .ui-content" ).listview( "refresh" );
			
		},
		function( data ) {
			alert( data + ", you fail this time" );
		}
	);
};

var detalle_evento = function(id_evento){
	$.when( apireader("/eventos/api/eventos/"+id_evento) ).then(
		function( data ) {
			// Origen y destino de datos
			var arr_from_data = JSON.parse( data );

			// Renderizado del contenido
			var html = '';
			html += '<img src="img/eventos/'+arr_from_data.id+'_g.jpg" style="width: 100%;">';
			html += '<h2>'+arr_from_data.titulo+'</h2>';
			html += '<p><b>descripcion</b>: '+arr_from_data.descripcion+'</p>';
			html += '<p><b>descripcion_par</b>: '+arr_from_data.descripcion_par+'</p>';
			html += '<p><b>direccion</b>: '+arr_from_data.direccion+'</p>';
			html += '<p><b>entradas_agotadas</b>: '+arr_from_data.entradas_agotadas+'</p>';
			html += '<p><b>entradas_disponibles</b>: '+arr_from_data.entradas_disponibles+'</p>';
			html += '<p><b>fecha_cad</b>: '+arr_from_data.fecha_cad+'</p>';
			html += '<p><b>fecha_hora</b>: '+arr_from_data.fecha_hora+'</p>';
			html += '<p><b>geolocalizado</b>: '+arr_from_data.geolocalizado+'</p>';
			html += '<p><b>hora_cad</b>: '+arr_from_data.hora_cad+'</p>';
			html += '<p><b>id</b>: '+arr_from_data.id+'</p>';
			html += '<p><b>lat</b>: '+arr_from_data.lat+'</p>';
			html += '<p><b>lon</b>: '+arr_from_data.lon+'</p>';
			html += '<p><b>lugar</b>: '+arr_from_data.lugar+'</p>';
			html += '<p><b>poblacion</b>: '+arr_from_data.poblacion+'</p>';
			html += '<p><b>resumen</b>: '+arr_from_data.resumen+'</p>';
			html += '<p><b>usuario_login</b>: '+arr_from_data.usuario_login+'</p>';
			html += '<p><b>visitas</b>: '+arr_from_data.visitas+'</p>';

			// Asignar el contenido al contenido
			$( "#detalles .ui-content" ).html(html);

			// Renderizado del footer
			var footer = '<div data-id="mainTab" data-role="navbar"><ul id="footer_tabs">';
			footer += '	<li><a href="#populares" data-transition="slide">Volver</a></li>';
			if(arr_from_data.geolocalizado == true){
				footer += '<li><a href="javascript:mapa_evento('+arr_from_data.id+')" data-transition="slide">Mapa de evento</a></li>';
			}
			footer += '	<li><a href="javascript:suscribir('+arr_from_data.id+')" data-transition="slide">Suscribir</a></li>';
			footer += '	<li><a href="javascript:eliminar_suscripcion('+arr_from_data.id+')" data-transition="slide">Eliminar suscripción</a></li>';
			footer += '</ul></div>';
		
			// Asignar el contenido al footer
			$('#detalles [data-role="footer"]').html(footer).trigger('create');			
			
			$.mobile.pageContainer.pagecontainer("change", "#detalles");

		},
		function( data ) {
			alert( data + ", you fail this time" );
		}
	);
};

var mapa_evento = function(id_evento){
	$.when( apireader("/eventos/api/eventos/"+id_evento) ).then(
		function( data ) {
			// Origen y destino de datos
			var arr_from_data = JSON.parse( data );

			// Renderizado
			var html = '';
			html += '<div id="mapa" style="width: 100%; height: 500px;"></div>';	
			
			// Asignar el contenido al listviewe
			$( "#mapamovil .ui-content" ).html(html);
			
			// Renderizado del footer
			var footer = '<div data-id="mainTab" data-role="navbar"><ul id="footer_tabs">';
			footer += '	<li><a href="#detalles" data-transition="slide">Volver</a></li>';
			footer += '</ul></div>';
		
			// Asignar el contenido al footer
			$('#mapamovil [data-role="footer"]').html(footer).trigger('create');		
			
			$.mobile.pageContainer.pagecontainer("change", "#mapamovil");
			
			// Cargar el mapa
			appEventos.eventoModule.localizarEvento(arr_from_data.lat, arr_from_data.lon, arr_from_data.titulo);
		},
		function( data ) {
			alert( data + ", you fail this time" );
		}
	);
};

var suscribir = function(id_evento){

};

var eliminar_suscripcion = function(id_evento){

};

// ************************************************************************
// Seccion por defecto a cargar
// ************************************************************************

eventos_populares();
