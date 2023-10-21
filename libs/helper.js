const { logger, loggerMeta } = require("./logger");
const validarToken = require("./validarToken");

//Funciones auxiliares parametrizadas para importar y evitar tanta repetición en las rutas

//------------------------------------------------------------------------------------------------------------
//Mostrar todos los elementos de la tabla, paginados
const obtenerTodos = (router, modelo, atributos, incluye, nombreEntidad) => {
  router.get("/", validarToken, async (req, res) => {
    try {
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

      const resp = await modelo.findAndCountAll({
        attributes: atributos,
        //Asocicación
        include: incluye,
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
      });
      //Loguea y manda respuesta de éxito
      const totalElementos = resp.count;
      const filas = resp.rows;
      const totalPaginas = Math.ceil(totalElementos / cantPorPag);

      res.send({
        totalElementos,
        totalPaginas,
        paginaNro: pagina,
        filas
      });
      logger.info(`Éxito al mostrar ${nombreEntidad}.`, loggerMeta(req, res));
    } catch (error) {
      res.sendStatus(500)
      logger.error(`${error}`, loggerMeta(req, res));
    }
  });
}
/**
//Crear registro con los valores del cuerpo de la petición
const crearNuevo = (router, modelo, campos, nombreEntidad) => {

  camposExtraidos = {};

  router.post("/", validarToken, async (req, res) => {

    for (let i = 1; i < campos.length; i++) {
      camposExtraidos[campos[i]] = req.body.campos[i];
    }

    try {
      const entidad = await modelo.create(
        camposExtraidos
        /**
        const { dni, nombre, apellido, fecha_nac, id_carrera } = req.body;
        { dni,
        nombre,
        apellido,
        fecha_nac,
        id_carrera }
         *//**
);

res.status(201).send({ estado: `Éxito al crear ${nombreEntidad}`, id: entidad.id });
logger.info(`Éxito al registrar ${nombreEntidad}.`, loggerMeta(req, res));
} catch (error) {
if (error == "SequelizeUniqueConstraintError: Validation error") {
res.status(400).send('Bad request: Ya existe en la base de datos.')
}
else {
res.sendStatus(500)
}
logger.error(`${error}`, loggerMeta(req, res));
}
});
}


//Búsqueda de una entidad por id
const buscarEntidad = async (modelo, atributos, incluye, id, nombreEntidad) => {
  const entidad = await modelo.findOne({
    attributes: atributos,
    //Asocicación
    include: incluye,
    where: { id }
  });
  if (!entidad) {
    throw new Error(`${nombreEntidad} no encontrado.`)
  }
  return entidad;
};

//Respuesta a error para métodos que incluyen una búsqueda
const responderAlError = (error, req, res, id, nombreEntidad) => {
  if (error.message == `${nombreEntidad} no encontrado.`) {
    res.status(404).send(`Error: ${nombreEntidad} con id ${id} no encontrado.`);
  } else {
    res.sendStatus(500)
  }
  logger.error(`${error}`, loggerMeta(req, res));
}

//Obtener por id
const obtenerPorId = async (router, modelo, atributos, incluye, nombreEntidad) => {
  router.get("/:id", validarToken, async (req, res) => {
    try {
      const entidad = await buscarEntidad(modelo, atributos, incluye, req.params.id, nombreEntidad);
      res.json(entidad);
      logger.info(`Éxito al mostrar ${nombreEntidad}.`, loggerMeta(req, res));
    } catch (error) {
      responderAlError(error, req, res, req.params.id, nombreEntidad);
    }
  });
}

/**
//Actualizar, requiere id
router.put("/:id", validarToken, async (req, res) => {
  try {
    const alumno = await findAlumno(req.params.id);

    await alumno.update({
      dni: req.body.dni,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      fecha_nac: req.body.fecha_nac,
      id_carrera: req.body.id_carrera
    }, {
      fields: ["dni", "nombre", "apellido", "fecha_nac", "id_carrera"]
    });

    res.status(200).json({ estado: 'Éxito al actualizar alumno.', alumnoActualizado: alumno });
    logger.info('Éxito al actualizar alumno.', loggerMeta(req, res));
  } catch (error) {
    responderAlError(error, req, res, req.params.id, 'Alumno');
  }
});
 */

//Borrar, requiere id
const borrarPorId = async (router, modelo, atributos, incluye, nombreEntidad) => {
  router.delete("/:id", validarToken, async (req, res) => {
    try {
      const entidad = await buscarEntidad(modelo, atributos, incluye, req.params.id, nombreEntidad);

      await entidad.destroy();

      res.status(200).send(`Éxito al eliminar ${nombreEntidad}.`);
      logger.info(`Éxito al eliminar ${nombreEntidad}.`, loggerMeta(req, res));

    } catch (error) {
      responderAlError(error, req, res, req.params.id, nombreEntidad);
    }
  });
}

module.exports = { buscarEntidad, responderAlError, obtenerTodos, obtenerPorId, borrarPorId }