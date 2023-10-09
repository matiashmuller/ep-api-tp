var express = require("express");
var router = express.Router();
var models = require("../models");
const validarToken = require('../libs/validarToken');

router.get("/", validarToken, (req, res) => {
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

  models.alumno_materia
    .findAndCountAll({
      attributes: ["id"],
      //Asocicación
      include: [
        {
          model: models.alumno,
          attributes: ['id', "nombre", "apellido"]
        },
        {
          as: 'materia',
          model: models.materia,
          attributes: ['id', "nombre"]
        }
      ],
      /*
      Paginación: Se muestran cantPorPag (5 por defecto) elementos por página,
      a partir de la página actual. Por defecto considera la página 1 como la primera.
      Ejemplo:
        Página 1 → Elementos 1 al 5
        Pagina 2 → Elementos 6 al 10
      */
      limit: cantPorPag,
      offset: (pagina - 1) * (cantPorPag)
    })
    .then(resp => {
      const totalElementos = resp.count;
      const alumnos_materias = resp.rows;
      const totalPaginas = Math.ceil(totalElementos / cantPorPag);

      res.send({
        totalElementos,
        totalPaginas,
        paginaNro: pagina,
        alumnos_materias
      })
    })
    .catch(() => res.sendStatus(500));
});

router.post("/", validarToken, (req, res) => {
  models.alumno_materia
    .create({
      id_alumno: req.body.id_alumno,
      id_materia: req.body.id_materia
    })
    .then(alumno_materia => res.status(201).send({ alumno_materiaCreado: alumno_materia }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: ya existe en la base de datos')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findAlumno_materia = (id, { onSuccess, onNotFound, onError }) => {
  models.alumno_materia
    .findOne({
      attributes: ["id"],
      //Asocicación
      include: [
        {
          model: models.alumno,
          attributes: ['id', "nombre", "apellido"]
        },
        {
          as: 'materia',
          model: models.materia,
          attributes: ['id', "nombre"]
        }
      ],
      where: { id }
    })
    .then(alumno_materia => (alumno_materia ? onSuccess(alumno_materia) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", validarToken, (req, res) => {
  findAlumno_materia(req.params.id, {
    onSuccess: alumno_materia => res.send(alumno_materia),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", validarToken, (req, res) => {
  const onSuccess = alumno_materia =>
    alumno_materia
      .update({
        id_alumno: req.body.id_alumno,
        id_materia: req.body.id_materia
      }, { fields: ["id_alumno", "id_materia"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: ya existe en la base de datos')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
  findAlumno_materia(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", validarToken, (req, res) => {
  const onSuccess = alumno_materia =>
    alumno_materia
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findAlumno_materia(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
