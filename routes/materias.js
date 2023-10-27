var express = require("express");
var router = express.Router();
var models = require("../models");
const { obtenerTodos, obtenerPorId, borrarPorId, crearNuevo, actualizarPorId } = require('../libs/helper');

const modelo = models.materia
const atributosABuscarYMostrar = ["id", "nombre", "carga_horaria"]
const atributosACrearOActualizar = ["nombre", "carga_horaria"]
const relacionesAIncluir = [{
  as: 'carrerasQueLaIncluyen',
  model: models.carrera,
  attributes: ["nombre"],
  through: { attributes: ["id"] }
}, {
  as: 'profQueLaDictan',
  model: models.docente,
  attributes: ["nombre", "apellido"],
  through: { attributes: ["letra", "dias", "turno"] }
}, {
  as: 'alumnQueLaCursan',
  model: models.alumno,
  attributes: ["nombre", "apellido"],
  through: { attributes: ["id"] }
}]
const nombreEntidad = 'materia'

//Mostrar todos los elementos de la tabla, paginados
obtenerTodos(router, modelo, atributosABuscarYMostrar, relacionesAIncluir, nombreEntidad);
//Obtener por id
obtenerPorId(router, modelo, atributosABuscarYMostrar, relacionesAIncluir, nombreEntidad);
//Crear registro con los valores del cuerpo de la petición
crearNuevo(router, modelo, atributosACrearOActualizar, nombreEntidad);
//Actualizar por id
actualizarPorId(router, modelo, atributosABuscarYMostrar, atributosACrearOActualizar, relacionesAIncluir, nombreEntidad);
//Borrar por id
borrarPorId(router, modelo, atributosABuscarYMostrar, relacionesAIncluir, nombreEntidad);

module.exports = router;