require('dotenv').config();
var express = require("express");
var router = express.Router();
//var models = require("../models");
const validarToken = require('../libs/validarToken');

router.post('/registro', async (req, res) => {
    try {
        const { nombre, contraseña } = req.body; // Obtiene el nombre y la contraseña del cuerpo de la solicitud

        //const hashedPassword = await bcrypt.hash(contraseña, 10); // Genera un hash de la contraseña usando bcrypt

        // Crea un nuevo usuario en la base de datos con el nombre y la contraseña hashada
        await usuario.create({
            nombre,
            contraseña: /*hashedPassword*/contraseña
        }); 

        // Crea un token JWT (JSON Web Token)
        const token = jwt.sign({ nombre }, process.env.SECRET_KEY, {
            expiresIn: 60 * 60 * 24, // Expira en 24 horas
        });
        // Devuelve una respuesta JSON con el token generado
        res.json({ auth: true, token }); 
    } catch (e) {
        console.log(e);
        res.status(500).send('Hubo un problema al registrar su usuario'); // Devuelve un mensaje de error si ocurre un problema durante el registro
    }
});

//router.post('/iniciar', signinController);

//router.get('/perfil', validarToken, getProfile);

//router.get('/cerrar', logout);

module.exports = router;