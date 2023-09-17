var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {
  console.log("Esto es un mensaje para ver en consola");
  models.comision
    .findAll({
      attributes: ["id", "letra", "dias", "turno", "id_materia", "id_docente"]
    })
    .then(comisiones => res.send(comisiones))
    .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
  models.comision
    .create({
      letra: req.body.letra,
      dias: req.body.dias,
      turno: req.body.turno,
      id_materia: req.body.id_materia,
      id_docente: req.body.id_docente
    })
    .then(comision => res.status(201).send({ id: comision.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: ya existe esa comisión')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findComision = (id, { onSuccess, onNotFound, onError }) => {
  models.comision
    .findOne({
      attributes: ["id", "letra", "dias", "turno", "id_materia", "id_docente"],
      where: { id }
    })
    .then(comision => (comision ? onSuccess(comision) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findComision(req.params.id, {
    onSuccess: comision => res.send(comision),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = comision =>
    comision
      .update({
        letra: req.body.letra,
        dias: req.body.dias,
        turno: req.body.turno,
        id_materia: req.body.id_materia,
        id_docente: req.body.id_docente
      }, { fields: ["letra", "dias", "turno", "id_materia", "id_docente"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: ya existe esa comisión')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
  findComision(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = comision =>
    comision
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findComision(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
