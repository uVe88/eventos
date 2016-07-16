#!/bin/env ruby
# encoding: utf-8
require 'minitest'

class SequelTestCase < MiniTest::Test
  def run(*args, &block)
    result = nil
    Sequel::Model.db.transaction(:rollback=>:always){result = super}
    result
  end
end