require('dotenv').config();
var express = require("express");
var router = express.Router();
var models = require("../models");
const jwt = require('jsonwebtoken');
const validarToken = require('../libs/validarToken');

router.post('/registro', async (req, res) => {
    try {
        //Toma el nombre y la contraseña del cuerpo de la solicitud
        const { nombre, contraseña } = req.body; 

        //const hashedPassword = await bcrypt.hash(contraseña, 10); // Genera un hash de la contraseña usando bcrypt

        //Crea un nuevo usuario en la base de datos con el nombre y la contraseña
        await models.usuario.create({
            nombre,
            contraseña: /*hashedPassword*/contraseña
        }); 

        //Crea un token
        const token = jwt.sign({ nombre }, process.env.SECRET_KEY, {
            expiresIn: 60 * 60 * 24, // Expira en 24 horas
        });
        //Muestra un JSON con el token creado
        res.json({ auth: true, token }); 
    } catch (e) {
        console.log(e);
        //Muestra mensaje si sucede un error
        res.status(500).send('Error al registrar usuario');
    }
});

//router.post('/iniciar', signinController);

//router.get('/perfil', validarToken, getProfile);

//router.get('/cerrar', logout);

module.exports = router;