require('dotenv').config();
const jwt = require('jsonwebtoken');
const logger = require('../libs/logger');

//Valida la existencia de un token y verifica su validez
module.exports = function validarToken(req, res, next) {
    //Obtiene el token desde el encabezado
    const token = req.headers['token'];
    //Si no existe token da error y muestra aviso en .json
    if (!token) {
        logger.error('Error de validación.', {
            motivo: 'No existe un token.',
            cod: '401'
        });
        return res.status(401).json({ auth: false, message: 'No existe token' });
    }
    //Decodifica el token
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            logger.error('Error de validación.', {
                motivo: 'El token es inválido.',
                cod: '401'
            });
            return res.status(401).json({ auth: false, message: 'Token inválido' });
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