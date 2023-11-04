require('dotenv').config();
const models = require("../models");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { logger, loggerMeta } = require('../libs/logger');
const { responderAlError } = require('../libs/helper');

async function registrarUsuario(req, res) {
  try {
    //Toma el nombre y la contraseña del cuerpo de la solicitud
    const { nombre, contraseña } = req.body;
    //Crea un hash de la contraseña usando bcrypt
    const passHash = await bcrypt.hash(contraseña, 10);
    //Crea un nuevo usuario en la base de datos con el nombre y la contraseña
    await models.usuario.create({
      nombre,
      contraseña: passHash
    });
    //Crea un token válido por 1h usando el nombre de usuario elegido
    const token = jwt.sign(
      { nombre },
      process.env.SECRET_KEY,
      //Expira en una hora
      { expiresIn: 60 * 60 }
    );
    //Muestra un JSON con el token creado
    res.status(200).json({ message: `Éxito al registrar usuario. Usuario nuevo: ${nombre}.`, token });
    logger.info(`Éxito al registrar usuario. Usuario nuevo: ${nombre}.`, loggerMeta(req, res));
  } catch (error) {
    //Envía respuestas de error y logs a consola y bd
    if (error == "SequelizeUniqueConstraintError: Validation error") {
      res.status(400).send('Error al registrar usuario: El nombre de usuario ya está en uso.');
    } else {
      res.status(500).send('Error al registrar usuario.');
    }
    logger.error(`${error}`, loggerMeta(req, res));
  }
}

async function iniciarSesion(req, res) {
  try {
    //Toma el nombre y la contraseña del cuerpo de la solicitud
    const { nombre, contraseña } = req.body;
    //Validación de nombre: True si existe un usuario con el nombre dado, false caso contrario
    const usuario = await models.usuario.findOne({ where: { nombre } });
    //Si no existe el usuario con ese nombre, muestra el error
    if (!usuario) {
      throw new Error('Usuario no encontrado.')
    }
    //Validación de contraseña: True si la contraseña es la misma almacenada en la BD, false caso contrario
    const esContraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    //Si la contraseña no es la misma, muestra error y no proporciona el token
    if (!esContraseñaValida) {
      throw new Error('Contraseña incorrecta.')
    }
    //Crea un token válido por 1h usando el nombre de usuario ingresado
    const token = jwt.sign(
      { nombre },
      process.env.SECRET_KEY,
      //Expira en una hora
      { expiresIn: 60 * 60 }
    );
    //Loguea y muestra un mensaje de éxito y el token creado
    res.status(200).json({ message: `Éxito al iniciar sesión. Usuario autenticado: ${nombre}.`, token });
    logger.info(`Éxito al iniciar sesión. Usuario autenticado: ${nombre}`, loggerMeta(req, res));
  } catch (error) {
    //Envía respuestas de error y logs a consola y bd
    if (error.message == 'Usuario no encontrado.') {
      res.status(404).send(`Error: Usuario '${req.body.nombre}' no encontrado.`);
    } else if (error.message == 'Contraseña incorrecta.') {
      res.status(401).send('Error: Contraseña incorrecta.');
    } else {
      res.status(500).send(`Error al iniciar sesión.`);
    }
    logger.error(`${error}`, loggerMeta(req, res));
  }
}

async function verCuenta(req, res) {
  try {
    //Busca al usuario logueado que está haciendo la solicitud por su nombre codificado en el token
    const usuario = await models.usuario.findOne({
      attributes: ["id", "nombre"],
      where: { nombre: req.nombre }
    });

    //Muestra el usuario que tiene la sesión iniciada
    res.status(200).json(usuario);
    logger.info(`Éxito al mostrar cuenta. Usuario: '${req.nombre}'`, loggerMeta(req, res));
  } catch (error) {
    responderAlError(error, req, res, req.params.id, nombreEntidad);
  }
}

function cerrarSesion(req, res) {
  //El token se borra del storage del navegador desde el front-end, y acá sólo envía una respuesta de éxito:
  res.status(200).send('Éxito al cerrar sesión.');
  logger.info('Éxito al cerrar sesión.', loggerMeta(req, res));
}

module.exports = { registrarUsuario, iniciarSesion, verCuenta, cerrarSesion }