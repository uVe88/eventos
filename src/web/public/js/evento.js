/**
 * @file Gestionar las funcionalidades asociadas a los eventos
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
 * Contexto del módulo evento
 */
appEventos.eventoModule = {};

/**
 * número de elementos a mostrar en una página de resultado de eventos
 * @type {number}
 */ 
appEventos.eventoModule.pageSize = 5;

/**
 * evento seleccionado
 * @type {number}
 */
appEventos.eventoModule.idEventoActual = null;

/**
 * indica si el usuario está suscrito al evento actual o no
 * @type {bool}
 */
appEventos.eventoModule.suscrito = false;

/**
 * Template para renderizar un evento
 * @type {string}
 */
appEventos.eventoModule.eventoTemplate = '<div class="row well">' +
                                         '   <div class="col-md-12">' +
                                         '       <h2>{{titulo}}</h2>' +
                                         '       <p>{{resumen}}</p>' +
                                         '       <p>' +
                                         '           <span class="label label-info">{{poblacion}}</span>' +
                                         '           <span class="label label-info">{{fecha_cad}} {{hora_cad}}</span>' +
                                         '       </p>' +
                                         '       <div class="row">' +
                                         '           {{entradas_agotadas}}' +
                                         '           <div class="col-md-2">' +
                                         '               <a href="obtenerEvento?id={{id}}">' +
                                         '                   <button type="submit" class="btn btn-primary btn-lg">Ver detalles</button>' +
                                         '               </a>' +
                                         '           </div>' +
                                         '       </div>' +
                                         '   </div>' +
                                         '</div>';

/**
 * Template de mensaje de entradas agotadas
 * @type {string}
 */
appEventos.eventoModule.eventoEntradasAgotadasTemplate = '<div class="col-md-10">' +
                                                         '  <div class="alert alert-danger" role="alert">' +
                                                         '    <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
                                                         '    <span class="sr-only">Error:</span>' +
                                                         '    ¡Entradas agotadas!' +
                                                         '  </div>' +
                                                         '</div>';

/**
 * Template para suscribirse a evento
 * @type {string}
 */
appEventos.eventoModule.suscribirEventoTemplate = '<button type="button" id="bt_suscribir" class="btn btn-success btn-xs pull-right suscripcion">Suscribir</button>';

/**
 * Template para eliminar suscripción a evento
 * @type {string}
 */
appEventos.eventoModule.eliminarSuscripcionTemplate = '<button type="button" id="bt_eliminar_suscripcion" class="btn btn-danger btn-xs pull-right suscripcion">Eliminar suscripción</button>';

/**
 * Template para mensaje de error en suscripcion
 * @type {string}
 */
appEventos.eventoModule.errorSuscripcionTemplate = '<div class="alert msg_suscripcion"></div>';

appEventos.eventoModule.feedTemplate = '<div class="media">' +
                                       '    <div class="media-body">' +
                                       '        <h4 class="media-heading"> - <small></small></h4>' +
                                       '    </div>' +
                                       '</div>';

/**
 * Buscar eventos en servidor
 * @param  {string} texto
 * @param  {number} pagina
 */
appEventos.eventoModule.buscar = function(texto, pagina){
    // Asignar parametros de búsqueda
    var parameters = "?texto=" + texto + "&limite=" + appEventos.eventoModule.pageSize + "&offset=" + appEventos.eventoModule.pageSize * (pagina - 1);

    // Instanciar petición
    var req = new XMLHttpRequest();
    req.open('GET', '/eventos/api/eventos/buscar' + parameters, true);
    req.onreadystatechange = buscarCallback;
    
    // Realizar petición
    req.send(null);
    
    // Función que maneja la respuesta del servidor
    function buscarCallback(){
        if (req.readyState == 4) { 
            if(req.status == 200){
                var resultadoBusqueda = JSON.parse(req.responseText);
                var eventos = resultadoBusqueda.resultados;
                var total = resultadoBusqueda.total;
                
                appEventos.eventoModule.renderizarResultadoBusqueda(total, eventos, texto, pagina);
            }
        }
    }

    return false;
}

/**
 * Muestra los eventos en la vista
 * @param  {number} total
 * @param  {array} eventos
 * @param  {string} texto
 * @param  {number} pagina
 */
