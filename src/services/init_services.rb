#!/bin/env ruby
# encoding: utf-8
require_relative '../data/init_datalayer'

module Services
  include DataLayer

  def init_services(db_path='sqlite://eventos.sqlite')
    DataLayer::init_datalayer db_path
  end
end