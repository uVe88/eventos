#!/bin/env ruby
# encoding: utf-8

Sequel.migration do
  change do
    alter_table(:usuarios) do
      add_column :password, String
    end
  end
end
