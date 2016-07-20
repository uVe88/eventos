/**
 * @file Gestionar las funcionalidades asociadas a la parte movil
 * 
 * @version 1.0
 * 
 * @author Iván Gómez Gutiérrez
 */

/**
 * Contexto global de la aplicación
 */
var appEventos = appEventos || {};

/**
 * Contexto del módulo para dispositivos moviles
 */
appEventos.movilModule = {};

/**
 * Cargar listado de eventos populares
 */
appEventos.movilModule.eventos_populares = function(){
	$.when( apireader("/eventos/api/eventos/populares") ).then(
		function( data ) {
			// Origen y destino de datos
			var arr_from_data = JSON.parse( data );
			
			// Crear el listview en el dom
			$( "#vista_populares .ui-content" ).listview({
			  create: function( event, ui ) {}
			});
		
			// Renderizado
			var html = '';
			for (var i = 0; i < arr_from_data.length; i++) {
				html += '<li><a href="javascript:appEventos.movilModule.detalle_evento('+arr_from_data[i].id+')">';
				html += '<img src="img/eventos/'+arr_from_data[i].id+'.jpg">';
				html += '<h2>'+arr_from_data[i].titulo+'</h2>';
				html += '</li>';
			}
			// Asignar el contenido al listviewe
			$( "#vista_populares .ui-content" ).html(html);
			
			// refrescar el listview
			$( "#vista_populares .ui-content" ).listview( "refresh" );

			appEventos.movilModule.prepararEventosPopulares();		
		}
	);
};

/**
 * Cargar el detalle de un evento
 * @param (number) id_evento
 */
appEventos.movilModule.detalle_evento = function(id_evento){
	appEventos.eventoModule.idEventoActual = id_evento;

	$.when( apireader("/eventos/api/eventos/"+id_evento) ).then(
		function( data ) {
			// Origen y destino de datos
			var arr_from_data = JSON.parse( data );

			$("#img_evento").attr("src", "img/eventos/" + arr_from_data.id + "_g.jpg");
			$("#txt_descripcion").val(arr_from_data.descripcion);
			$("#txt_direccion").val(arr_from_data.lugar + ": " + (arr_from_data.direccion != null ? arr_from_data.direccion + ", " : " ")  + arr_from_data.poblacion);
			$("#txt_fecha").val(arr_from_data.fecha_cad + " " + arr_from_data.hora_cad);
			$("#txt_visitas").val(arr_from_data.visitas);
			
			var elementoEntradas = $(".alert").remove();
			if(arr_from_data.entradas_agotadas){
				elementoEntradas = $('<div class="alert alert-danger" role="alert">Entradas agotadas</div>');
			}
			else{
				elementoEntradas = $('<div class="alert alert-info" role="alert">Quedan ' + arr_from_data.entradas_disponibles + ' entradas</div>');
			}
			elementoEntradas.insertAfter("#txt_fecha");

			// Renderizado del footer
			var footer = '<div data-id="mainTab" data-role="navbar"><ul id="footer_tabs">';
			footer += '	<li><a href="#vista_populares" data-transition="slide">Volver</a></li>';
			if(arr_from_data.geolocalizado == true){
				footer += '<li><a href="javascript:appEventos.movilModule.mapa_evento('+arr_from_data.id+')" data-transition="slide">Mapa de evento</a></li>';
			}
			
			var logeado = appEventos.loginModule.logeado();
			
			if (logeado){
				var promise = appEventos.eventoModule.estaSuscrito();
				promise.done(function(suscrito){
					appEventos.movilModule.prepararEventoDetalle(suscrito);
				});
			}

			footer += '	<li><a id="bt_eliminar_suscripcion_movil" class="hidden" href="javascript:appEventos.movilModule.eliminar_suscripcion('+arr_from_data.id+')" data-transition="slide">Eliminar suscripción</a>';
			footer += '<a id="bt_suscribir_movil" class="hidden" href="javascript:appEventos.movilModule.suscribir('+arr_from_data.id+')" data-transition="slide">Suscribir</a></li>';
			footer += '</ul></div>';
		
			// Asignar el contenido al footer
			$('#vista_detalles [data-role="footer"]').html(footer).trigger('create');			
			
			$.mobile.pageContainer.pagecontainer("change", "#vista_detalles");

		}
	);
};

/**
 * Localiza un evento en el mapa
 * @param (number) id_evento
 */
appEventos.movilModule.mapa_evento = function(id_evento){
	$.when( apireader("/eventos/api/eventos/"+id_evento) ).then(
		function( data ) {
			// Origen y destino de datos
			var evento = JSON.parse( data );

			// Cargar el mapa
			var mapa = null;
			var marker = null;
			var infowindow = null;

			// NOTA: se realizan esperas de unos cuantos milisegundos porque se ha detectado un bug al cargar un mapa de google maps con jquery mobile
			// En el siguiente ejemplo de la web oficial de jquery mobile tampoco funciona (http://demos.jquerymobile.com/1.4.0/map-geolocation/#map-page)
			setTimeout(function(){
				mapa = new google.maps.Map(document.getElementById("mapa_movil"), {
					center: {lat: evento.lat, lng: evento.lon},
					zoom: 12
				});
			}, 500);
			
			setTimeout(function(){
				// Añadir chincheta
				marker = new google.maps.Marker({
					position: {lat: evento.lat, lng: evento.lon},
					map: mapa,
					title: evento.descripcion
				});
			}, 500);

			setTimeout(function(){
				// Instanciar un caja de información del evento
				infowindow = new google.maps.InfoWindow({
					content: evento.descripcion
				});
			}, 500);
			
			setTimeout(function(){
				// Asignar manejador de evento click sobre la chincheta para que se muestre la información del evento
				marker.addListener('click', function() {
					infowindow.open(mapa, marker);
				});
			}, 500);

			$.mobile.pageContainer.pagecontainer("change", "#vista_mapamovil");
		}
	);
};

