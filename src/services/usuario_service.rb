#!/bin/env ruby
# encoding: utf-8
require 'date'

module Services
  class UsuarioService
    def registrar(datos)
      u = Usuario.new
      u.login = datos[:login]
      u.password = datos[:password]
      u.nombre = datos[:nombre]
      u.apellidos = datos[:apellidos]
      u.email = datos[:email]
      if !datos[:fecha_nacimiento].nil?
        u.fecha_nacimiento = Date.parse datos[:fecha_nacimiento] rescue nil
      end
      u.validate
      errores = u.errors
      if datos[:password] != datos[:password2]
        mensaje = 'Las contraseñas no coinciden'
        if (errores[:password].nil?)
          errores[:password] = mensaje
        else
          errores[:password] << mensaje
        end
      end
      if errores.empty?
        u.save
      end
      errores
    end

    def obtener login
      Usuario[login]
    end

    def login(username, password)
      usuario = obtener username
      if !usuario.nil? and (usuario.password == password)
        usuario
      else
        nil
      end
    end

    def get_feed(user_login, num_comentarios)
      usuario = obtener user_login
      usuario.comentarios_dataset
        .order(Sequel.desc(:fecha_hora))
        .limit(num_comentarios)
        .all
    end

    def comprobar_suscripcion(usuario_login, evento_id)
      u = obtener usuario_login
      u.suscrito_a? evento_id
    end
  end
end