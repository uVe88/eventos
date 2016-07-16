#!/bin/env ruby
# encoding: utf-8
require 'minitest/autorun'
require './data/init_datalayer'
require 'date'

include DataLayer


class SuscripcionTest < MiniTest::Test
  def setup
    DataLayer::init_datalayer 'sqlite://test/eventos-test.sqlite'
  end

  def test_suscripciones
    susc = Evento[1].suscriptores
    assert_equal 2, susc.size
    assert_equal 'tw', susc[0].login
    assert_equal 'pepa', susc[1].login

    assert_equal 3, Usuario['tw'].suscritos.size
  end
end
