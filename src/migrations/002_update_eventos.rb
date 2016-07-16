#!/bin/env ruby
# encoding: utf-8

Sequel.migration do
  change do
    alter_table(:eventos) do
      add_column :lugar, String
      add_column :direccion, String
      add_column :poblacion,  String
      add_column :entradas_disponibles, Integer
    end
  end
end
