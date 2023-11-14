require('dotenv').config();
const jwt = require('jsonwebtoken');
const { responderAlError } = require('./helper');

//Valida la existencia de un token y verifica su validez
module.exports = function validarToken(req, res, next) {
  //Si el ambiente es desarrollo, hace la validación
  if (process.env.NODE_ENV === 'development') {
    try {
      //Obtiene el token desde el encabezado
      const token = req.headers['token'];
      //Si no existe token da error y muestra aviso en .json
      if (!token) { throw new Error('No existe token.') }
      //Decodifica el token
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) { throw new Error('Token inválido.') }
        /*
        Obtiene del token decodificado el id del usuario que está logueado y haciendo la petición,
        y lo guarda en req.id
        */
        req.id = decoded.id;
        //Continuar
        next();
      });
    } catch (error) {
      responderAlError(error, req, res);
    }
    //Sino (si es ambiente de prueba), saltea la validación
  } else {
    next();
  }
};