var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {
  /*
  Toma de parámetros para paginación:
  Toma los valores paginaActual y cantidadAVer pasados como parámetros y
  asiga un valor por defecto a cada uno (0 y 5 respectivamente), a usarse
  si no se pasara ningún parámetro.
  */
  const { paginaActual = 0, cantidadAVer = 5} = req.query;

  models.alumno
    .findAndCountAll({
      attributes: ["id", "dni", "nombre", "apellido", "fecha_nac"],
      //Asocicación
      include: [
        {
          as: 'carreraQueEstudia', 
          model: models.carrera, 
          attributes: ["nombre"]
        },
        {
          as: 'materiasQueCursa', 
          model: models.materia, 
          attributes: ["nombre", "carga_horaria"],
          through: { attributes: ["id"] }
        }
      ],
      /*
      Paginación: Se muestran cantidadAVer (5 por defecto) elementos por página,
      a partir de la página actual.
      Ejemplo:
        Página 0 → Elementos 1 al 5
        Pagina 1 → Elementos 6 al 10
      El + parsea a número los valores tomados de los parámetros.
      */
      limit: +cantidadAVer,
      offset: (+paginaActual) * (+cantidadAVer)
    })
    .then(alumnos => res.send(alumnos))
    .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
  models.alumno
    .create({
      dni: req.body.dni,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      fecha_nac: req.body.fecha_nac,
      id_carrera: req.body.id_carrera
    })
    .then(alumno => res.status(201).send({ id: alumno.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otro alumno con el mismo dni')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findAlumno = (id, { onSuccess, onNotFound, onError }) => {
  models.alumno
    .findOne({
      attributes: ["id", "dni", "nombre", "apellido", "fecha_nac"],
      //Asocicación
      include: [
        {
          as: 'carreraQueEstudia', 
          model:models.carrera, 
          attributes: ["nombre"]
        },
        {
          as: 'materiasQueCursa', 
          model:models.materia, 
          attributes: ["nombre", "carga_horaria"],
          through: { attributes: ["id"] }
        }
      ],
      where: { id }
    })
    .then(alumno => (alumno ? onSuccess(alumno) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findAlumno(req.params.id, {
    onSuccess: alumno => res.send(alumno),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = alumno =>
    alumno
      .update({
        dni: req.body.dni,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        fecha_nac: req.body.fecha_nac,
        id_carrera: req.body.id_carrera
      }, { fields: ["dni", "nombre", "apellido", "fecha_nac", "id_carrera"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otro alumno con el mismo dni')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
  findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = alumno =>
    alumno
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
