const express = require("express");
const router = express.Router();
const validarToken = require('../libs/validarToken');
const { registrarUsuario, iniciarSesion, verCuenta, cerrarSesion } = require('../controllers/authController');

/**
 * @openapi
 * 
 * /auth/registro/:
 *   post:
 *     summary: Permite registrar un nuevo usuario con nombre, email y contraseña.
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
 *       201:
 *         description: Creado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {
 *                       "estado":"Éxito al registrar usuario. Usuario nuevo: Matías.",
 *                       "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjk5MzI5OTg1LCJleHAiOjE2OTkzNDQzODV9.GCwpHIhRH930NASgLGvIMHp7732YwhzRt20R_-sBJAM"
 *               }
 *       400:
 *         description: Bad request.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error, Esx usuario ya existe en la base de datos.
 *       401:
 *         description: No autorizado.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error, ingrese un email válido.
 *       5XX:
 *         description: Error en el servidor.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error interno del servidor.
 * 
 * 
 * /auth/login/:
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
 *       401:
 *         description: No autorizado.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error, contraseña incorrecta.
 *       404:
 *         description: No encontrado.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error, usuario no encontrado.
 *       5XX:
 *         description: Error en el servidor.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error interno del servidor.
 * 
 * /auth/cuenta/:
 *   get:
 *     summary: Permite ver la 'cuenta' del usuario que tiene la sesión iniciada.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Authorization
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {
 *                         "estado": "Éxito al mostrar cuenta.",
 *                         "usuario": {
 *                           "id": 1,
 *                           "nombre": "Matías",
 *                           "email": "matias@mail.com"
 *                         }
 *               }
 *       404:
 *         description: No encontrado.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error, usuario no encontrado.
 *       5XX:
 *         description: Error en el servidor.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error interno del servidor.
 * 
 * /auth/logout/:
 *   get:
 *     summary: Cierra la sesión de usuario.
 *     tags:
 *       - Authorization
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Éxito al cerrar sesión.
 *       5XX:
 *         description: Error en el servidor.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error interno del servidor.
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