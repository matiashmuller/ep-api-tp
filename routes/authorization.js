const express = require("express");
const router = express.Router();
const validarToken = require('../libs/validarToken');
const { registrarUsuario, iniciarSesion, verCuenta, cerrarSesion } = require('../controllers/authController');

//Crear nuevo usuario
router.post('/registro', registrarUsuario);
//Iniciar sesión con usuario y contraseña
router.post('/login', iniciarSesion);
//Ver datos de la cuenta logueada
router.get('/cuenta', validarToken, verCuenta);
//Cerrar sesión
router.get('/logout', cerrarSesion);

module.exports = router;