appEventos.eventoModule.renderizarResultadoBusqueda = function(total, eventos, texto, pagina){
    var totalPaginas = Math.floor(total / appEventos.eventoModule.pageSize);
    if ((total % appEventos.eventoModule.pageSize) > 0){
        totalPaginas += 1;
    }

    var html = "";

    // Construir elementos evento
    for (i = 0; i < eventos.length; i++) {
        var htmlEvento = appEventos.eventoModule.eventoTemplate;
        htmlEvento = htmlEvento.toString().replace("{{id}}", eventos[i].id);
        htmlEvento = htmlEvento.toString().replace("{{titulo}}", eventos[i].titulo);
        htmlEvento = htmlEvento.toString().replace("{{resumen}}", eventos[i].resumen);
        htmlEvento = htmlEvento.toString().replace("{{poblacion}}", eventos[i].poblacion);
        htmlEvento = htmlEvento.toString().replace("{{fecha_cad}}", eventos[i].fecha_cad);
        htmlEvento = htmlEvento.toString().replace("{{hora_cad}}", eventos[i].hora_cad);
        if (eventos[i].entradas_agotadas){
            htmlEvento = htmlEvento.toString().replace("{{entradas_agotadas}}", appEventos.eventoModule.eventoEntradasAgotadasTemplate);
        }
        else{
            htmlEvento = htmlEvento.toString().replace("{{entradas_agotadas}}", "");
        }
        html += htmlEvento;
    }
    
    // Construir paginador
    if (eventos.length > 0){
        
        html += '<ul class="pagination">';
        var contadorPaginas = 0;
        var numeroPagina = pagina - 2;
        if (numeroPagina <= 0){
            numeroPagina = pagina - 1;
        }
        if (numeroPagina <= 0){
            numeroPagina = pagina;
        }
        
        if (pagina > 1){
            html += '<li><a href="#" class="item-paginador" data-pagina=1>&laquo;</a></li>';
            html += '<li><a href="#" class="item-paginador" data-pagina=' + (pagina - 1) + '>&lt;</a></li>';
        }
        
        var activado = "";
        while((numeroPagina <= totalPaginas) && (contadorPaginas < 5)){
            if (numeroPagina == pagina){
                activado = ' class="active"';
            }
            else{
                activado  ="";
            }
            html += '<li' + activado + '><a href="#" class="item-paginador" data-pagina=' + numeroPagina + '>' + numeroPagina + ' </a></li>';
            numeroPagina += 1;
            contadorPaginas += 1;
        }

        if(numeroPagina < totalPaginas){
            html += '<li><a href="#" class="item-paginador" data-pagina=' + (pagina + 1) + '>&gt;</a></li>';
            html += '<li><a href="#" class="item-paginador" data-pagina=' + totalPaginas + '>&raquo;</a></li>';
        }
        
        html += '</ul>';
    }
    
    // Escribir html en el dom
    var eventosContainer = document.getElementById("eventos_container");
    eventosContainer.innerHTML = html;

    // Asignar manejadores de eventos del paginador
    var itemsPaginador = document.getElementsByClassName("item-paginador");
    for (i = 0; i < itemsPaginador.length; i++) {
        itemsPaginador[i].onclick = function(){
            var pagina = parseInt(this.dataset.pagina);
            appEventos.eventoModule.buscar(texto, pagina);
            return false;
        }
    }
}

/**
 * Localiza un evento en el mapa
 * @param  {number} lat
 * @param  {number} lon
 * @param  {string} descripcion
 */
appEventos.eventoModule.localizarEvento = function(lat, lon, descripcion){
    if ((lat === null) || (lat === '') || (lon === null) || (lon === '')){
        console.warn("No se puede localizar el evento porque las cooredenadas son incorrectas");
    }
    else{
        // Instanciar mapa
        var mapa = new google.maps.Map(document.getElementById("mapa"), {
            center: {lat: lat, lng: lon},
            zoom: 12
        });

        // Añadir chincheta
        var marker = new google.maps.Marker({
            position: {lat: lat, lng: lon},
            map: mapa,
            title: descripcion
        });

        // Instanciar un caja de información del evento
        var infowindow = new google.maps.InfoWindow({
            content: descripcion
        });

        // Asignar manejador de evento click sobre la chincheta para que se muestre la información del evento
        marker.addListener('click', function() {
            infowindow.open(mapa, marker);
        });
    }
}

