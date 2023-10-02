var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {
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

  models.carrera_materia
    .findAndCountAll({
      attributes: ["id"],
      //Asocicación
      include: [
        {
          model: models.carrera,
          attributes: ['id', "nombre"]
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
      const carreras_materias = resp.rows;
      const totalPaginas = Math.ceil(totalElementos / cantPorPag);

      res.send({
        totalElementos,
        totalPaginas,
        paginaNro: pagina,
        carreras_materias
      })
    })
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
      attributes: ["id"],
      //Asocicación
      include: [
        {
          model: models.carrera,
          attributes: ['id', "nombre"]
        },
        {
          as: 'materia',
          model: models.materia,
          attributes: ['id', "nombre"]
        }
      ],
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
