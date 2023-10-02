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

  models.docente
    .findAndCountAll({
      attributes: ["id", "dni", "nombre", "apellido", "titulo", "fecha_nac"],
      //Asocicación
      include: [
        {
          as: 'materiasQueDicta',
          model: models.materia,
          attributes: ["id", "nombre", "carga_horaria"],
          through: { attributes: ["letra", "dias", "turno"] }
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
      const docentes = resp.rows;
      const totalPaginas = Math.ceil(totalElementos/cantPorPag);

      res.send({
        totalElementos,
        totalPaginas,
        paginaNro: pagina,
        docentes
      })
    })
    .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
  models.docente
    .create({
      dni: req.body.dni,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      titulo: req.body.titulo,
      fecha_nac: req.body.fecha_nac
    })
    .then(docente => res.status(201).send({ id: docente.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otro docente con el mismo dni')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findDocente = (id, { onSuccess, onNotFound, onError }) => {
  models.docente
    .findOne({
      attributes: ["id", "dni", "nombre", "apellido", "titulo", "fecha_nac"],
      //Asocicación
      include: [
        {
          as: 'materiasQueDicta',
          model: models.materia,
          attributes: ["id", "nombre", "carga_horaria"],
          through: { attributes: ["letra", "dias", "turno"] }
        }
      ],
      where: { id }
    })
    .then(docente => (docente ? onSuccess(docente) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findDocente(req.params.id, {
    onSuccess: docente => res.send(docente),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = docente =>
    docente
      .update({
        dni: req.body.dni,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        titulo: req.body.titulo,
        fecha_nac: req.body.fecha_nac
      }, { fields: ["dni", "nombre", "apellido", "titulo", "fecha_nac"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otro docente con el mismo dni')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
  findDocente(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = docente =>
    docente
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findDocente(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