/**
 * Comprueba si el usuario está suscrito al evento actual
 */
appEventos.eventoModule.estaSuscrito = function(){
    var parameters = "?id_evento=" + appEventos.eventoModule.idEventoActual;

    $.get('/eventos/api/usuarioActual/suscrito_a' + parameters, function(data, textStatus, req){
        if (data === "si"){
            appEventos.eventoModule.suscrito = true;
        }
        else{
            appEventos.eventoModule.suscrito = false;
        }
        appEventos.eventoModule.renderizarSuscripcion(appEventos.eventoModule.suscrito);
    });
}

/**
 * Crear suscripción a un evento para un usuario
 * @param  {number} id_evento
 * @param  {string} login_usuario
 */
appEventos.eventoModule.suscribir = function(id_evento, login_usuario){
    var parameters = {
        id_evento: id_evento,
        login_usuario: login_usuario
    };
    $.post("/eventos/api/usuarioActual/suscripciones", $.parseJSON(JSON.stringify(parameters)), function(data, textStatux, req){
        appEventos.eventoModule.suscrito = true;
        appEventos.eventoModule.renderizarSuscripcion(true);
        appEventos.eventoModule.renderizarResultadoSuscripcion("Suscripción realizada correctamente", true);
    }).fail(function(){
        appEventos.eventoModule.renderizarResultadoSuscripcion("Se ha producido un error al intentar suscribirse del evento, por favor intentelo de nuevo más tarde.", false);
    });
}

/**
 * Eliminar suscripción de un evento para un usuario
 * @param  {number} id_evento
 * @param  {string} login_usuario
 */
appEventos.eventoModule.desuscribir = function(id_evento, login_usuario){
    var parameters = {
        id_evento: id_evento,
        login_usuario: login_usuario
    };
    var json_data = $.parseJSON(JSON.stringify(parameters));
    $.ajax({
        url: "/eventos/api/usuarioActual/suscripciones",
        type: "DELETE",
        dataType: "json",
        data: json_data,
        success: function(data, textStatux, req){
            appEventos.eventoModule.suscrito = false;
            appEventos.eventoModule.renderizarSuscripcion(false);
        },
        error: function(req, textStatus, errorThrown){
            if (req.status == 200){
                appEventos.eventoModule.suscrito = false;
                appEventos.eventoModule.renderizarSuscripcion(false);
                appEventos.eventoModule.renderizarResultadoSuscripcion("Suscripción eliminada correctamente", true);
            }
            else{
                appEventos.eventoModule.renderizarResultadoSuscripcion("Se ha producido un error al intentar desuscribirse del evento, por favor intentelo de nuevo más tarde.", false);
            }
        }
    });
}

/**
 * Muestra u oculta el botón de suscripción al evento
 * @param  {bool} suscrito
 */
appEventos.eventoModule.renderizarSuscripcion = function(suscrito){
    // Eliminar botones de suscripción
    var infoFechaElement = $("#detalle_info_fecha");
    if (infoFechaElement.length > 0){
        $(".suscripcion").remove();
    }
    
    if (suscrito !== undefined){
        // Añadir boton
        var infoFechaElement = $("#detalle_info_fecha");
        if (infoFechaElement.length > 0){
            var suscripcionElement = "";
            if (suscrito === true){ // Mostrar botón de suscripción
                // Añadir al dom
                suscripcionElement = $(appEventos.eventoModule.eliminarSuscripcionTemplate);
                suscripcionElement.prependTo("#detalle_info_fecha");
                // Asignar manejador de evento
                $(".suscripcion").click(function(event){
                    var id_evento = appEventos.eventoModule.idEventoActual;
                    var login_usuario = appEventos.loginModule.infoUsuario.login;
                    appEventos.eventoModule.desuscribir(id_evento, login_usuario);
                });
            }
            else{ // Mostrar botón eliminar suscripcion
                // Añadir al dom
                suscripcionElement = $(appEventos.eventoModule.suscribirEventoTemplate);
                suscripcionElement.prependTo("#detalle_info_fecha");
                // Asignar manejador de evento
                $(".suscripcion").click(function(event){
                    var id_evento = appEventos.eventoModule.idEventoActual;
                    var login_usuario = appEventos.loginModule.infoUsuario.login;
                    appEventos.eventoModule.suscribir(id_evento, login_usuario);
                });
            }
        }
    }
}

