const { logger, loggerMeta } = require("./logger");
const validator = require('validator')

//Funciones auxiliares

//Respuesta a errores con log a consola y bd

//Mensajes que disparan 401
const noAutorizado = [
  'Contraseña incorrecta.',
  'Ingrese un email válido.',
  'Contraseña y nombre de usuario o email requerido.',
  'No existe token.',
  'Token inválido.'
]

//Responde y loguea según el error
const responderAlError = (error, req, res, id = 1, nombreEntidad = 'registro') => {
  if (error == "SequelizeUniqueConstraintError: Validation error") {
    res.status(400).send(`Error: Esx ${nombreEntidad} ya existe en la base de datos.`)
  } else if (noAutorizado.includes(error.message)) {
    res.status(401).send(`Error: ${error.message}`);
  } else if (error.message == ('Usuario no encontrado.')) {
    res.status(404).send(`Error: ${error.message}`);
  } else if (error.message == `No encontrado.`) {
    res.status(404).send(`Error: ${nombreEntidad} con id ${id} no encontrado.`);
  } else {
    res.status(500).send(`Error: ${error.message}`);
  }
  logger.error(`${error}`, loggerMeta(req, res));
}

/*
Búsqueda de registro por id: recibe un modelo a buscar, sus atributos, relaciones a incluir,
un id, y un nombre de la entidad
*/
const buscarRegistro = async (modelo, atributosABuscar, incluye, id) => {
  const registro = await modelo.findOne({
    attributes: atributosABuscar,
    //Asocicación
    include: incluye,
    where: { id }
  });
  if (!registro) {
    throw new Error(`No encontrado.`)
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
const comprobarAtributos = (atributosAComparar, req, esUpdate = false) => {
  const atributosBody = Object.keys(req.body)
  /**
   * Si no es una actualización, comprueba que haya la cantidad correcta de atributos en el req.body
   * para no entrar a iterar innecesariamente
   */
  if (!esUpdate) {
    if (atributosAComparar.length != atributosBody.length) {
      throw new Error('Atributos ingresados incorrectos.')
    }
  }
  /*
   * Condición a 'preguntar' en la iteración:
   * Por defecto, 'condición' indica si hay algún atributo no compatible (!=) en el req.body, comparando
   * con los declarados en el código.
   * Si se trata de una actualización, la condición pasa a ser que el o los atributos ingresados
   * en el req.body estén entre en los declarados en el código
   */
  const condicion = (indice) => {
    var condicion = atributosBody[indice] != atributosAComparar[indice]
    esUpdate ? condicion = !atributosAComparar.includes(atributosBody[i]) : condicion
    return condicion
  }
  //Itera sobre los atributos del req.body comprobando si se cumple la condición
  for (var i = 0; i < atributosBody.length; i++) {
    if (condicion(i)) {
      throw new Error('Atributos ingresados incorrectos.')
    }
  }
}

//Valida si un supuesto email tiene el formato correcto, de no ser así, lanza error
const validarEmail = (email) => {
  if (!validator.isEmail(email)) {
    throw new Error('Ingrese un email válido.')
  }
}

module.exports = { responderAlError, buscarRegistro, comprobarAtributos, validarEmail }