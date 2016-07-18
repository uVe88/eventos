
// Definir contexto global de aplicación
var appEventos = appEventos || {};

// Definir contexto del módulo de login
//var appEventos.loginModule = appEventos.appEventos.loginModule || {};
appEventos.loginModule = {};

appEventos.loginModule.infoUsuario = null;

appEventos.loginModule.errorLoginTemplate = '<div class="alert alert-danger msg_error_login">' +
                                    'Autentificación fallida' +
                                    '</div>';

// Funcion para hacer login en la aplicación
appEventos.loginModule.login = function(event){
    event = event || window.event;

    // Instanciar petición
    var req = new XMLHttpRequest();
    req.open('POST', 'api/login', true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.onreadystatechange = loginCallback;
    
    // Obtener datos del formulario
    var login = document.getElementById("login").value;
    var password = document.getElementById("password").value;

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
                // Se añade el mensaje al dom
                var formLogin = document.getElementById("form_login");
                formLogin.innerHTML += appEventos.loginModule.errorLoginTemplate;
                
                // Asignar manejador de evento para detectar el fin de la transición y eliminar el elemento del dom
                var mensajes = document.getElementsByClassName("msg_error_login");
                for (i = 0; i < mensajes.length; i++) {
                    mensajes[i].addEventListener('transitionend', onTransitionEnd, false);
                }

                // Creamos un temporizador que a los 3 segundos activa la transición
                window.setTimeout(function() {
                    var mensajes = document.getElementsByClassName("msg_error_login");
                    for (i = 0; i < mensajes.length; i++) {
                        mensajes[i].classList.add("end");
                    }
                }, 3000);
                
                // Método que elimina un mensaje de error del formulario
                function onTransitionEnd() {
                    formLogin.removeChild(this);
                }
            }
        }
    }

    return false;
}

appEventos.loginModule.logout = function(){
    // Instanciar petición
    var req = new XMLHttpRequest();
    req.open('GET', 'api/logout', true);
    req.onreadystatechange = logoutCallback;
    
    // Realizar petición
    req.send(null);

    // Función que maneja la respuesta del servidor
    function logoutCallback(){
        if (req.readyState == 4) { 
            if(req.status == 200){
                appEventos.loginModule.infoUsuario = null;
                appEventos.loginModule.renderInfoLogin();
            }
        }
    }
};

appEventos.loginModule.logeado = function(){
    appEventos.loginModule.getInfoUsuario();
    return appEventos.loginModule.infoUsuario != null;
};

appEventos.loginModule.getInfoUsuario = function(){
    if (appEventos.loginModule.infoUsuario == null){
        // Instanciar petición
        var req = new XMLHttpRequest();
        req.open('GET', 'api/usuarioActual', true);
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

appEventos.loginModule.renderInfoLogin = function(){
    var formLoginContainer = document.getElementById("form_login_container");
    var infoUsuarioContainer = document.getElementById("info_usuario");

    if (appEventos.loginModule.infoUsuario != null){
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

appEventos.loginModule.init = function(){
    // Asignar manejador de evento para login
    var formLogin = document.getElementById("form_login");
    if (formLogin != null){
        formLogin.onsubmit = appEventos.loginModule.login;
    }

    // Asignar manejador de evento para logout
    var btLogout = document.getElementById("logout");
    if (btLogout != null){
        btLogout.onclick = appEventos.loginModule.logout;
    }

    // Pedir información de usuario
    appEventos.loginModule.getInfoUsuario();
}

// Iniciar comportamiento javascript
appEventos.loginModule.init();