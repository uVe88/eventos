#!/bin/env ruby
# encoding: utf-8

require 'sequel'
require 'date'

module Services
  class EventoService
    def listar_populares(cantidad)
      Evento.reverse_order(:visitas).limit(cantidad).all
    end

    def obtener(id)
      Evento[id]
    end

    def buscar(cadena, limite=10, offset=0)
      res = Evento.where(Sequel.ilike(:titulo,"%#{cadena}%") |
                         Sequel.ilike(:descripcion,"%#{cadena}%"))
      valor = {}
      valor[:total]=res.count
      res = res.limit(limite) unless limite.nil?
      res = res.offset(offset) unless offset.nil?
      valor[:resultados]=res.all
      valor
    end

    def crear(datos, usuario)
      e = Evento.crear(datos)
      e.validate
      if e.errors.empty?
        e.usuario = usuario
        e.save
        return e
      else
        return e.errors
      end
    end

    def suscribir(id_evento, login_usuario)
      begin
        evento = Evento[id_evento]
        if evento.nil?
          raise "Evento #{id_evento} no encontrado"
        end
        uService = UsuarioService.new
        usuario = uService.obtener(login_usuario)
        if usuario.nil?
          raise "Usuario #{login_usuario} no encontrado"
        end
        usuario.add_suscrito(evento)
      rescue Sequel::UniqueConstraintViolation
        raise "El usuario #{login_usuario} ya está suscrito al evento #{id_evento}"
      end
    end


    def desuscribir(id_evento, login_usuario)
      evento = Evento[id_evento]
      if evento.nil?
        raise "Evento #{id_evento} no encontrado"
      end
      uService = UsuarioService.new
      usuario = uService.obtener(login_usuario)
      if usuario.nil?
        raise "Usuario #{login_usuario} no encontrado"
      end
      if usuario.suscritos_dataset.where(:id=>id_evento).all.size>0
        usuario.remove_suscrito(evento)
      else
        raise 'El usuario no está suscrito a ese evento'
      end
    end


    def enviar_comentario(id_evento, usuario_login, texto)
      evento = Evento[id_evento]
      if evento.nil?
        raise "Evento #{id_evento} no encontrado"
      end
      unless evento.suscrito_por? usuario_login
        raise "El usuario #{usuario_login} no está suscrito al evento #{id_evento}"
      end
      evento.add_comentario(:usuario_login=>usuario_login, :texto=>texto, :fecha_hora=>Time.now)
    end


  end
end