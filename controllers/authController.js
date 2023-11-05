require('dotenv').config();
const models = require("../models");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { logger, loggerMeta } = require('../libs/logger');
const { responderAlError, validarEmail } = require('../libs/helper');

const nombreEntidad = 'usuario'

async function registrarUsuario(req, res) {
  try {
    //Toma el nombre y la contraseña del cuerpo de la solicitud
    const { nombre, email, contraseña } = req.body;
    //Validar email
    validarEmail(email);
    //Crea un hash de la contraseña usando bcrypt
    const passHash = await bcrypt.hash(contraseña, 10);
    //Crea un nuevo usuario en la base de datos con el nombre y la contraseña
    const usuario = await models.usuario.create({
      nombre,
      email,
      contraseña: passHash
    });
    //Crea un token válido por 1h usando el id del usuario creado
    const id = usuario.id
    const token = jwt.sign(
      { id },
      process.env.SECRET_KEY,
      //Expira en 4 horas
      { expiresIn: 60 * 60 * 4 }
    );
    //Muestra un JSON con el token creado
    res.status(201).json({ estado: `Éxito al registrar ${nombreEntidad}. Usuario nuevo: ${nombre}.`, token });
    logger.info(`Éxito al registrar ${nombreEntidad}. Usuario nuevo: ${nombre}.`, loggerMeta(req, res));
  } catch (error) {
    //Envía respuestas de error y logs a consola y bd
    responderAlError(error, req, res, 1, nombreEntidad)
  }
}

async function iniciarSesion(req, res) {
  try {
    //Toma el nombre y la contraseña del cuerpo de la solicitud
    const { nombre, email, contraseña } = req.body;
    //Validaciones
    if (!(nombre || email) || !contraseña) { throw new Error('Contraseña y nombre de usuario o email requerido.') }
    if (!nombre && email) { validarEmail(email) }
    //Busca un usuario según se provea nombre o email en el req.body
    const usuario = await models.usuario.findOne({
      where:
        nombre ? { nombre } : { email }
    });
    //Si no encuentra el usuario, lanza error
    if (!usuario) {
      throw new Error('Usuario no encontrado.')
    }
    //Compara la contraseña especificada en el req.body con la almacenada en la db
    const esContraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    //Si la contraseña no es la misma, lanza error y no proporciona el token
    if (!esContraseñaValida) {
      throw new Error('Contraseña incorrecta.')
    }
    //Crea un token válido por 4h usando el id del usuario
    const id = usuario.id
    const token = jwt.sign(
      { id },
      process.env.SECRET_KEY,
      //Expira en 4 horas
      { expiresIn: 60 * 60 * 4 }
    );
    //Loguea y muestra un mensaje de éxito y el token creado
    res.status(200).json({ estado: `Éxito al iniciar sesión. Usuario autenticado: ${usuario.nombre}.`, token });
    logger.info(`Éxito al iniciar sesión. Usuario autenticado: ${usuario.nombre}`, loggerMeta(req, res));
  } catch (error) {
    //Envía respuestas de error y logs a consola y bd
    responderAlError(error, req, res);
  }
}

async function verCuenta(req, res) {
  try {
    //Busca al usuario logueado que está haciendo la solicitud por su id codificada en el token
    const usuario = await models.usuario.findOne({
      attributes: ["id", "nombre", "email"],
      where: { id: req.id }
    });

    //Muestra el usuario que tiene la sesión iniciada
    res.status(200).json({ estado: 'Éxito al mostrar cuenta.', usuario });
    logger.info(`Éxito al mostrar cuenta. Usuario: '${usuario.nombre}'`, loggerMeta(req, res));
  } catch (error) {
    responderAlError(error, req, res, req.id, nombreEntidad);
  }
}

function cerrarSesion(req, res) {
  //El token se borra del storage del navegador desde el front-end, y acá sólo envía una respuesta de éxito:
  res.status(200).send('Éxito al cerrar sesión.');
  logger.info('Éxito al cerrar sesión.', loggerMeta(req, res));
}

module.exports = { registrarUsuario, iniciarSesion, verCuenta, cerrarSesion }