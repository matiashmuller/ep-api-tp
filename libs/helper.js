const { logger, loggerMeta } = require("./logger");

//Funciones auxiliares parametrizadas para importar y evitar tanta repetición en las rutas

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

module.exports = { buscarEntidad, responderAlError }