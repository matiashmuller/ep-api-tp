var express = require("express");
var router = express.Router();
var models = require("../models");
const { obtenerTodos, obtenerPorId, borrarPorId, crearNuevo, actualizarPorId } = require('../libs/helper');

const modelo = models.docente
const atributosABuscarYMostrar = ["id", "dni", "nombre", "apellido", "titulo", "fecha_nac"]
const atributosACrearOActualizar = ["dni", "nombre", "apellido", "titulo", "fecha_nac"]
const relacionesAIncluir = [{
  as: 'materiasQueDicta',
  model: models.materia,
  attributes: ["id", "nombre", "carga_horaria"],
  through: { attributes: ["letra", "dias", "turno"] }
}]
const nombreEntidad = 'docente'

//Mostrar todos los elementos de la tabla, paginados
obtenerTodos(router, modelo, atributosABuscarYMostrar, relacionesAIncluir, nombreEntidad);
//Obtener por id
obtenerPorId(router, modelo, atributosABuscarYMostrar, relacionesAIncluir, nombreEntidad);
//Crear registro con los valores del cuerpo de la petición
crearNuevo(router, modelo, atributosACrearOActualizar, nombreEntidad);
//Actualizar por id
actualizarPorId(router, modelo, atributosACrearOActualizar, nombreEntidad);
//Borrar por id
borrarPorId(router, modelo, nombreEntidad);

module.exports = router;