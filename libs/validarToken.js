require('dotenv').config();
const jwt = require('jsonwebtoken');

//Valida la existencia de un token y verifica su validez
module.exports = function validarToken(req, res, next) {
    //Obtiene el token desde el encabezado
    const token = req.headers['x-access-token'];
    //Si no existe token da error y muestra aviso en .json
    if (!token) {
        return res.status(401).json({ auth: false, message: 'No existe token' });
    }
    //Decodifica el token
    jwt.verify(token, process.env.SECRET_KEY, (err, deco) => {
        if (err) {
            return res.status(401).json({ auth: false, message: 'Token inválido' });
        }
        //Guardar el ID del usuario decodificado en req.userId
        //req.userId = deco.id;
        //Continuar
        next();
    });
};