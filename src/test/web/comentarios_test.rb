#!/bin/env ruby
# encoding: utf-8
ENV['RACK_ENV'] = 'test'

require './web/servidor_api'
require_relative '../domain/sequel_test_case'
require 'minitest/autorun'
require 'rack/test'
require 'json'

class APIComentariosTest < SequelTestCase
  include Rack::Test::Methods

  def app
    ServidorAPI
  end

  def test_get_feed
    get '/usuarioActual/feed', '', 'rack.session'=>{:usuario=>'pepa'}
    assert 200, last_response.status
    feed = JSON.parse last_response.body
    assert_equal 6, feed.size
  end

  def test_get_feed_limit
    get '/usuarioActual/feed', {:max_coment=>3}, 'rack.session'=>{:usuario=>'pepa'}
    assert 200, last_response.status
    feed = JSON.parse last_response.body
    assert_equal 3, feed.size
  end


  def test_get_feed_fail_not_logged
    get '/usuarioActual/feed', ''
    assert 403, last_response.status
  end

  def test_enviar_comentario_ok
    post '/eventos/1/comentarios', {:texto=>'hola'}, 'rack.session'=>{:usuario=>'tw'}
    assert 200, last_response.status
    coment = JSON.parse last_response.body
    assert_equal 'hola', coment['texto']
  end
end