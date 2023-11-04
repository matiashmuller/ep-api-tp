const { logger, loggerMeta } = require("./logger");

//Funciones auxiliares

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
Búsqueda de registro por id: recibe un modelo a buscar, sus atributos, relaciones a incluir,
un id, y un nombre de la entidad
*/
const buscarRegistro = async (modelo, atributosABuscar, incluye, id, nombreEntidad) => {
  const registro = await modelo.findOne({
    attributes: atributosABuscar,
    //Asocicación
    include: incluye,
    where: { id }
  });
  if (!registro) {
    throw new Error(`${nombreEntidad} no encontrado.`)
  }
  return registro;
};

/*
Primero comprueba que las keys del cuerpo de la petición tienen la misma cantidad de
elementos que el array 'atributosAComprobar'.
Luego itera tanta cantidad de veces como elementos en el array 'atributosAComprobar' haya 
para comprobar que los atributos ingresados en el cuerpo de la solicitud 
son los correctos. Es decir, que coinciden con los establecidos en el 
código y en el registro de la entidad en la base de datos.
*/
const comprobarAtributos = (atributosAComprobar, req) => {
  if (atributosAComprobar.length != Object.keys(req.body).length) {
    throw new Error('Atributos ingresados incorrectos.')
  }
  for (var i = 0; i < atributosAComprobar.length; i++) {
    if (atributosAComprobar[i] != Object.keys(req.body)[i]) {
      throw new Error('Atributos ingresados incorrectos.')
    }
  }
}

module.exports = { responderAlError, buscarRegistro, comprobarAtributos }