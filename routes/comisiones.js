var express = require("express");
var router = express.Router();
var models = require("../models");
const { obtenerTodos, obtenerPorId, borrarPorId, crearNuevo, actualizarPorId } = require('../libs/helper');

const modelo = models.comision
//No se incluyen foreign keys para mostrar un respuesta más prolija
const atributosABuscarYMostrar = ["id", "letra", "dias", "turno"]
const atributosACrearOActualizar = ["letra", "dias", "turno", "id_materia", "id_docente"]
const relacionesAIncluir = [{
  as: 'materia',
  model: models.materia,
  attributes: ['id', "nombre"]
}, {
  model: models.docente,
  attributes: ['id', "nombre", "apellido"]
}]
const nombreEntidad = 'comision'

//Mostrar todos los elementos de la tabla, paginados
obtenerTodos(router, modelo, atributosABuscarYMostrar, relacionesAIncluir, nombreEntidad, false);
//Obtener por id
obtenerPorId(router, modelo, atributosABuscarYMostrar, relacionesAIncluir, nombreEntidad);
//Crear registro con los valores del cuerpo de la petición
crearNuevo(router, modelo, atributosACrearOActualizar, nombreEntidad);
//Actualizar por id
actualizarPorId(router, modelo, atributosACrearOActualizar, nombreEntidad);
//Borrar por id
borrarPorId(router, modelo, nombreEntidad);

module.exports = router;