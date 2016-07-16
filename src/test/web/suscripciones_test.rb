#!/bin/env ruby
# encoding: utf-8
ENV['RACK_ENV'] = 'test'

require './web/servidor_api'
require_relative '../domain/sequel_test_case'
require 'minitest/autorun'
require 'rack/test'
require 'json'

class APISuscripcionesTest < SequelTestCase
  include Rack::Test::Methods

  def app
    ServidorAPI
  end

  def test_suscribir_ok
    post '/usuarioActual/suscripciones', {:id_evento=>4}, 'rack.session'=>{:usuario=>'tw'}
    assert_equal 201, last_response.status
  end


  def test_suscribir_fail
    #no logueado
    post '/usuarioActual/suscripciones', {:id_evento=>4}
    assert_equal 403, last_response.status
    #evento no existente
    post '/usuarioActual/suscripciones', {:id_evento=>0}, 'rack.session'=>{:usuario=>'tw'}
    assert_equal 400, last_response.status
    #usuario no existente
    post '/usuarioActual/suscripciones', {:id_evento=>0}, 'rack.session'=>{:usuario=>'twtw'}
    assert_equal 400, last_response.status
    #suscrito dos veces al mismo
    post '/usuarioActual/suscripciones', {:id_evento=>1}, 'rack.session'=>{:usuario=>'tw'}
    assert_equal 400, last_response.status
  end


  def test_desuscribir_ok
    delete '/usuarioActual/suscripciones', {:id_evento=>1}, 'rack.session'=>{:usuario=>'tw'}
    assert_equal 200, last_response.status
  end

  def test_desuscribir_fail
    #evento no existente
    delete '/usuarioActual/suscripciones', {:id_evento=>0}, 'rack.session'=>{:usuario=>'tw'}
    assert_equal 400, last_response.status
    assert_equal 'Evento 0 no encontrado', last_response.body
    #usuario no existente
    delete '/usuarioActual/suscripciones', {:id_evento=>1}, 'rack.session'=>{:usuario=>'twtw'}
    assert_equal 400, last_response.status
    assert_equal 'Usuario twtw no encontrado', last_response.body
    #usuario no suscrito a evento
    delete '/usuarioActual/suscripciones', {:id_evento=>5}, 'rack.session'=>{:usuario=>'tw'}
    assert_equal 400, last_response.status
    refute_nil last_response.body['no está suscrito']
  end

  def test_suscrito_a
    get '/usuarioActual/suscrito_a', {:id_evento=>4}, 'rack.session'=>{:usuario=>'tw'}
    assert_equal 'no', last_response.body
    get '/usuarioActual/suscrito_a', {:id_evento=>1}, 'rack.session'=>{:usuario=>'tw'}
    assert_equal 'si', last_response.body
  end
end