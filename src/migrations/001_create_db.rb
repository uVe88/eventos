#!/bin/env ruby
# encoding: utf-8
Sequel.migration do
  change do
    create_table(:eventos) do
      primary_key :id
      String :titulo
      String :descripcion, :text=>true
      DateTime :fecha_hora
      Integer :visitas
      TrueClass :geolocalizado
      Float :lat
      Float :lon
      String :usuario_login
      foreign_key [:usuario_login], :usuarios
    end

    create_table(:usuarios) do
      String :login, :primary_key=>true
      String :nombre
      String :apellidos
      String :email
      TrueClass :varon
      Date :fecha_nacimiento
    end

    create_table(:comentarios) do
      primary_key :id
      String :texto, :text=>true
      foreign_key :evento_id, :eventos
      String :usuario_login
      foreign_key [:usuario_login], :usuarios
    end

    create_table(:imagenes) do
      primary_key :id
      String :usuario_login
      foreign_key [:usuario_login], :usuarios
      foreign_key :evento_id, :eventos
    end

    create_table(:entradas) do
      primary_key :id
      DateTime :fecha_hora
      foreign_key :evento_id, :eventos
      String :usuario_login
      foreign_key [:usuario_login], :usuarios
    end
  end
end
