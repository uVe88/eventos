// Definir contexto global de aplicación
var appEventos = appEventos || {};

// Definir contexto del módulo de evento
appEventos.eventoModule = {};

appEventos.eventoModule.localizarEvento = function(lat, lon, descripcion){
    var mapa = new google.maps.Map(document.getElementById("mapa"), {
        center: {lat: lat, lng: lon},
        zoom: 12
    });

    var marker = new google.maps.Marker({
        position: {lat: lat, lng: lon},
        map: mapa,
        title: descripcion
    });

    var infowindow = new google.maps.InfoWindow({
        content: descripcion
    });

    marker.addListener('click', function() {
        infowindow.open(mapa, marker);
    });
}