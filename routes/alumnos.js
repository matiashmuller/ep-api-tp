var express = require("express");
var router = express.Router();
var models = require("../models");
const validarToken = require('../libs/validarToken');
const { logger, loggerMeta } = require('../libs/logger');
const { buscarEntidad, responderAlError, obtenerTodos, obtenerPorId, borrarPorId, crearNuevo } = require('../libs/helper');

const modelo = models.alumno
const atributosAMostrar = ["id", "dni", "nombre", "apellido", "fecha_nac"]
const camposACrear = ["dni", "nombre", "apellido", "fecha_nac", "id_carrera"]
const incluye = [{
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
obtenerTodos(router, modelo, atributosAMostrar, incluye, nombreEntidad);

//Crear registro con los valores del cuerpo de la petición
crearNuevo(router, modelo, camposACrear, nombreEntidad);

//Búsqueda por id
const findAlumno = (id) => {
  return buscarEntidad(
    models.alumno,
    ["id", "dni", "nombre", "apellido", "fecha_nac"],
    [{
      as: 'carreraQueEstudia',
      model: models.carrera,
      attributes: ["nombre"]
    }, {
      as: 'materiasQueCursa',
      model: models.materia,
      attributes: ["nombre", "carga_horaria"],
      through: { attributes: ["id"] }
    }],
    id,
    'Alumno'
  );
};

//Obtener por id
obtenerPorId(router, modelo, atributosAMostrar, incluye, nombreEntidad);

//Actualizar, requiere id
router.put("/:id", validarToken, async (req, res) => {
  try {
    const alumno = await findAlumno(req.params.id);

    await alumno.update({
      dni: req.body.dni,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      fecha_nac: req.body.fecha_nac,
      id_carrera: req.body.id_carrera
    }, {
      fields: ["dni", "nombre", "apellido", "fecha_nac", "id_carrera"]
    });

    res.status(200).json({ estado: 'Éxito al actualizar alumno.', alumnoActualizado: alumno });
    logger.info('Éxito al actualizar alumno.', loggerMeta(req, res));
  } catch (error) {
    responderAlError(error, req, res, req.params.id, 'Alumno');
  }
});

//Borrar, requiere id
borrarPorId(router, modelo, atributosAMostrar, incluye, nombreEntidad)

module.exports = router;