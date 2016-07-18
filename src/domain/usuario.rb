#!/bin/env ruby
# encoding: utf-8
require 'sequel'
require 'sequel/plugins/serialization'

class Usuario < Sequel::Model
  one_to_many :eventos, :key=>:usuario_login
  #de http://sequel.jeremyevans.net/rdoc/files/doc/association_basics_rdoc.html
  #left_key: clave ajena de la 'join table' que apunta a esta tabla
  #right_key: idem que apunta a la otra tabla
  many_to_many :suscritos, :class=>:Evento, :left_key=>:usuario_login, :right_key=>:evento_id, :join_table=>:suscripciones

  plugin :many_through_many
  many_through_many :comentarios, [[:suscripciones, :usuario_login, :evento_id],
   [:comentarios, :evento_id, :id]]


  plugin :json_serializer
  plugin :validation_helpers
  def validate
    super
    validates_presence [:login, :password, :nombre, :apellidos, :email, :fecha_nacimiento], :message=>'Dato requerido'
    validates_unique :login, :message=>'Ya existe un usuario con ese login'
    validates_min_length 6, :password, :message=>proc{|lon| "La longitud mínima es de #{lon} caracteres"}
    validates_format /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i, :email, :message=>'Formato incorrecto'
  end

  def suscrito_a?(id_evento)
    suscritos_dataset.where(:evento_id=>id_evento).all.size>0
  end

  def has_key?(key)
    return true 
  end
  
end