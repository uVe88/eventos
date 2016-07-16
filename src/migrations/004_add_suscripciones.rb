#!/bin/env ruby
# encoding: utf-8

Sequel.migration do
  change do
    create_table(:suscripciones) do
      String :usuario_login
      foreign_key [:usuario_login], :usuarios
      foreign_key :evento_id, :eventos
      primary_key [:usuario_login, :evento_id]
    end
  end
end
