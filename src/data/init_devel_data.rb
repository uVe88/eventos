#!/bin/env ruby
# encoding: utf-8
require 'date'
require_relative './init_datalayer'

include DataLayer

db = DataLayer::init 'sqlite://eventos.sqlite'
eventos = db[:eventos]
eventos.delete
eventos.insert(:titulo=>"Evento 1", :descripcion=>"Descripción evento 1.\nSegundo párrafo.\nTercero.",
    :fecha_hora=> Time.new(2014,3,1,22,00), :visitas=>100)
eventos.insert(:titulo=>"Prueba evento 2", :descripcion=>"descripcion evento 2",
    :fecha_hora=> DateTime.now)
eventos.insert(:titulo=>"Prueba evento 3", :descripcion=>"descripcion evento 3",
    :fecha_hora=> DateTime.now)
