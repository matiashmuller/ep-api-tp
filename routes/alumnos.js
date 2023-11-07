const express = require("express");
const router = express.Router();
const { obtenerTodosAlumnos, obtenerAlumPorId, registrarAlumno, actualizarAlumno, borrarAlumno } = require("../controllers/alumnosController");
const validarToken = require("../libs/validarToken");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: apiKey
 *       name: token
 *       in: header
 */
/**
 * @openapi
 * /alum:
 *   get:
 *     summary: Muestra todos los alumnos registrados en la base de datos paginados, por defecto, de a 5 elementos por página.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Alumnos
 *     parameters:
 *       - in: query
 *         name: pagina
 *         squema:
 *           type: integer
 *         description: El número de página a mostrar.
 *       - in: query
 *         name: cantPorPag
 *         squema:
 *           type: integer
 *         description: El número de elementos a mostrar por página.
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalElementos:
 *                   type: integer
 *                   example: 1
 *                 totalPaginas:
 *                   type: integer
 *                   example: 1
 *                 paginaNro:
 *                   type: integer
 *                   example: 1
 *                 elementos:
 *                   type: array 
 *                   items:
 *                     $ref: "#/components/schemas/alumno"
 *       401:
 *         description: Acceso no autorizado, token inválido o inexistente.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error, token inválido
 *       5XX:
 *         description: Error en el servidor.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error interno del servidor.
 */
router.get("/", validarToken, obtenerTodosAlumnos);
//Obtener por id
router.get("/:id", validarToken, obtenerAlumPorId);
//Crear registro con los valores del cuerpo de la petición
router.post("/", validarToken, registrarAlumno);
//Actualizar por id
router.put("/:id", validarToken, actualizarAlumno);
//Borrar por id
router.delete("/:id", validarToken, borrarAlumno);

module.exports = router;