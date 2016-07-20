/**
 * @file Gestionar las funcionalidades asociadas al login
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
 * Contexto del módulo login
 */
appEventos.loginModule = {};

/**
 * Información del usuario conectado
 * @type {object}
 */
appEventos.loginModule.infoUsuario = null;

/**
 * Template de mensaje de error de autenticación
 * @type {string}
 */
appEventos.loginModule.errorLoginTemplate = '<div class="alert alert-danger msg_error_login">' +
                                    'Autentificación fallida' +
                                    '</div>';

/**
 * Hacer login en la aplicación
 * @param  {string} login
 * @param  {boolean} password
 */
appEventos.loginModule.login = function(login, password){
    // Instanciar petición
    var req = new XMLHttpRequest();
    req.open('POST', '/eventos/api/login', true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.onreadystatechange = loginCallback;
    
    // Construir objeto a enviar a servidor
    var data = new Object();
    data.login = login;
    data.password = password;
    
    // Relizar petición
    req.send(JSON.stringify(data));

    // Función que maneja la respuesta del servidor
    function loginCallback(){
        if (req.readyState == 4) { 
            if(req.status == 200){
                appEventos.loginModule.infoUsuario = JSON.parse(req.responseText);
                appEventos.loginModule.renderInfoLogin();
            }
            else if(req.status == 401){
                appEventos.loginModule.renderErrorLogin();
            }
        }
    }

    return false;
}

/**
 * Hacer logout en la aplicación
 */
appEventos.loginModule.logout = function(){
    // Instanciar petición
    var req = new XMLHttpRequest();
    req.open('GET', '/eventos/api/logout', true);
    req.onreadystatechange = logoutCallback;
    
    // Realizar petición
    req.send(null);

    // Función que maneja la respuesta del servidor
    function logoutCallback(){
        if (req.readyState == 4) { 
            if(req.status == 200){
                appEventos.loginModule.infoUsuario = null;
                appEventos.loginModule.renderInfoLogin();
                window.location = "/eventos";
            }
        }
    }
};

/**
 * Comprobar si hay algún usuario logeado
 */
appEventos.loginModule.logeado = function(){
    appEventos.loginModule.getInfoUsuario();
    return appEventos.loginModule.infoUsuario != null;
};

/**
 * Obtiene la información del usuario logeado y la almacena en la propiedad infoUsuario
 */
appEventos.loginModule.getInfoUsuario = function(){
    if (appEventos.loginModule.infoUsuario == null){
        // Instanciar petición
        var req = new XMLHttpRequest();
        req.open('GET', '/eventos/api/usuarioActual', true);
        req.onreadystatechange = getInfoUsuarioCallback;
        
        // Realizar petición
        req.send(null);

        // Función que maneja la respuesta del servidor
        function getInfoUsuarioCallback(){
            if (req.readyState == 4) { 
                if(req.status == 200){
                    appEventos.loginModule.infoUsuario = JSON.parse(req.responseText);
                    appEventos.loginModule.renderInfoLogin();
                }
            }
        }
    }
}

/**
 * Modifica el aspecto de las vistas dependiendo de si el usuario está logeado o no 
 */
appEventos.loginModule.renderInfoLogin = function(){
    var formLoginContainer = document.getElementById("form_login_container");
    var infoUsuarioContainer = document.getElementById("info_usuario");

    if (appEventos.loginModule.logeado()){
        // Ocultar formulario login
        if (formLoginContainer != null){
            formLoginContainer.classList.add("hidden");
        }
        
        // Mostrar info en header
        if (infoUsuarioContainer != null){
            infoUsuarioContainer.classList.remove("hidden");
            var nombreUsuario = document.getElementById("nombre_usuario");
            nombreUsuario.innerHTML = appEventos.loginModule.infoUsuario.nombre;
        }
    }
    else{
        // Mostrar formulario login
        if (formLoginContainer != null){
            formLoginContainer.classList.remove("hidden");
        }
        
        // Ocultar info en header
        if (infoUsuarioContainer != null){
            infoUsuarioContainer.classList.add("hidden");
        }
    }
}

/**
 * Muestra un mensaje de error de autenticación
 */
appEventos.loginModule.renderErrorLogin = function(){
    // Se añade el mensaje al dom
    var formLogin = document.getElementById("form_login");
    if (formLogin != null){
        var mensajes = document.getElementsByClassName("msg_error_login");
        for (i = 0; i < mensajes.length; i++) {
            formLogin.removeChild(mensajes[i]);
        }

        formLogin.innerHTML += appEventos.loginModule.errorLoginTemplate;
    
        // Asignar manejador de evento para detectar el fin de la transición y eliminar el elemento del dom
        mensajes = document.getElementsByClassName("msg_error_login");
        for (i = 0; i < mensajes.length; i++) {
            mensajes[i].addEventListener('transitionend', onTransitionEnd, false);
        }

        // Creamos un temporizador que a los 3 segundos activa la transición
        window.setTimeout(function() {
            var mensajes = document.getElementsByClassName("msg_error_login");
            for (i = 0; i < mensajes.length; i++) {
                mensajes[i].classList.add("end");
            };
            return false;
        }, 3000);
        
        // Método que elimina un mensaje de error del formulario
        function onTransitionEnd() {
            formLogin.removeChild(this);
            return false;
        }
    }

    appEventos.loginModule.handlerLogin();

    return false;
}

/**
 * Realiza las operaciones pertinentes al inicializar el modulo login
 */
appEventos.loginModule.init = function(){
    // Asignar manejador de evento para login
    appEventos.loginModule.handlerLogin();

    // Asignar manejador de evento para logout
    var btLogout = document.getElementById("logout");
    if (btLogout != null){
        btLogout.onclick = function(event){
            event = event || window.event;

            appEventos.loginModule.logout();
        } 
    }

    // Asignar manejadro de evento para el buscador
    var btBuscar = document.getElementById("bt_buscar");
    if (btBuscar != null){
        btBuscar.onclick = function(event){
            event = event || window.event;

            var texto = document.getElementById("txt_buscar").value;
            appEventos.eventoModule.buscar(texto, 1);

            return false;
        }
    }

    // Pedir información de usuario
    appEventos.loginModule.getInfoUsuario();
}

/**
 * Asigna el manejador del evento click sobre el botón de login
 */
appEventos.loginModule.handlerLogin = function(){
    // Asignar manejador de evento para login
    var btLogin = document.getElementById("bt_login");
    if (btLogin != null){
        btLogin.onclick = function(event){
            event = event || window.event;
                
            var login = document.getElementById("txt_login").value;
            var password = document.getElementById("txt_password").value;
            appEventos.loginModule.login(login, password);

            return false;
        }
    }
}

// Iniciar comportamiento javascript
appEventos.loginModule.init();