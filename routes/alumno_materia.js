var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {
  console.log("Esto es un mensaje para ver en consola");
  models.alumno_materia
    .findAll({
      attributes: ["id"],
      //Asocicación
      include: [
        {
          model:models.alumno, 
          attributes: [ 'id', "nombre", "apellido"]
        },
        {
          as: 'materia',
          model:models.materia, 
          attributes: [ 'id', "nombre"]
        }
      ],
    })
    .then(alumno_materia => res.send(alumno_materia))
    .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
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
          model:models.alumno, 
          attributes: [ 'id', "nombre", "apellido"]
        },
        {
          as: 'materia',
          model:models.materia, 
          attributes: [ 'id', "nombre"]
        }
      ],
      where: { id }
    })
    .then(alumno_materia => (alumno_materia ? onSuccess(alumno_materia) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findAlumno_materia(req.params.id, {
    onSuccess: alumno_materia => res.send(alumno_materia),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
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
