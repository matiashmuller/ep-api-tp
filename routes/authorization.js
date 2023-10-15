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
        //Crea un token válido por 1h usando el nombre de usuario elegido
        const token = jwt.sign(
            { nombre }, 
            process.env.SECRET_KEY,
            //Expira en una hora
            { expiresIn: 60 * 60 }
        );
        //Muestra un JSON con el token creado
        res.json({ message: 'Usuario nuevo registrado', auth: true, token });
    } catch (e) {
        console.log(e);
        e == "SequelizeUniqueConstraintError: Validation error"?
            res.status(400).send('Bad request: Ese nombre de usuario ya está en uso')
        :
            res.status(500).send('Error al registrar usuario');
    }
});

//Iniciar sesión con usuario y contraseña
router.post('/login', async (req, res) => {
    //Toma el nombre y la contraseña del cuerpo de la solicitud
    const { nombre, contraseña } = req.body;
    //Validación de nombre: True si existe un usuario con el nombre dado, false caso contrario
    const usuario = await models.usuario.findOne({ where: { nombre } });
    //Si no existe el usuario con ese nombre, muestra el error
    if (!usuario) { return res.status(404).send('Usuario no encontrado'); }
    //Validación de contraseña: True si la contraseña es la misma almacenada en la BD, false caso contrario
    const esContraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    //Si la contraseña no es la misma, muestra error y no proporciona el token
    if (!esContraseñaValida) {
        return res.status(401).send({ message: 'Contraseña inválida', auth: false, token: null });
    }
    //Crea un token válido por 1h usando el nombre de usuario ingresado
    const token = jwt.sign(
        { nombre }, 
        process.env.SECRET_KEY,
        //Expira en una hora
        { expiresIn: 60 * 60 }
    );
    //Muestra un mensaje de éxito y el token creado
    res.status(200).json({ message: 'Inicio de sesión exitoso', auth: true, token });
});

//Cerrar sesión
router.get('/logout', async (req, res) => {
    res.status(200).send({ message: 'Sesión cerrada', auth: false, token: null });
});

//Ver datos de la cuenta logueada
router.get('/cuenta', validarToken, async (req, res) => {
    //Busca al usuario logueado que está haciendo la solicitud por su nombre codificado en el token
    const usuario = await models.usuario.findOne({
        attributes: ["id", "nombre"],
        where: { nombre : req.nombre }
    });
    //Si nadie ha iniciado sesión, devuelve error
    if (!usuario) {
        return res.status(404).send('Ningún usuario ha iniciado sesión.');
    }
    //Muestra el usuario que ha iniciado sesión
    res.status(200).json(usuario);
});

module.exports = router;