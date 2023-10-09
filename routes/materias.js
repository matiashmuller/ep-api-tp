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

  models.materia
    .findAndCountAll({
      attributes: ["id", "nombre", "carga_horaria"],
      //Asocicación
      include: [
        {
          as: 'carrerasQueLaIncluyen',
          model: models.carrera,
          attributes: ["nombre"],
          through: { attributes: ["id"] }
        },
        {
          as: 'profQueLaDictan',
          model: models.docente,
          attributes: ["nombre", "apellido"],
          through: { attributes: ["letra", "dias", "turno"] }
        },
        {
          as: 'alumnQueLaCursan',
          model: models.alumno,
          attributes: ["nombre", "apellido"],
          through: { attributes: ["id"] }
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
      offset: (pagina - 1) * (cantPorPag),
      distinct: true
    })
    .then(resp => {
      const totalElementos = resp.count;
      const materias = resp.rows;
      const totalPaginas = Math.ceil(totalElementos/cantPorPag);

      res.send({
        totalElementos,
        totalPaginas,
        paginaNro: pagina,
        materias
      })
    })
    .catch(() => res.sendStatus(500));
});

router.post("/", validarToken, (req, res) => {
  models.materia
    .create({
      nombre: req.body.nombre,
      carga_horaria: req.body.carga_horaria,
      id_carrera: req.body.id_carrera
    })
    .then(materia => res.status(201).send({ id: materia.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra materia con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findMateria = (id, { onSuccess, onNotFound, onError }) => {
  models.materia
    .findOne({
      attributes: ["id", "nombre", "carga_horaria"],
      //Asocicación
      include: [
        {
          as: 'carrerasQueLaIncluyen',
          model: models.carrera,
          attributes: ["nombre"],
          through: { attributes: ["id"] }
        },
        {
          as: 'profQueLaDictan',
          model: models.docente,
          attributes: ["nombre", "apellido"],
          through: { attributes: ["letra", "dias", "turno"] }
        },
        {
          as: 'alumnQueLaCursan',
          model: models.alumno,
          attributes: ["nombre", "apellido"],
          through: { attributes: ["id"] }
        }
      ],
      where: { id }
    })
    .then(materia => (materia ? onSuccess(materia) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", validarToken, (req, res) => {
  findMateria(req.params.id, {
    onSuccess: materia => res.send(materia),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", validarToken, (req, res) => {
  const onSuccess = materia =>
    materia
      .update({
        nombre: req.body.nombre,
        carga_horaria: req.body.carga_horaria,
        id_carrera: req.body.id_carrera
      }, { fields: ["nombre", "carga_horaria", "id_carrera"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra materia con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
  findMateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", validarToken, (req, res) => {
  const onSuccess = materia =>
    materia
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findMateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
