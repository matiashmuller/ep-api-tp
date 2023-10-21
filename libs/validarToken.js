require('dotenv').config();
const jwt = require('jsonwebtoken');
const { logger, loggerMeta } = require('../libs/logger');

//Valida la existencia de un token y verifica su validez
module.exports = function validarToken(req, res, next) {
    try {
        //Obtiene el token desde el encabezado
        const token = req.headers['token'];
        //Si no existe token da error y muestra aviso en .json
        if (!token) {
            throw new Error ('No existe token.')
        }
        //Decodifica el token
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                throw new Error ('Token inválido.')
            }
            /*
            Obtiene del token decodificado el nombre del usuario que está logueado y haciendo la petición,
            y lo guarda en req.nombre
            */
            req.nombre = decoded.nombre;
            //Continuar
            next();
        });
    } catch (error) {
        res.status(401).json('Error de validación: Token inválido o inexistente.');
        logger.error(`${error}`, loggerMeta(req, res));
    }
};