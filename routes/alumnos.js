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
 * /alum/:
 *   get:
 *     summary: Muestra todos los alumnos registrados en la base de datos paginados (por defecto, de a 5 elementos por página).
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
 *                 totalPaginas:
 *                   type: integer
 *                 paginaNro:
 *                   type: integer
 *                 elementos:
 *                   type: array
 *               example: {
 *                      "totalElementos":1,
 *                      "totalPaginas":1,
 *                      "paginaNro":1,
 *                      "elementos": [{
 *                                  "id": 1,
 *                                  "dni": 45666777,
 *                                  "nombre": "Ezequiel",
 *                                  "apellido": "Agüero",
 *                                  "fecha_nac": "1995-07-06",
 *                                  "carreraQueEstudia": {"nombre":"Licenciatura en informática"},
 *                                  "materiasQueCursa": [
 *                                    {"nombre":"Matemática I","carga_horaria":8,"alumno_materia":{"id":1}},
 *                                    {"nombre":"Organización de computadoras","carga_horaria":8,"alumno_materia":{"id":2}}
 *                                  ]
 *                      }]
 *               }
 *       401:
 *         description: No autorizado.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Error, token inválido
 *       5XX:
 *         description: Error del servidor.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Error interno del servidor.
 * 
 * 
 *   post:
 *     summary: Registra un nuevo alumno en la base de datos.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Alumnos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                dni:
 *                  type: integer
 *                nombre:
 *                  type: string
 *                apellido:
 *                  type: string
 *                fecha_nac:
 *                  type: dateonly
 *                id_carrera:
 *                  type: integer
 *             example: {"dni": 39666777,"nombre": "Ezequiel","apellido": "Agüero","fecha_nac": "1995-07-06","id_carrera": 1}
 *     responses:
 *       201:
 *         description: Creado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: string
 *                 id:
 *                   type: integer
 *               example: {"estado":"Éxito al crear alumno","id":1}
 *       401:
 *         description: No autorizado.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Error, token inválido
 *       5XX:
 *         description: Error del servidor.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Error, Atributos ingresados incorrectos.
 * 
 * 
 * /alum/{id}:
 *   get:
 *     summary: Busca y muestra un alumno por su 'id'.
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
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Error, token inválido
 *       5XX:
 *         description: Error en el servidor.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Error interno del servidor.
 * 
 *   put:
 *     summary: Busca, actualiza y muestra un alumno por su 'id'.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Alumnos
 *   
 *   delete:
 *     summary: Busca un alumno por su id y lo elimina de la base de datos.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Alumnos
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