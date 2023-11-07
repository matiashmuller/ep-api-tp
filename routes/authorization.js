const express = require("express");
const router = express.Router();
const validarToken = require('../libs/validarToken');
const { registrarUsuario, iniciarSesion, verCuenta, cerrarSesion } = require('../controllers/authController');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Permite iniciar sesión con (nombre o email) y contraseña.
 *     tags:
 *       - Authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                nombre:
 *                  type: string
 *                  example: Matías
 *                email:
 *                  type: string
 *                  example: matias@mail.com 
 *                contraseña:
 *                  type: string
 *                  example: 1234
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {
 *                       "estado":"Éxito al iniciar sesión. Usuario autenticado Matías.",
 *                       "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjk5MzI5OTg1LCJleHAiOjE2OTkzNDQzODV9.GCwpHIhRH930NASgLGvIMHp7732YwhzRt20R_-sBJAM"
 *               }
 */

//Crear nuevo usuario
router.post('/registro', registrarUsuario);
//Iniciar sesión
router.post('/login', iniciarSesion);
//Ver datos de la cuenta logueada
router.get('/cuenta', validarToken, verCuenta);
//Cerrar sesión
router.get('/logout', cerrarSesion);

module.exports = router;