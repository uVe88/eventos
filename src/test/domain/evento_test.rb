#!/bin/env ruby
# encoding: utf-8
require 'minitest/autorun'
require './data/init_datalayer'
require 'date'

include DataLayer


class EventoTest < MiniTest::Test
  def setup
    DataLayer::init_datalayer 'sqlite://test/eventos-test.sqlite'
    @evento = Evento.where(:titulo=>'Examen de Tecnologías Web').first
  end

  def test_fecha_hora_ok
    assert_equal '10:00', @evento.hora_cad
    assert_equal '11-06-14', @evento.fecha_cad
  end

  def test_agotadas_ok
    assert_equal false, @evento.entradas_agotadas
  end

  def test_resumen_ok
    #assert_equal 'Examen práctico de Tecnologías Web.', @evento.resumen
  end

  def test_descripcion_ok
    #assert_equal 'Descripción evento 1.', @evento.resumen
    #puts @evento.descripcion_par
  end

  def test_crear_ok
    datos = {:titulo=>'prueba', :descripcion=>'desc',
             :fecha_hora=>'2014-1-15 22:00', :entradas_disponibles=>1000}
    e = Evento.crear(datos)
    assert_equal 'prueba', e.titulo
    assert_equal 'desc', e.descripcion
    assert_equal Time.parse(datos[:fecha_hora]), e.fecha_hora
    assert_equal false, e.geolocalizado
    assert_equal 1000, e.entradas_disponibles
  end

  def test_suscrito_por_ok
    assert Evento[1].suscrito_por? 'tw'
    assert Evento[1].suscrito_por? 'pepa'
    refute Evento[4].suscrito_por? 'tw'
  end
end
