#!/bin/env ruby
# encoding: utf-8
require 'minitest/autorun'
require './data/init_datalayer'
require 'date'

include DataLayer


class UsuarioTest < MiniTest::Test
  def setup
    DataLayer::init_datalayer 'sqlite://test/eventos-test.sqlite'
  end

  def test_validar_usuario_ok
    usuario = Usuario.new
    usuario.login = 'tw25'
    usuario.password = 'twtwtw'
    usuario.apellidos = 'Prueba Prueba2'
    usuario.nombre = 'tw'
    usuario.email = 'tw@ua.es'
    usuario.fecha_nacimiento = Date.new(1990,2,1)
    usuario.validate
    assert_equal true, usuario.valid?
  end

  def test_validar_usuario_fail
    usuario = Usuario.new
    usuario.login = 'tw'
    assert_equal false, usuario.valid?
    #todos los campos deberían tener error
    assert_equal 6, usuario.errors.size
  end

  def test_suscrito_a
    assert Usuario['tw'].suscrito_a? 1
    refute Usuario['tw'].suscrito_a? 4
    assert Usuario['pepa'].suscrito_a? 4
  end
end
