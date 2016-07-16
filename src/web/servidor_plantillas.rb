# encoding: UTF-8

require 'sinatra/base'
require 'sinatra/mustache'
require 'sinatra/reloader'
require_relative '../services/init_services'
require_relative '../services/evento_service'
require_relative '../services/usuario_service'


include Services

class ServidorPlantillas < Sinatra::Base

  configure do
    puts "Configurando servidor de plantillas..."

    #Usar .html como extensión para las plantillas de Mustache
    Tilt.register Tilt::MustacheTemplate, 'html'
    #las plantillas las ponemos en 'public' junto con los html,js,css,...
    set :views, settings.root + '/public'
  
    puts 'Inicializando servicios...'
    Services::init_services
  end

  configure :development do
    register Sinatra::Reloader
  end

  get '' do
    redirect '/eventos/'
  end


  get '/' do
    eService = Services::EventoService.new
    @eventos = eService.listar_populares 3
    mustache :index
  end

  get '/obtenerEvento' do
    eService = Services::EventoService.new
    id = params[:id]
    if (id.nil?)
      status 400
      headers 'Content-type' => 'text/plain'
      "Error: falta el parámetro 'id'"
    else
      @evento = eService.obtener id
      mustache :evento
    end
  end

  get '/iniciarRegistro' do
    @errores = {:dummy=>'dummy'}
    mustache :registro
  end

  post '/registrarUsuario' do
    uService = Services::UsuarioService.new
    @errores = uService.registrar params
    #juntar los mensajes del mismo campo, si hay varios
    @errores.each{|key, value| @errores[key] = value.join(', ')}
    puts "Errores de formulario: #{@errores}"
    if @errores.empty?
      @registrado = uService.obtener params[:login]
      mustache :registro_ok
    else
      mustache :registro
    end
  end

  get '/movil' do
    mustache :index_m
  end
end
