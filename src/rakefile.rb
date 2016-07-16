#encoding: utf-8
require 'rake/testtask'

Rake::TestTask.new do |t|
  t.test_files = FileList['test/*/*_test.rb']
  t.libs << '.'
  t.verbose = true
end
