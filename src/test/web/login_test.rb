#!/bin/env ruby
# encoding: utf-8
ENV['RACK_ENV'] = 'test'

require './web/servidor_api'
require 'minitest/autorun'
require 'rack/test'
require 'json'

class APILoginTest < MiniTest::Test
  include Rack::Test::Methods

  def app
    ServidorAPI
  end

  def test_hola
    get '/'
    assert_equal 'Hola soy el API', last_response.body
  end

  def test_login_ok
    #como chequear qué hay en la sesión. Básicamente le pasamos a la petición
    #una variable de tipo hash (vacía) para luego poder ver si se ha modificado
    #de http://stackoverflow.com/questions/4402808/how-to-test-sinatra-app-using-session
    session = {}
    post 'login', {:login=>'tw', :password=>'tw'}.to_json, 'rack.session' => session
    assert last_response.ok?
    usuario = JSON.parse last_response.body
    assert_equal 'tw', usuario['login']
    #assert_equal 'tw', session[:usuario]
  end

  def test_login_fail
    post 'login', {:login=>'', :password=>''}.to_json
    assert_equal 401, last_response.status
  end

  def test_usuario_actual_ok
    get 'usuarioActual', {}, 'rack.session'=>{:usuario=>'tw'}
    assert_equal 200, last_response.status
    obj = JSON.parse last_response.body
    assert_equal 'tw', obj['login']
    assert_equal 'Tecnologías', obj['nombre']
    assert_nil obj['password']
  end

  def test_usuario_actual_fail
    get 'usuarioActual'
    assert_equal 404, last_response.status
  end
end