require('dotenv').config();
var express = require("express");
var router = express.Router();
var models = require("../models");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validarToken = require('../libs/validarToken');

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
        //Crea un token válido por 24 hs
        const token = jwt.sign({ nombre }, process.env.SECRET_KEY, {
            expiresIn: 60 * 60 * 24, // Expira en 24 horas
        });
        //Muestra un JSON con el token creado (NECESARIO MOSTRAR EL TOKEN ACÁ???)
        res.json({ message: 'Usuario nuevo registrado', auth: true, token });
    } catch (e) {
        console.log(e);
        //Muestra mensaje si sucede un error
        res.status(500).send('Error al registrar usuario');
    }
});

//Iniciar sesión con usuario y contraseña
router.post('/login', async (req, res) => {
    //Toma el nombre y la contraseña del cuerpo de la solicitud
    const { nombre, contraseña } = req.body;
    //Validación de nombre: True si existe un usuario con el nombre dado, false caso contrario
    const existeUsuario = await models.usuario.findOne({ where: { nombre } });
    //Si no existe el usuario con ese nombre, muestra el error
    if (!existeUsuario) {
        return res.status(404).send('Usuario no encontrado');
    }
    //Validación de contraseña: True si la contraseña es la misma almacenada en la BD, false caso contrario
    const esContraseñaValida = await bcrypt.compare(contraseña, existeUsuario.contraseña);
    //Si la contraseña no es la misma, muestra error y no proporciona el token
    if (!esContraseñaValida) {
        return res.status(401).send({ message: 'Contraseña inválida', auth: false, token: null });
    }
    //Crear token válido por 24 hs
    const token = jwt.sign({ nombre }, process.env.SECRET_KEY, {
        expiresIn: 60 * 60 * 24,
    });
    //En caso de éxito al inciar sesión, muestra un mensaje de éxito y el token creado
    res.status(200).json({ message: 'Inicio de sesión exitoso', auth: true, token });
});

//router.get('/perfil', validarToken, getProfile);

//Cerrar sesión
router.get('/logout', async (req, res) => {
    res.status(200).send({ message: 'Sesión cerrada', auth: false, token: null });
});

module.exports = router;