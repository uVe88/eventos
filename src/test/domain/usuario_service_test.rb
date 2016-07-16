#!/bin/env ruby
# encoding: utf-8
require 'sequel'
require_relative 'sequel_test_case'
require 'minitest/autorun'
require './services/init_services'
require './services/usuario_service'
require 'date'

include Services


class UsuarioServiceTest < SequelTestCase
  def setup
    @db = Services::init_services 'sqlite://test/eventos-test.sqlite'
    @uService = Services::UsuarioService.new
  end


  def test_registrar_usuario_ok
    datos = {:login=>'tw2', :password=>'twtwtw', :password2=>'twtwtw', :nombre=>'tw',
             :apellidos => 'Apellido1 Apellido2', :email=>'tw@ua.es', :fecha_nacimiento=>'1990-1-1'}
    errores = @uService.registrar datos
    assert_empty errores
    #comprobar que el usuario se ha registrado en la BD
    assert_equal 'tw2', Usuario['tw2'].login
  end

  def test_registrar_usuario_fail
    datos = {:password=>'tw', :password2=>'tw2'}
    errores = @uService.registrar datos
    assert_equal 6, errores.size
    assert_equal 2, errores[:email].size #formato incorrecto, dato requerido
    assert_equal 2, errores[:password].size #contraseña demasiado corta, las contraseñas no coinciden
  end

  def test_login_usuario_ok
    usuario = @uService.login 'tw', 'tw'
    refute_nil usuario
    assert_equal 'tw', usuario.login
  end

  def test_login_usuario_fail
    usuario = @uService.login 'tw', 'tw2'
    assert_nil usuario
    usuario = @uService.login nil, nil
    assert_nil usuario
  end

  def test_get_feed
    feed = @uService.get_feed 'tw', 10
    assert_equal 5, feed.size
    assert_equal 5, feed[0].id
    feed = @uService.get_feed 'tw', 3
    assert_equal 3, feed.size
  end

end
