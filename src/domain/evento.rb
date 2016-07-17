#!/bin/env ruby
# encoding: utf-8
require 'sequel'
require 'date'
require 'sequel/plugins/serialization'


class Evento < Sequel::Model
  many_to_one :usuario, :key=>:usuario_login
  many_to_many :suscriptores, :class=>:Usuario, :left_key=>:evento_id, :right_key=>:usuario_login, :join_table=>:suscripciones
  one_to_many :comentarios

  plugin :json_serializer
  plugin :validation_helpers

  def validate
    super
    validates_presence [:titulo, :descripcion, :fecha_hora, :lugar, :direccion, :poblacion], :message=>'Dato requerido'
  end

  def has_key?(key)
    return true 
  end

  def resumen
    idx = descripcion.index("\n")
    if idx.nil?
      descripcion
    else
      descripcion[0,idx]
    end
  end

  def descripcion_par
    if descripcion.index(/\n/).nil?
      descripcion
    else
      pars = descripcion.gsub /\n/, '</p><p>'
      '<p>' + pars + '</p>'
    end
  end

  def entradas_agotadas
    entradas_disponibles==0
  end

  def fecha_cad
    fecha_hora.strftime "%d-%m-%y"
  end

  def hora_cad
    fecha_hora.strftime "%H:%M"
  end

  def self.crear(datos)
    e = Evento.new
    e.set_fields(datos, [:titulo, :descripcion, :lugar, :direccion, :poblacion, :entradas_disponibles])
    e.fecha_hora = Time.parse(datos[:fecha_hora]) unless datos[:fecha_hora].nil?
    if (datos[:geolocalizado].nil? || datos[:geolocalizado]==false)
      e.geolocalizado = false
    else
      e.geolocalizado = true
      e.lat = datos[:lat]
      e.lon = datos[:lon]
    end
    e.visitas = 0
    return e
  end

  def suscrito_por?(usuario_login)
    suscriptores_dataset.where(:usuario_login=>usuario_login).all.size>0
  end

end