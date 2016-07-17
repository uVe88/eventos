#!/bin/env ruby
# encoding: utf-8
require 'sequel'
require 'sequel/plugins/serialization'

class Comentario < Sequel::Model
  many_to_one :evento



  plugin :json_serializer
  plugin :validation_helpers
  def validate
    super
    validates_presence [:texto, :fecha_hora, :evento_id, :usuario_login], :message=>'Dato requerido'
  end

  def has_key?(key)
    return true 
  end
end