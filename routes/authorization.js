const express = require("express");
const router = express.Router();
const validarToken = require('../libs/validarToken');
const { registrarUsuario, iniciarSesion, verCuenta, cerrarSesion } = require('../controllers/authController');

//Crear nuevo usuario
router.post('/registro', registrarUsuario);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Permite iniciar sesión con (nombre o email) y contraseña.
 *     tags:
 *       - Iniciar sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                nombre:
 *                  type: string
 *                  example: Ezequiel
 *                email:
 *                  type: string
 *                  example: eze@mail.com 
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
 *               properties:
 *                 estado:
 *                   type: string
 *                   example: Éxito al iniciar sesión. Usuario autenticado Ezequiel.
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjk5MzE1MDY5LCJleHAiOjE2OTkzMjk0Njl9.kD4V0jsaUkjeF4TOkOuTg7tdwexPGcrBctg2fCR-w68
 */
router.post('/login', iniciarSesion);
//Ver datos de la cuenta logueada
router.get('/cuenta', validarToken, verCuenta);
//Cerrar sesión
router.get('/logout', cerrarSesion);

module.exports = router;