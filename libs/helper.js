const { logger, loggerMeta } = require("./logger");
const validator = require('validator')
const modelos = require('../models')

//Funciones auxiliares

//Respuesta a errores según el error, con log a consola y bd
const responderAlError = (error, req, res, nombreEntidad = 'registro') => {
  //Mensajes que disparan 401
  const noAutorizado = [
    'Contraseña incorrecta.',
    'Ingrese un email válido.',
    'Contraseña y nombre de usuario o email requerido.',
    'No existe token.',
    'Token inválido.'
  ]

  if (error == "SequelizeUniqueConstraintError: Validation error") {
    res.status(400).send(`Error: Esx ${nombreEntidad} ya existe en la base de datos.`)
  } else if (noAutorizado.includes(error.message)) {
    res.status(401).send(`Error: ${error.message}`);
  } else if (error.message == ('Usuario no encontrado.')) {
    res.status(404).send(`Error: ${error.message}`);
  } else if (error.message == `No encontrado.`) {
    res.status(404).send(`Error: ${nombreEntidad} con id ${req.params.id} no encontrado.`);
  } else {
    res.status(500).send(`Error: ${error.message}`);
  }
  logger.error(`${error}`, loggerMeta(req, res));
}

/*
Búsqueda de registro por id: recibe un modelo a buscar, sus atributos, relaciones a incluir,
un id, y un nombre de la entidad.
Si encuentra el registro lo devuelve, si no, lanza error.
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
Luego itera preguntando la 'condición' para comprobar que los atributos ingresados en el 
cuerpo de la solicitud son los correctos. Es decir, que coinciden con los establecidos en el 
código y en el registro de la entidad en la base de datos.
Finalmente, si 'esAuth' (registro de nuevo usuario), valida el formato del email ingresado.
*/
const comprobarAtributos = (atributosAComparar, req, esUpdate = false, esAuth = false) => {
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
  //Si es un registro de usuario, valida el email
  if (esAuth) { validarEmail(req.body.email) }
}

//Comprueba la correctitud de atributos para loguearse (email o nombre + contraseña)
const comprobarLogin = (req) => {
  const { nombre, email, contraseña } = req.body;
  if (!(nombre || email) || !contraseña) { throw new Error('Contraseña y nombre de usuario o email requerido.') }
  if (email) { validarEmail(email) }
}

//Valida si un supuesto email tiene el formato correcto, de no ser así, lanza error
const validarEmail = (email) => {
  if (!validator.isEmail(email)) {
    throw new Error('Ingrese un email válido.')
  }
}

/**
 * Comprueba que la o las foreign keys ingresadas en el cuerpo de la petición referencian una 
 * clave primaria existente en la tabla correspondiente de la base de datos.
 */
const comprobarFKeys = async (req) => {
  const { id_alumno, id_docente, id_carrera, id_materia } = req.body;

  const fkeysYModelos = [
    [id_alumno, modelos.alumno, 'alumno'], 
    [id_docente, modelos.docente, 'docente'], 
    [id_carrera, modelos.carrera, 'carrera'], 
    [id_materia, modelos.materia, 'materia']
  ];

  for (const arr of fkeysYModelos) {
    const fkey = arr[0];
    if (fkey) {
      const modelo = arr[1]
      const nombreEntidad = arr[2]
      await comprobarExistencia(fkey, modelo, nombreEntidad);
    }
  }

  async function comprobarExistencia(idABuscar, modelo, nombreEntidad) {
    const registro = await modelo.findOne({ where: idABuscar });
    if (!registro) { 
      throw new Error(`Clave foránea inválida, no existe ${nombreEntidad} a referenciar con id ${idABuscar}.`) 
    }
  }

}

module.exports = { responderAlError, buscarRegistro, comprobarAtributos, comprobarLogin, comprobarFKeys }