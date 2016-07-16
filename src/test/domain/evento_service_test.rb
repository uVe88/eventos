#!/bin/env ruby
# encoding: utf-8
require 'sequel'
require_relative 'sequel_test_case'
require 'minitest/autorun'
require './services/init_services'
require './services/usuario_service'
require 'date'

include Services


class EventoServiceTest < SequelTestCase
  def setup
    @db = Services::init_services 'sqlite://test/eventos-test.sqlite'
    @eService = Services::EventoService.new
    @uService = Services::UsuarioService.new
  end


  def test_buscar_simple
    res = @eService.buscar ' EN '     #La palabra 'en' sale en los 3 primeros eventos
    assert_equal 3, res[:total]
    res = @eService.buscar 'churro'
    assert_equal 0, res[:total]
    res = @eService.buscar 'cumple'
    assert_equal 1, res[:total]
    res = @eService.buscar 'soporte'  #busqueda en texto
    assert_equal 1, res[:total]
  end

  def test_buscar_paginado
    res = @eService.buscar 'esta es la descripción', 5, 0
    #prueba del total de resultados
    assert_equal 50, res[:total]
    #prueba del limite
    assert_equal 5, res[:resultados].size
    #prueba del offset 0
    assert_equal 'Evento 5', res[:resultados][0].titulo

    #prueba del offset
    res = @eService.buscar 'esta es la descripción', 5, 3
    assert_equal 'Evento 8', res[:resultados][0].titulo
  end


  def test_crear_ok
    u_tw = @uService.obtener('tw')
    datos = {:titulo=>'t', :descripcion=>'d', :lugar=>'l', :direccion=>'d', :poblacion=>'p', :fecha_hora=>'2014-1-1 10:00'}
    res = @eService.crear(datos, u_tw)
    e = Evento[res.id]
    assert_equal e.titulo, 't'
    assert_equal u_tw.login, e.usuario.login
    assert_equal 'tw', e.usuario_login
  end

  def test_crear_fail
    datos = {}
    e = @eService.crear(datos, nil)
    assert_equal 6, e.size #todos los campos tienen error
  end


  def test_suscribir_ok
    @eService.suscribir(4, 'tw')
    assert_equal 2, Evento[4].suscriptores.size
    assert_equal 'tw', Evento[4].suscriptores[1].login
  end

  def test_suscribir_fail
    #evento no existente
    assert_raises(RuntimeError) {@eService.suscribir(0, 'tw')}
    #usuario no existente
    assert_raises(RuntimeError) {@eService.suscribir(1, 'aa')}
    @eService.suscribir(4, 'tw')
    #el usuario ya está suscrito al evento
    assert_raises(RuntimeError){@eService.suscribir(4, 'tw')}
  end

  def test_desuscribir_ok
    @eService.desuscribir(1, 'tw')
    #pepa es la única suscriptora, si eliminamos a tw
    assert_equal 1, Evento[1].suscriptores.size
  end

  def test_desuscribir_fail
    #usuario no suscrito a evento
    assert_raises(RuntimeError){@eService.desuscribir(4, 'tw')}
    #evento no existente
    assert_raises(RuntimeError) {@eService.desuscribir(0, 'tw')}
    #usuario no existente
    assert_raises(RuntimeError) {@eService.desuscribir(1, 'aa')}
  end

  def test_enviar_comentario_ok
    @eService.enviar_comentario(1, 'tw', 'hola')
    assert_equal 4, Evento[1].comentarios.size
    assert_equal 'hola', Evento[1].comentarios[3].texto
  end

  def test_enviar_comentario_fail_no_suscrito
    err = assert_raises(RuntimeError){@eService.enviar_comentario(4, 'tw', 'hola')}
    assert_match /no está suscrito/, err.message
  end

  def test_enviar_comentario_fail_no_evento
    err = assert_raises(RuntimeError){@eService.enviar_comentario(1000, 'tw', 'hola')}
    assert_match /no encontrado/, err.message
  end


end