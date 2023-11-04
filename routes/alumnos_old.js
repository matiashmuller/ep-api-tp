var express = require("express");
var router = express.Router();
var models = require("../models");
const { obtenerTodos, obtenerPorId, borrarPorId, crearNuevo, actualizarPorId } = require('../libs/helper');

const modelo = models.alumno
const atributosABuscarYMostrar = ["id", "dni", "nombre", "apellido", "fecha_nac"]
const atributosACrearOActualizar = ["dni", "nombre", "apellido", "fecha_nac", "id_carrera"]
const relacionesAIncluir = [{
  as: 'carreraQueEstudia',
  model: models.carrera,
  attributes: ["nombre"]
}, {
  as: 'materiasQueCursa',
  model: models.materia,
  attributes: ["nombre", "carga_horaria"],
  through: { attributes: ["id"] }
}]
const nombreEntidad = 'alumno'

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