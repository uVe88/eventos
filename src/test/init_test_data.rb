#encoding: utf-8
require 'sequel'
require 'date'


db = Sequel.connect 'sqlite://eventos-test.sqlite'

db[:eventos].delete
db[:usuarios].delete

usuarios = db[:usuarios]
usuarios.insert(:login=>'tw', :password=>'tw', :email=>'tw@ua.es', :nombre=>'Tecnologías',
                :apellidos=>'Web de la UA',
                :fecha_nacimiento=>Date.new(1990,10,5), :varon=>true)
usuarios.insert(:login=>'pepa', :password=>'pepa', :email=>'pepa@ua.es', :nombre=>'Pepa',
                :apellidos => 'Pérez Martínez',
                :fecha_nacimiento=>Date.new(1992,1,1), :varon=>false)
eventos = db[:eventos]
eventos.insert(:titulo=>"Evento 1", :descripcion=>"Descripción evento 1.\nSegundo párrafo.\nTercero.",
    :fecha_hora=> Time.new(2014,3,1,22,00), :visitas=>100, :usuario_login=>'tw')
eventos.insert(:titulo=>"Prueba evento 2", :descripcion=>"descripcion evento 2",
    :fecha_hora=> DateTime.now, :usuario_login=>'tw')
eventos.insert(:titulo=>"Prueba evento 3", :descripcion=>"descripcion evento 3",
    :fecha_hora=> DateTime.now, :usuario_login=>'pepa')
