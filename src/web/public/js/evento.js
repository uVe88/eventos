// Definir contexto global de aplicación
var appEventos = appEventos || {};

// Definir contexto del módulo de evento
appEventos.eventoModule = {};

// Propiedad que define el número de elementos a mostrar en una página de resultado de eventos
appEventos.eventoModule.pageSize = 4;

// Template para renderizar un evento
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

// Template a renderizar si se han agotado las entradas del evento
appEventos.eventoModule.eventoEntradasAgotadasTemplate = '<div class="col-md-10">' +
                                                         '  <div class="alert alert-danger" role="alert">' +
                                                         '    <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
                                                         '    <span class="sr-only">Error:</span>' +
                                                         '    ¡Entradas agotadas!' +
                                                         '  </div>' +
                                                         '</div>';



// Método para buscar eventos en el servidor
appEventos.eventoModule.buscar = function(texto, pagina){
    // Asignar parametros de búsqueda
    var parameters = "?texto=" + texto + "&limite=" + appEventos.eventoModule.pageSize + "&offset=" + appEventos.eventoModule.pageSize * (pagina - 1);

    // Instanciar petición
    var req = new XMLHttpRequest();
    req.open('GET', 'api/eventos/buscar' + parameters, true);
    req.onreadystatechange = buscarCallback;
    
    // Realizar petición
    req.send(null);
    
    // Función que maneja la respuesta del servidor
    function buscarCallback(){
        if (req.readyState == 4) { 
            if(req.status == 200){
                // Almacenar resultado
                var resultadoBusqueda = JSON.parse(req.responseText);
                var eventos = resultadoBusqueda.resultados;
                var total = resultadoBusqueda.total;

                var totalPaginas = Math.floor(total / appEventos.eventoModule.pageSize);
                if ((total % appEventos.eventoModule.pageSize) > 0){
                    totalPaginas += 1;
                }

                var html = "";

                // Construir elementos evento
                for (i = 0; i < eventos.length; i++) {
                    var htmlEvento = appEventos.eventoModule.eventoTemplate;
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
        }
    }

    return false;
}

// Método para localizar un evento en el mapa
appEventos.eventoModule.localizarEvento = function(lat, lon, descripcion){
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