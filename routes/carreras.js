var express = require("express");
var router = express.Router();
var models = require("../models");
const { obtenerTodos, obtenerPorId, borrarPorId, crearNuevo, actualizarPorId } = require('../libs/helper');

const modelo = models.carrera
const atributosABuscarYMostrar = ["id", "nombre"]
const atributosACrearOActualizar = ["nombre"]
const relacionesAIncluir = [{
  as: 'materiasIncluidas',
  model: models.materia,
  attributes: ["nombre", "carga_horaria"],
  through: { attributes: ["id"] }
}, {
  as: 'alumnosInscriptos',
  model: models.alumno,
  attributes: ["dni", "nombre", "apellido"]
}]
const nombreEntidad = 'carrera'

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