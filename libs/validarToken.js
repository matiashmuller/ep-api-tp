require('dotenv').config();
const jwt = require('jsonwebtoken');
const { logger, loggerMeta } = require('../libs/logger');

//Valida la existencia de un token y verifica su validez
module.exports = function validarToken(req, res, next) {
    //Obtiene el token desde el encabezado
    const token = req.headers['token'];
    //Si no existe token da error y muestra aviso en .json
    if (!token) {
        logger.error('Error de validación: No existe token.', loggerMeta(req, res));
        return res.status(401).json('Error de validación: No existe token.');
    }
    //Decodifica el token
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            logger.error('Error de validación: Token inválido.', loggerMeta(req, res));
            return res.status(401).json('Error de validación: Token inválido.');
        }
        /*
        Obtiene del token decodificado el nombre del usuario que está logueado y haciendo la petición,
        y lo guarda en req.nombre
        */
        req.nombre = decoded.nombre;
        //Continuar
        next();
    });
};