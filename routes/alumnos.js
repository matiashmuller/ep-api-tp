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
    res.status(500).send('Error al mostrar alumno.');
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

    res.status(201).send({ id: alumno.id });
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

const findAlumno = async (id, { onSuccess, onNotFound, onError }) => {
  try {
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
    alumno ? onSuccess(alumno) : onNotFound();
  } catch (error) {
    onError(error)
  }
};

router.get("/:id", validarToken, (req, res) => {
  findAlumno(req.params.id, {
    onSuccess: alumno => {
      res.send(alumno);
      logger.info('Éxito al mostrar alumno.', loggerMeta(req, res));
    },
    onNotFound: () => {
      res.sendStatus(404)
      logger.error('No encontrado.', loggerMeta(req, res));
    },
    onError: error => {
      res.sendStatus(500);
      logger.error(`${error}`, loggerMeta(req, res));
    }
  });
});

router.put("/:id", validarToken, (req, res) => {
  findAlumno(req.params.id, {
    onSuccess: alumno => {
      try {
        alumno.update({
          dni: req.body.dni,
          nombre: req.body.nombre,
          apellido: req.body.apellido,
          fecha_nac: req.body.fecha_nac,
          id_carrera: req.body.id_carrera
        }, {
          fields: ["dni", "nombre", "apellido", "fecha_nac", "id_carrera"]
        })
        res.sendStatus(200);
        logger.info('Éxito al actualizar alumno.', loggerMeta(req, res));
      } catch (error) {
        if (error == "SequelizeDatabaseError") {
          res.status(400).send('Bad request: ya existe en la base de datos')
        }
        else {
          res.sendStatus(500)
        }
        logger.error(`${error}`, loggerMeta(req, res));
      }
    },
    onNotFound: () => {
      res.sendStatus(404)
      logger.error('No encontrado.', loggerMeta(req, res));
    },
    onError: error => {
      res.sendStatus(500);
      logger.error(`${error}`, loggerMeta(req, res));
    }
  });
});

router.delete("/:id", validarToken, (req, res) => {
  findAlumno(req.params.id, {
    onSuccess: alumno => {
      try {
        alumno.destroy();
        res.sendStatus(200);
        logger.info('Éxito al borrar alumno.', loggerMeta(req, res));
      } catch (error) {
        res.sendStatus(500)
        logger.error(`${error}`, loggerMeta(req, res));
      }
    },
    onNotFound: () => {
      res.sendStatus(404)
      logger.error('No encontrado.', loggerMeta(req, res));
    },
    onError: error => {
      res.sendStatus(500);
      logger.error(`${error}`, loggerMeta(req, res));
    }
  });
});

module.exports = router;
