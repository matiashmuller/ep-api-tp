const { logger, loggerMeta } = require("./logger");
const validarToken = require("./validarToken");

//Funciones auxiliares parametrizadas para importar y evitar tanta repetición en las rutas

//Respuesta a errores con log a consola y bd
const responderAlError = (error, req, res, id, nombreEntidad) => {
  if (error == "SequelizeUniqueConstraintError: Validation error") {
    res.status(400).send('Bad request: Ya existe en la base de datos.')
  } else if (error.message == `${nombreEntidad} no encontrado.`) {
    res.status(404).send(`Error: ${nombreEntidad} con id ${id} no encontrado.`);
  } else {
    res.sendStatus(500)
  }
  logger.error(`${error}`, loggerMeta(req, res));
}

/*
Búsqueda de entidad por id: recibe un modelo a buscar, sus atributos, relaciones a incluir,
un id, y un nombre para la entidad
*/
const buscarEntidad = async (modelo, atributosABuscar, incluye, id, nombreEntidad) => {
  const entidad = await modelo.findOne({
    attributes: atributosABuscar,
    //Asocicación
    include: incluye,
    where: { id }
  });
  if (!entidad) {
    throw new Error(`${nombreEntidad} no encontrado.`)
  }
  return entidad;
};

//-------------------Métodos GET, POST, PUT, DELETE----------------------------------------------------------------------

//Mostrar todos los elementos de la tabla, paginados
const obtenerTodos = (router, modelo, atributosAMostrar, incluye, nombreEntidad) => {
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
        attributes: atributosAMostrar,
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
      const elementos = resp.rows;
      const totalPaginas = Math.ceil(totalElementos / cantPorPag);

      res.send({
        totalElementos,
        totalPaginas,
        paginaNro: pagina,
        elementos
      });
      logger.info(`Éxito al mostrar ${nombreEntidad}.`, loggerMeta(req, res));
    } catch (error) {
      responderAlError(error, req, res, 1, nombreEntidad);
    }
  });
}

//Obtener por id
const obtenerPorId = async (router, modelo, atributosABuscar, incluye, nombreEntidad) => {
  router.get("/:id", validarToken, async (req, res) => {
    try {
      const entidad = await buscarEntidad(modelo, atributosABuscar, incluye, req.params.id, nombreEntidad);
      res.json(entidad);
      logger.info(`Éxito al mostrar ${nombreEntidad}.`, loggerMeta(req, res));
    } catch (error) {
      responderAlError(error, req, res, req.params.id, nombreEntidad);
    }
  });
}

//Crear registro con los valores del cuerpo de la petición
const crearNuevo = (router, modelo, atributosACrear, nombreEntidad) => {
  router.post("/", validarToken, async (req, res) => {
    try {
      /*
      Itera tanta cantidad de veces como elementos en el array 'atributosACrear' haya 
      para comprobar que los atributos ingresados en el cuerpo de la solicitud 
      son los correctos. Es decir, que coinciden con los establecidos en el 
      código y en el registro de la entidad en la base de datos.
      */
      for (var i = 0; i < atributosACrear.length; i++) {
        if (atributosACrear[i] != Object.keys(req.body)[i]) {
          throw new Error('Atributos ingresados incorrectos.')
        }
      }
      /*
      Crea el nuevo registro a partir de los atributos y valores ingresados
      en el cuerpo de la solicitud
      */
      const entidad = await modelo.create(
        req.body
      );
      //Envía respuesta de creado, y loggea a consola y bd
      res.status(201).send({ estado: `Éxito al crear ${nombreEntidad}`, id: entidad.id });
      logger.info(`Éxito al registrar ${nombreEntidad}.`, loggerMeta(req, res));
    } catch (error) {
      responderAlError(error, req, res, 1, nombreEntidad);
    }
  });
}


//Actualizar, requiere id
const actualizarPorId = async (router, modelo, atributosABuscar, atributosAActualizar, incluye, nombreEntidad) => {
  router.put("/:id", validarToken, async (req, res) => {
    try {
      /*
      Hace una comprobación similar a la del método .put para comprobar que
      los atributos ingresados para actualizar el registro son los correctos
      */
      for (var i = 0; i < atributosAActualizar.length; i++) {
        if (atributosAActualizar[i] != Object.keys(req.body)[i]) {
          throw new Error('Atributos ingresados incorrectos.')
        }
      }
      //Busca la entidad a actualizar
      const entidad = await buscarEntidad(modelo, atributosABuscar, incluye, req.params.id, nombreEntidad);
      //Actualiza los valores de los atributos de la entidad con los del cuerpo de la petición
      await entidad.update(
        req.body, {
        fields: atributosAActualizar
      });
      //Envía respuesta de éxito y loguea a consola y bd
      res.status(200).json({ estado: `Éxito al actualizar ${nombreEntidad}`, actualizado: entidad });
      logger.info(`Éxito al actualizar ${nombreEntidad}`, loggerMeta(req, res));
    } catch (error) {
      responderAlError(error, req, res, req.params.id, nombreEntidad);
    }
  });
}

//Borrar, requiere id
const borrarPorId = async (router, modelo, atributos, incluye, nombreEntidad) => {
  router.delete("/:id", validarToken, async (req, res) => {
    try {
      //Busca la entidad a borrar
      const entidad = await buscarEntidad(modelo, atributos, incluye, req.params.id, nombreEntidad);
      //Borra la entidad
      await entidad.destroy();
      //Envía respuesta de éxito y loguea a consola y bd
      res.status(200).send(`Éxito al eliminar ${nombreEntidad}.`);
      logger.info(`Éxito al eliminar ${nombreEntidad}.`, loggerMeta(req, res));
    } catch (error) {
      responderAlError(error, req, res, req.params.id, nombreEntidad);
    }
  });
}

module.exports = { obtenerTodos, obtenerPorId, crearNuevo, actualizarPorId, borrarPorId }