#!/bin/env ruby
# encoding: utf-8
require 'sequel'
require 'logger'

module DataLayer
  def init_datalayer(db_path)
    db = Sequel.connect(db_path)
    #db.loggers << Logger.new($stdout)
    require_relative '../domain/evento'
    require_relative '../domain/usuario'
    require_relative '../domain/comentario'
    db
  end
end