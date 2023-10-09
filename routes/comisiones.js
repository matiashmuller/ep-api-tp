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

  models.comision
    .findAndCountAll({
      attributes: ["id", "letra", "dias", "turno"],
      //Asocicación
      include: [
        {
          as: 'materia',
          model: models.materia,
          attributes: ['id', "nombre"]
        },
        {
          model: models.docente,
          attributes: ['id', "nombre", "apellido"]
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
      const comisiones = resp.rows;
      const totalPaginas = Math.ceil(totalElementos / cantPorPag);

      res.send({
        totalElementos,
        totalPaginas,
        paginaNro: pagina,
        comisiones
      })
    })
    .catch(() => res.sendStatus(500));
});

router.post("/", validarToken, (req, res) => {
  models.comision
    .create({
      letra: req.body.letra,
      dias: req.body.dias,
      turno: req.body.turno,
      id_materia: req.body.id_materia,
      id_docente: req.body.id_docente
    })
    .then(comision => res.status(201).send({ comisionCreada: comision }))
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
      attributes: ["id", "letra", "dias", "turno"],
      //Asocicación
      include: [
        {
          as: 'materia',
          model: models.materia,
          attributes: ['id', "nombre"]
        },
        {
          model: models.docente,
          attributes: ['id', "nombre", "apellido"]
        }
      ],
      where: { id }
    })
    .then(comision => (comision ? onSuccess(comision) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", validarToken, (req, res) => {
  findComision(req.params.id, {
    onSuccess: comision => res.send(comision),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", validarToken, (req, res) => {
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

router.delete("/:id", validarToken, (req, res) => {
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
