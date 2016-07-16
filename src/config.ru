require 'bundler'


require './web/servidor_plantillas'
require './web/servidor_api'

map '/eventos' do
  run ServidorPlantillas
end

map '/eventos/api' do
  run ServidorAPI
end