/**
 * Suscribir al usuario actual a un evento
 * @param (number) id_evento
 */
appEventos.movilModule.suscribir = function(id_evento){
	var id_evento = appEventos.eventoModule.idEventoActual;
	var login_usuario = appEventos.loginModule.infoUsuario.login;
	var promise = appEventos.eventoModule.suscribir(id_evento, login_usuario);
	promise.done(function(suscrito){
		appEventos.movilModule.prepararEventoDetalle(suscrito);
	});
};

/**
 * Eliminar suscripción del usuario actual a un evento
 * @param (number) id_evento
 */
appEventos.movilModule.eliminar_suscripcion = function(id_evento){
	var id_evento = appEventos.eventoModule.idEventoActual;
	var login_usuario = appEventos.loginModule.infoUsuario.login;
	var promise = appEventos.eventoModule.desuscribir(id_evento, login_usuario);
	promise.done(function(suscrito){
		appEventos.movilModule.prepararEventoDetalle(suscrito);
	});
};

/**
 * Realizar modificaciones de la vista para eventos populares
 */
appEventos.movilModule.prepararEventosPopulares = function(){
	var btLoginElement = $("#bt_ir_login");
	var btLogoutElement = $("#bt_logout_movil");

	var promise = appEventos.loginModule.logeadoAsync();
	promise.done(function(logeado){
		if (logeado){
			btLoginElement.addClass("hidden");
			btLogoutElement.removeClass("hidden");
		}
		else{	
			btLogoutElement.addClass("hidden");
			btLoginElement.removeClass("hidden");
		}
	});
}

/**
 * Realizar modificaciones de la vista para evento detalle
 */
appEventos.movilModule.prepararEventoDetalle = function(suscrito){
	var btSuscribir = $("#bt_suscribir_movil");
	var btEliminarSuscripcion = $("#bt_eliminar_suscripcion_movil");
	btSuscribir.addClass("hidden");
	btEliminarSuscripcion.addClass("hidden");
	
	if (appEventos.loginModule.logeado()){
		
		if (suscrito){
			btSuscribir.addClass("hidden");
			btEliminarSuscripcion.removeClass("hidden");
		}
		else{
			btEliminarSuscripcion.addClass("hidden");
			btSuscribir.removeClass("hidden");
		}
	}
}

/**
 * Funcion de inicialización de la vista movil
 */
appEventos.movilModule.init = function(){
	appEventos.movilModule.eventos_populares();

	// Secuencia de ejecución antes de mostrar vista eventos populares
	$(document).on("pagebeforeshow", "#vista_populares", function(event){
		appEventos.movilModule.prepararEventosPopulares();
	});

	// Secuencia de ejecución antes de mostrar vista detalle de evento
	$(document).on("pagebeforeshow", "#vista_feed", function(event){
		var promise = appEventos.eventoModule.obtenerFeed();
		promise.done(function(eventos){
			// Crear listview
			$("#feed_movil_container").listview({
			  create: function( event, ui ) {}
			});

			// Renderizar eventos
			var container = $("#feed_movil_container");
			container.html("");
			container.append('<ul data-role="listview" data-inset="true" data-divider-theme="a">');
			
			$.each(eventos, function(index, evento){
				// Pintar cabecera de evento
				var elementDivider = $('<li data-role="list-divider">' + evento.titulo + '</li>');
				elementDivider.appendTo(container);
				//$("#feed_container").append(elementDivider);

				// Pintar comentarios
				$.each(evento.comentarios, function(index, comentario){
					var element = $('<li>' + comentario.fecha_hora + ' ' + comentario.usuario_login + ': ' + comentario.texto + '</li>');
					element.appendTo(container);
				});
			});

			container.append('</ul>');
			
			// Refrescar listview
			$("#feed_movil_container").listview( "refresh" );
		});
	});

	// Secuencia de ejecución antes de mostrar vista login
	$(document).on("pagebeforeshow", "#vista_login", function(event){
		var login = localStorage.getItem("tw.eventos.login");
		var password = localStorage.getItem("tw.eventos.password");
		if ((login) && (password)){
			$("#txt_usuario_movil").val(login);
			$("#txt_password_movil").val(password);
			$("#recordar").val('2');
			$("#recordar").slider('refresh');
		}
	});

	// Asignar manejador de evento del boton login
	$("#bt_login_movil").click(function(){
		var login = $("#txt_usuario_movil").val();
		var password = $("#txt_password_movil").val();
		var promise = appEventos.loginModule.login(login, password);
		var recordarValue = $("#recordar").val();
		if (recordarValue === "2"){
			localStorage.setItem("tw.eventos.login", login);
			localStorage.setItem("tw.eventos.password", password);
		}
		else{
			localStorage.setItem("tw.eventos.login", null);
			localStorage.setItem("tw.eventos.password", null);
		}
		promise.done(function(){
			// Redirigir a vista feed
			$.mobile.pageContainer.pagecontainer("change", "#vista_feed");
		});
		return false;
	});


	$("#bt_logout_movil").click(function(){
		var promise = appEventos.loginModule.logout();
		promise.done(function(){
			// Recargar pagina
			appEventos.movilModule.prepararEventosPopulares();
		});
		return false;
	});
}

/**
 * Inicializamos la vista movil
 */
appEventos.movilModule.init();
