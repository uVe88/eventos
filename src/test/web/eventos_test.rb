#!/bin/env ruby
# encoding: utf-8
ENV['RACK_ENV'] = 'test'

require './web/servidor_api'
require_relative '../domain/sequel_test_case'
require 'minitest/autorun'
require 'rack/test'
require 'json'

class APIEventosTest < SequelTestCase
  include Rack::Test::Methods

  def app
    ServidorAPI
  end

  def test_hola
    get '/'
    assert_equal 'Hola soy el API', last_response.body
  end


  def test_buscar
    get '/eventos/buscar', {:texto=>"esta es la descripción "}
    lista = JSON.parse last_response.body
    assert_equal 50, lista["total"]
  end

  def test_buscar_no_results
    get '/eventos/buscar', {:texto=>"jajaja"}
    lista = JSON.parse last_response.body
    assert_equal 0, lista["total"]
  end

  def test_buscar_paginado
    get '/eventos/buscar', {:texto=>"esta es la descripción ", :limite=>10, :offset=>1}
    lista = JSON.parse last_response.body
    assert_equal 50, lista['total']
    assert_equal 10, lista['resultados'].size
    assert_equal 'Evento 6', lista['resultados'][0]['titulo']  #por el offset 1
  end


  def test_crear
    post '/eventos', {:titulo=>'prueba', :descripcion=>'d', :lugar=>'l',
                      :direccion=>'d', :poblacion=>'p', :fecha_hora=>'2014-1-1 10:00'}.to_json,
         'rack.session'=>{:usuario=>'tw'}
    nuevo = JSON.parse last_response.body
    assert_equal 201, last_response.status
    assert_equal 'prueba', nuevo["titulo"]
    assert_equal 'tw', nuevo["usuario_login"]
  end

  def test_populares
    get '/eventos/populares'
    eventos = JSON.parse last_response.body
    assert_equal 3, eventos.size
    assert_equal 1, eventos[0]['id']
  end

  def test_get_evento
    get '/eventos/1'
    assert_equal 200, last_response.status
    evento = JSON.parse(last_response.body)
    assert_equal 'Manel en concierto', evento['titulo']
  end
end