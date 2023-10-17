require('dotenv').config();
var express = require("express");
var router = express.Router();
var models = require("../models");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validarToken = require('../libs/validarToken');
const { logger, loggerMeta } = require('../libs/logger');


//Crear nuevo usuario
router.post('/registro', async (req, res) => {
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
        logger.info(`Éxito al registrar usuario. Usuario nuevo: ${nombre}.`, loggerMeta(req, res));
        res.status(200).json({ message: `Éxito al registrar usuario. Usuario nuevo: ${nombre}.`, token });
    } catch (error) {
        //Envía respuestas de error y logs a consola y bd
        if (error == "SequelizeUniqueConstraintError: Validation error") {
            logger.error('Error al registrar usuario: El nombre de usuario ya está en uso.', loggerMeta(req, res));
            res.status(400).send('Error al registrar usuario: El nombre de usuario ya está en uso.');
        } else {
            logger.error('Error al registrar usuario.', loggerMeta(req, res));
            res.status(500).send('Error al registrar usuario.');
        }
    }
});

//Iniciar sesión con usuario y contraseña
router.post('/login', async (req, res) => {
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
        logger.info(`Éxito al iniciar sesión. Usuario autenticado: ${nombre}`, loggerMeta(req,res));
        res.status(200).json({ message: `Éxito al iniciar sesión. Usuario autenticado: ${nombre}.`, token });
    } catch (error) {
        //Envía respuestas de error y logs a consola y bd
        if (error.message == 'Usuario no encontrado.') {
            logger.error(`Error al iniciar sesión: Usuario '${req.body.nombre}' no encontrado.`, loggerMeta(req, res));
            res.status(404).send(`Error: Usuario '${req.body.nombre}' no encontrado.`); 
        } else if (error.message == 'Contraseña incorrecta.') {
            logger.error('Error al iniciar sesión: Contraseña incorrecta.', loggerMeta(req, res));
            res.status(401).send('Error: Contraseña incorrecta.');
        } else {
            logger.error('Error al iniciar sesión: Error en el servidor.', loggerMeta(req, res));
            res.status(500).send('Error al iniciar sesión.');
        }
    }
});

//Ver datos de la cuenta logueada
router.get('/cuenta', validarToken, async (req, res) => {
    //Busca al usuario logueado que está haciendo la solicitud por su nombre codificado en el token
    const usuario = await models.usuario.findOne({
        attributes: ["id", "nombre"],
        where: { nombre: req.nombre }
    });

    /*
    Considerar este error y comprobación? La validación ya la hace 'validarToken'
    //Si ningún usuario se corresponde con los datos del token (nombre), muestra error
    //Puede suceder por ejemplo si se usa un token aún válido, pero que fue dado a un usuario que fue eliminado
    if (!usuario) {
        return res.status(404).send('Ningún usuario se corresponde con el token.');
        logger.error('Error al mostrar cuenta: el usuario no coincide con el token.', loggerMeta(req, res));
    }
    */

    //Muestra el usuario que tiene la sesión iniciada
    logger.info(`Éxito al mostrar cuenta. Usuario: '${req.nombre}'`, loggerMeta(req, res));
    res.status(200).json(usuario);
});

//Cerrar sesión
router.get('/logout', async (req, res) => {
    //El token se borra del storage del navegador desde el front-end, y acá sólo envía una respuesta de éxito:
    logger.info('Éxito al cerrar sesión.', loggerMeta(req, res));
    res.status(200).send('Éxito al cerrar sesión.');
});

module.exports = router;