var express = require("express");
var router = express.Router();
var models = require("../models");
const { obtenerTodos, obtenerPorId, borrarPorId, crearNuevo, actualizarPorId } = require('../libs/helper');

const modelo = models.alumno_materia
//Se incluyen todos los campos para la búsqueda necesaria en el borrado de un registro
const atributosParaEliminar = ["id", "id_alumno", "id_materia"]
//No se incluyen foreign keys para mostrar un respuesta más prolija
const atributosABuscarYMostrar = ["id"]
const atributosACrearOActualizar = ["id_alumno", "id_materia"]
const relacionesAIncluir = [{
  model: models.alumno,
  attributes: ['id', "nombre", "apellido"]
}, {
  as: 'materia',
  model: models.materia,
  attributes: ['id', "nombre"]
}]
const nombreEntidad = 'alumno_materia'

//Mostrar todos los elementos de la tabla, paginados
obtenerTodos(router, modelo, atributosABuscarYMostrar, relacionesAIncluir, nombreEntidad, false);
//Obtener por id
obtenerPorId(router, modelo, atributosABuscarYMostrar, relacionesAIncluir, nombreEntidad);
//Crear registro con los valores del cuerpo de la petición
crearNuevo(router, modelo, atributosACrearOActualizar, nombreEntidad);
//Actualizar por id
actualizarPorId(router, modelo, atributosABuscarYMostrar, atributosACrearOActualizar, relacionesAIncluir, nombreEntidad);
//Borrar por id
borrarPorId(router, modelo, atributosParaEliminar, relacionesAIncluir, nombreEntidad);

module.exports = router;