#encoding: utf-8

require 'date'
require_relative 'data/init_datalayer'

include DataLayer

db = DataLayer::init_datalayer 'sqlite://eventos.sqlite'


db[:comentarios].delete
db[:suscripciones].delete
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

texto1 = <<eos
 Concierto del grupo catalán "Manel", presentando su último disco "Atletes, baixin de l’escenari".
"Atletes, baixin de l’escenari" incluye un total de trece canciones con títulos como "Ai, Yoko", "Banda de rock", "Mort d’un heroi romàntic", "Imagina’t un nen", "Ja era fort", "Vés bruixot!" o "Teresa Rampell", el primer single de este nuevo trabajo.
eos
eventos.insert(:id=>1, :titulo=>"Manel en concierto",
               :descripcion=>texto1,
               :fecha_hora=> Time.new(2014,4,3,22,00), :visitas=>100,
               :lugar=>'Sala The One', :direccion=>'Calle del Bronce, 8',
               :geolocalizado=>true, :lat=>38.390547, :lon=>-0.512112,
               :poblacion=>'San Vicente del Raspeig',
               :entradas_disponibles=>100,
               :usuario_login=>'tw')
texto2 = <<eos
Examen práctico de Tecnologías Web. Se realiza delante del ordenador en el laboratorio de prácticas y consistirá en desarrollar una pequeña aplicación web del lado del cliente usando las herramientas y tecnologías vistas en clase.
Se podrá consultar documentación escrita o en soporte electrónico pero no se tendrá acceso a Internet.
Aunque pone una hora es provisional, todavía está por determinar.
eos
eventos.insert(:id=>2, :titulo=>"Examen de Tecnologías Web",
               :descripcion=>texto2,
               :lugar=>'aula de prácticas por determinar',
               :poblacion=>'San Vicente del Raspeig',
               :visitas=>75,
               :geolocalizado=>true, :lat=>38.386948, :lon=>-0.511632,
               :fecha_hora=> Time.new(2014,06,11,10,00),
               :entradas_disponibles=>100,
               :usuario_login=>'tw')

texto3 = <<eos
Fiesta en el Aeropuerto de Castellón, aprovechando el espacio libre.
Habrá barra libre y estará abierto toda la noche.
eos
eventos.insert(:id=>3, :titulo=>"Fiesta en el aeropuerto de Castellón",
               :descripcion=>texto3,
               :lugar=>'Aeropuerto de Castellón',
               :poblacion=>'Castellón',
               :visitas=>35,
               :geolocalizado=>true, :lat=>40.204919, :lon=>0.06806,
               :fecha_hora=> Time.new(2014,06,11,10,00),
               :entradas_disponibles=>100,
               :usuario_login=>'tw')


eventos.insert(:id=>4, :titulo=>"Cumpleaños de José Luis Moreno",
               :descripcion=>"Soy José Luis Moreno y estáis todos invitados a mi cumpleaños.\nGracias anticipadas a todos los que vayáis a venir. Por supuesto veréis a Macario, Monchito y compañía.",
    :fecha_hora=> Time.new(2014,04,16,22,00),
    :lugar=>'Casa de José Luis Moreno',
    :poblacion=>'Las Rozas',
    :visitas=>50,
    :geolocalizado=>true, :lat=>40.515092, :lon=>-3.641947,
    :entradas_disponibles=>0,
    :usuario_login=>'pepa')


#pasando un argumento numérico en línea de comandos crear tantos eventos como se diga
if !ARGV[0].nil?
  id = 5
  puts "Creando #{ARGV[0]} eventos "
  ARGV[0].to_i.times {
    eventos.insert(:id=>id, :titulo=>"Evento #{id}",
                   :descripcion=>"Esta es la descripción del evento #{id}",
                   :fecha_hora=> Time.new+rand(100)*3600*24,
                   :visitas=>0,
                   :lugar=> "Lugar del evento #{id}",
                   :poblacion=> "Población del evento #{id}",
                   :geolocalizado=>false,
                   :entradas_disponibles=>100,
                   :usuario_login=>'tw')
    id=id+1
  }
end

suscripciones = db[:suscripciones]
#suscribir al creador a sus propios eventos
suscripciones.insert(:evento_id=>1, :usuario_login=>'tw')
suscripciones.insert(:evento_id=>2, :usuario_login=>'tw')
suscripciones.insert(:evento_id=>3, :usuario_login=>'tw')
suscripciones.insert(:evento_id=>4, :usuario_login=>'pepa')
#otras suscripciones
suscripciones.insert(:evento_id=>1, :usuario_login=>'pepa')
suscripciones.insert(:evento_id=>2, :usuario_login=>'pepa')


comentarios = db[:comentarios]
comentarios.insert(:id=>1, :evento_id=>1, :usuario_login=>'pepa',
                   :texto=>'Allí estaré, me encanta Manel', :fecha_hora=>Time.new(2014,3,13,20,00))
comentarios.insert(:id=>2, :evento_id=>1, :usuario_login=>'tw',
                   :texto=>'Pues entonces allí nos veremos :)', :fecha_hora=>Time.new(2014,3,15,12,24))
comentarios.insert(:id=>3, :evento_id=>1, :usuario_login=>'tw',
                   :texto=>'Por cierto, iré antes del concierto a tomar unas cervezas\nSi alguien se quiere apuntar,
 quedamos una hora antes en la puerta', :fecha_hora=>Time.new(2014,3,16,11,40))
comentarios.insert(:id=>4, :evento_id=>2, :usuario_login=>'tw',
                   :texto=>'Como Otto comentó en clase, el examen no es obligatorio y se puede evaluar la asignatura en base únicamente
a las prácticas ', :fecha_hora=>Time.new(2014,4,2,10,35))
comentarios.insert(:id=>5, :evento_id=>2, :usuario_login=>'pepa',
                   :texto=>'Pues de eso yo no me había enterado. Yo QUIERO hacer el examen :(', :fecha_hora=>Time.new(2014,4,2,11,27))
comentarios.insert(:id=>6, :evento_id=>4, :usuario_login=>'pepa',
                   :texto=>'Va a ser el fiestón del año!!', :fecha_hora=>Time.new(2014,1,3,10,15))

#copiar base de datos para usar también en testing
require 'fileutils'
FileUtils.cp 'eventos.sqlite','test/eventos-test.sqlite'