/**
 * Muestra el mensaje de error al intentar suscribirse a un método
 * @param  {string} mensaje
 */
appEventos.eventoModule.renderizarResultadoSuscripcion = function(mensaje, ok){
    // Añadir mensaje al dom
    var mensajeElement = $(appEventos.eventoModule.errorSuscripcionTemplate);
    var clase_css = "alert-danger";
    if (ok){
        clase_css = "alert-success";
    }
    mensajeElement.addClass(clase_css);
    mensajeElement.html(mensaje);
    mensajeElement.appendTo($("body"));
    
    // Activar animación de entrada del elemento
    $(".msg_suscripcion").animate({
        opacity: 1
    }, 1000);

    // Activar animación de salida del elemento
    window.setTimeout(function(){
        $(".msg_suscripcion").animate({
            opacity: 0
        }, 1000).promise().done(function(){
            $(".msg_suscripcion").remove();
        });
    }, 3000);
}

/**
 * Obtener feed del usuario actual
 */
appEventos.eventoModule.obtenerFeed = function(){
    
    $.get('/eventos/api/usuarioActual/feed', function(data, textStatus, req){
        var comentarios = $.parseJSON(data);

        // Obtener los eventos
        var current_id = null;
        var arrayDef = new Array();
        $.each(comentarios, function(index, value){
             if (current_id != value.evento_id){
                 var def = $.Deferred();
                 arrayDef.push(def);
                 current_id = value.evento_id;
                 getEvento(value.evento_id, def);
             }
        });

        // Cuando tengo todos los eventos relleno el titulo en los comentarios
        $.when.apply($,arrayDef).then(function() {
            var eventos=arguments;
            
            $.each(eventos, function(index, evento){
                var comentarios_evento = $.grep(comentarios, function(comentario, index){
                    return  comentario.evento_id == evento.id;
                });
                evento.comentarios = comentarios_evento;
            });
            
            // Renderizar los eventos con comentarios
            var login_usuario_actual = appEventos.loginModule.infoUsuario.login;
            appEventos.eventoModule.renderizarFeed(eventos, login_usuario_actual);
        });
    });

    // Función auxiliar para obtener un evento
    function getEvento(id_evento, def){
        $.get('/eventos/api/eventos/' + id_evento, function(data, textStatus, req){
            var evento = $.parseJSON(data);
            def.resolve(evento);
        });
    }
}

/**
 * Renderizar feed del usuario actual
 * @param  {array} eventos - Eventos que contienen un array de comentarios
 */
appEventos.eventoModule.renderizarFeed = function(eventos, login_usuario_actual){
    var feedContainer = $(".container #feed_container");

    // Limpiar container
    feedContainer.html("");

    $.each(eventos, function(index, evento){
        // Pintar cabecera de evento
        $("#feed_container").append("<h3>" + evento.titulo + "</h3>");

        // Pintar comentarios
        $.each(evento.comentarios, function(index, comentario){
            var element = $(appEventos.eventoModule.feedTemplate);
            element.find(".media-heading").prepend(comentario.usuario_login);
            element.find(".media-heading small").append(comentario.fecha_hora);
            if (login_usuario_actual == comentario.usuario_login){
                element.find(".media-heading").addClass("mi-comentario");
            }
            element.append(comentario.texto);
            element.appendTo(feedContainer);
        });
    });
}

/**
 * Inicializa la vista de detalle de un evento
 * @param  {number} id_event
 * @param  {number} lat
 * @param  {number} lon
 * @param  {number} titulo
 */
appEventos.eventoModule.init = function(id_evento, lat, lon, titulo){
    appEventos.eventoModule.idEventoActual = id_evento;
    appEventos.eventoModule.localizarEvento(lat, lon, titulo);
    appEventos.eventoModule.estaSuscrito();
}