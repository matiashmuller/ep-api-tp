var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {
  console.log("Esto es un mensaje para ver en consola");
  models.carrera_materia
    .findAll({
      attributes: ["id", "id_carrera", "id_materia"]
    })
    .then(carrera_materia => res.send(carrera_materia))
    .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
  models.carrera_materia
    .create({
      id_carrera: req.body.id_carrera,
      id_materia: req.body.id_materia
    })
    .then(carrera_materia => res.status(201).send({ carrera_materiaCreado: carrera_materia }))
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

const findCarrera_materia = (id, { onSuccess, onNotFound, onError }) => {
  models.carrera_materia
    .findOne({
      attributes: ["id", "id_carrera", "id_materia"],
      where: { id }
    })
    .then(carrera_materia => (carrera_materia ? onSuccess(carrera_materia) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findCarrera_materia(req.params.id, {
    onSuccess: carrera_materia => res.send(carrera_materia),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = carrera_materia =>
    carrera_materia
      .update({
        id_carrera: req.body.id_carrera,
        id_materia: req.body.id_materia
      }, { fields: ["id_carrera", "id_materia"] })
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
  findCarrera_materia(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = carrera_materia =>
    carrera_materia
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findCarrera_materia(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
