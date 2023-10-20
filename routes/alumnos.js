var express = require("express");
var router = express.Router();
var models = require("../models");
const validarToken = require('../libs/validarToken');
const { logger, loggerMeta } = require('../libs/logger');

router.get("/", validarToken, async (req, res) => {
  try {
    /*
    Toma de parámetros para paginación:
    Toma los valores pagina y cantPorPag pasados como parámetros, los parsea
    a Int y luego comprueba: si algún valor de los pasados fuera aún inválido
    (<=0 o no-número), asigna uno válido por defecto (1 y 5 respectivamente).
    */
    let pagina = parseInt(req.query.pagina);
    let cantPorPag = parseInt(req.query.cantPorPag);

    pagina = isNaN(pagina) || pagina <= 0 ? 1 : pagina;
    cantPorPag = isNaN(cantPorPag) || cantPorPag <= 0 ? 5 : cantPorPag;

    const resp = await models.alumno.findAndCountAll({
      attributes: ["id", "dni", "nombre", "apellido", "fecha_nac"],
      //Asocicación
      include: [{
        as: 'carreraQueEstudia',
        model: models.carrera,
        attributes: ["nombre"]
      }, {
        as: 'materiasQueCursa',
        model: models.materia,
        attributes: ["nombre", "carga_horaria"],
        through: { attributes: ["id"] }
      }],
      /*
      Paginación: Se muestran cantPorPag (5 por defecto) elementos por página,
      a partir de la página actual. Por defecto considera la página 1 como la primera.
      Ejemplo:
        Página 1 → Elementos 1 al 5
        Pagina 2 → Elementos 6 al 10
      */
      limit: cantPorPag,
      offset: (pagina - 1) * (cantPorPag),
      distinct: true
    });
    //Loguea y manda respuesta de éxito
    const totalElementos = resp.count;
    const alumnos = resp.rows;
    const totalPaginas = Math.ceil(totalElementos / cantPorPag);

    res.send({
      totalElementos,
      totalPaginas,
      paginaNro: pagina,
      alumnos
    });
    logger.info('Éxito al mostrar alumno.', loggerMeta(req, res));
  } catch (error) {
    res.sendStatus(500)
    logger.error(`${error}`, loggerMeta(req, res));
  }
});

router.post("/", validarToken, async (req, res) => {
  try {
    const alumno = await models.alumno.create({
      dni: req.body.dni,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      fecha_nac: req.body.fecha_nac,
      id_carrera: req.body.id_carrera
    });

    res.status(201).send({ estado: 'Éxito al crear alumno', id: alumno.id });
    logger.info('Éxito al registrar alumno.', loggerMeta(req, res));
  } catch (error) {
    if (error == "SequelizeUniqueConstraintError: Validation error") {
      res.status(400).send('Bad request: existe otro alumno con el mismo dni')
    }
    else {
      res.sendStatus(500)
    }
    logger.error(`${error}`, loggerMeta(req, res));
  }
});

const findAlumno = async (id) => {
  const alumno = await models.alumno.findOne({
    attributes: ["id", "dni", "nombre", "apellido", "fecha_nac"],
    //Asocicación
    include: [{
      as: 'carreraQueEstudia',
      model: models.carrera,
      attributes: ["nombre"]
    }, {
      as: 'materiasQueCursa',
      model: models.materia,
      attributes: ["nombre", "carga_horaria"],
      through: { attributes: ["id"] }
    }],
    where: { id }
  });
  if (!alumno) {
    throw new Error('Alumno no encontrado.')
  }
  return alumno;
};

//hacer 'error catcher?'

router.get("/:id", validarToken, async (req, res) => {
  try {
    const alumno = await findAlumno(req.params.id);
    res.json(alumno);
    logger.info('Éxito al mostrar alumno.', loggerMeta(req, res));
  } catch (error) {
    if (error.message == 'Alumno no encontrado.') {
      res.status(404).send(`Error: Alumno con id ${req.params.id} no encontrado.`);
    } else {
      res.sendStatus(500)
    }
    logger.error(`${error}`, loggerMeta(req, res));
  }
});

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
    if (error.message == 'Alumno no encontrado.') {
      res.status(404).send(`Error: Alumno con id ${req.params.id} no encontrado.`);
    } else {
      res.sendStatus(500)
    }
    logger.error(`${error}`, loggerMeta(req, res));
  }
});

router.delete("/:id", validarToken, async (req, res) => {
  try {
    const alumno = await findAlumno(req.params.id);

    await alumno.destroy();

    res.status(200).send('Éxito al eliminar alumno.');
    logger.info('Éxito al eliminar alumno.', loggerMeta(req, res));

  } catch (error) {
    if (error.message == 'Alumno no encontrado.') {
      res.status(404).send(`Error: Alumno con id ${req.params.id} no encontrado.`);
    } else {
      res.sendStatus(500)
    }
    logger.error(`${error}`, loggerMeta(req, res));
  }
});

module.exports = router;