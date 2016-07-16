#!/bin/env ruby
# encoding: utf-8
ENV['RACK_ENV'] = 'test'

require './web/servidor_plantillas'
require 'minitest/autorun'
require 'rack/test'

class PlantillasTest < MiniTest::Test
  include Rack::Test::Methods

  def app
    ServidorPlantillas
  end

  def test_registro_fail
    #post '/registrarUsuario', {}
  end
end