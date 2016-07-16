#encoding:utf-8

require 'sinatra/base'
require 'sinatra/reloader'
require_relative '../services/init_services'
require_relative '../services/evento_service'
require_relative '../services/usuario_service'
require 'json'

include Services


class ServidorAPI < Sinatra::Base
  use Rack::Session::Pool

  configure do
    puts "Configurando servidor de API..."

    puts 'Inicializando servicios...'
    Services::init_services
  end

  configure :development do
    register Sinatra::Reloader
  end


  get '/' do
    'Hola soy el API'
  end

  post '/login' do
    payload = request.body.read
    obj = JSON.parse payload
    uService = Services::UsuarioService.new
    usuario = uService.login obj["login"], obj["password"]
    if (usuario.nil?)
      status 401
      'login y/o password incorrectos'
    else
      status 200
      session[:usuario] = obj["login"]
      usuario.to_json(:except=>[:password])
    end
  end

  get '/logout' do
    session.clear
    'logout'
  end

  get '/usuarioActual' do
    if (!session[:usuario].nil?)
      uService = Services::UsuarioService.new
      usuario = uService.obtener session[:usuario]
      status 200
      usuario.to_json(:except=>[:password])
    else
      status 404
      'Error'
    end
  end


  get '/eventos/buscar' do
    eService = Services::EventoService.new
    lista = eService.buscar params[:texto], params[:limite], params[:offset]
    status 200
    lista.to_json
  end

  post '/eventos' do
    if (session[:usuario].nil?)
      status 403
    else
      obj = JSON.parse(request.body.read)
      uService = Services::UsuarioService.new
      usuario = uService.obtener session[:usuario]
      eService = Services::EventoService.new
      #convertimos las claves, que son cadenas, a símbolos, es lo que espera el EventoService
      obj_sym = Hash.new
      obj.each { |k, v| obj_sym[k.to_sym] = v }
      res = eService.crear obj_sym, usuario
      if res.is_a? Evento
        status 201
      else
        status 400
      end
      res.to_json
    end
  end

  get '/eventos/populares' do
    eService = Services::EventoService.new
    eventos = eService.listar_populares(3)
    eventos.to_json
  end

  get '/eventos/:id' do
    eService = Services::EventoService.new
    evento = eService.obtener(params[:id].to_i)
    if evento.nil?
      status 404
      "El evento con id #{params[:id]} no existe"
    else
      evento.to_json
    end
  end

  post '/usuarioActual/suscripciones' do
    begin
      if (session[:usuario].nil?)
        status 403
      else
        eService = Services::EventoService.new
        eService.suscribir params[:id_evento], session[:usuario]
        status 201
        "Usuario #{session[:usuario]} suscrito al evento #{params[:id_evento]}"
      end
    rescue RuntimeError => error
        status 400
        error.message
    end
  end

  delete '/usuarioActual/suscripciones' do
    begin
      if (session[:usuario].nil?)
        status 403
      else
        eService = Services::EventoService.new
        eService.desuscribir params[:id_evento], session[:usuario]
        status 200
        "Eliminada suscripción del usuario #{session[:usuario]} al evento #{params[:id_evento]}"
      end
    rescue RuntimeError => error
      status 400
      error.message
    end

  end

  get '/usuarioActual/suscrito_a' do
    if (session[:usuario].nil?)
      status 403
    else
      u_service = Services::UsuarioService.new
      id_evento = params[:id_evento].to_i
      if u_service.comprobar_suscripcion(session[:usuario], id_evento)
        'si'
      else
        'no'
      end
    end
  end

  MAX_COMENT_FEED = 10
  get '/usuarioActual/feed' do
    if (session[:usuario].nil?)
      status 403
    else
      uService = Services::UsuarioService.new
      if params[:max_coment].nil?
        max_coment = MAX_COMENT_FEED
      else
        max_coment = params[:max_coment].to_i
      end
      uService.get_feed(session[:usuario], max_coment).to_json
    end
  end

  post '/eventos/:id/comentarios' do
    if (session[:usuario].nil?)
      status 403
    else
      e_service = Services::EventoService.new
      id_evento = params[:id].to_i
      new_coment = e_service.enviar_comentario(id_evento, session[:usuario], params[:texto])
      new_coment.to_json
    end
  end

end

