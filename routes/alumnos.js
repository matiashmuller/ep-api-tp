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

  pagina = isNaN(pagina) || pagina <= 0? 1 : pagina;
  cantPorPag = isNaN(cantPorPag) || cantPorPag <= 0? 5 : cantPorPag;

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
      Paginación: Se muestran cantPorPag (5 por defecto) elementos por página,
      a partir de la página actual. Por defecto considera la página 1 como la primera.
      Ejemplo:
        Página 1 → Elementos 1 al 5
        Pagina 2 → Elementos 6 al 10
      */
      limit: cantPorPag,
      offset: (pagina-1) * (cantPorPag),
      distinct: true
    })
    .then(resp => {
      const totalElementos = resp.count;
      const alumnos = resp.rows;
      const totalPaginas = Math.ceil(totalElementos/cantPorPag);

      res.send({
        totalElementos,
        totalPaginas,
        paginaNro: pagina,
        alumnos
      })
    })
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
