#!/bin/env ruby
# encoding: utf-8

Sequel.migration do
  change do
    alter_table(:comentarios) do
      add_column :fecha_hora, DateTime
    end
  end
end
