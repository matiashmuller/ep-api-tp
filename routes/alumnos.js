const express = require("express");
const router = express.Router();
const { obtenerTodosAlumnos, obtenerAlumPorId, registrarAlumno, actualizarAlumno, borrarAlumno } = require("../controllers/alumnosController");
const validarToken = require("../libs/validarToken");

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: apiKey
 *       name: token
 *       in: header
 * 
 * /alum/:
 *   get:
 *     summary: Muestra todos los alumnos registrados en la base de datos paginados (por defecto, de a 5 elementos por página).
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Alumnos
 *     parameters:
 *       - name: pagina
 *         in: query
 *         description: El número de página a mostrar.
 *         squema:
 *           type: integer
 *       - name: cantPorPag
 *         in: query
 *         description: El número de elementos a mostrar por página.
 *         squema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
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
 *                                    {"id_materia": 1, "materia": { "nombre":"Matemática I" } },
 *                                    {"id_materia": 2, "materia": { "nombre":"Organización de computadoras" } }
 *                                  ]
 *                      }]
 *               }
 *       401:
 *         description: No autorizado.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error, token inválido
 *       5XX:
 *         description: Error del servidor.
 *         content:
 *           text/html:
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
 *             example: {"dni": 39666777,"nombre": "Ezequiel","apellido": "Agüero","fecha_nac": "1995-07-06","id_carrera": 1}
 *     responses:
 *       201:
 *         description: Creado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {"estado":"Éxito al crear alumno","id":1}
 *       400:
 *         description: Bad request.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error, Esx alumno ya existe en la base de datos.
 *       401:
 *         description: No autorizado.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error, token inválido
 *       5XX:
 *         description: Error del servidor.
 *         content:
 *           text/html:
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
 *       - name: id
 *         in: path
 *         description: El id del alumno a mostrar.
 *         required: true
 *         squema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {
 *                          "id": 1,
 *                          "dni": 45666777,
 *                          "nombre": "Ezequiel",
 *                          "apellido": "Agüero",
 *                          "fecha_nac": "1995-07-06",
 *                          "carreraQueEstudia": {"nombre":"Licenciatura en informática"},
 *                          "materiasQueCursa": [
 *                            {"id_materia": 1, "materia": { "nombre":"Matemática I" } },
 *                            {"id_materia": 2, "materia": { "nombre":"Organización de computadoras" } }
 *                          ]
 *               }
 *         
 *       401:
 *         description: No autorizado.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error, token inválido
 *       404:
 *         description: No encontrado.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error, alumno con {id} no encontrado.
 *       5XX:
 *         description: Error en el servidor.
 *         content:
 *           text/html:
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
 *     parameters:
 *       - name: id
 *         in: path
 *         description: El id del alumno a actualizar.
 *         required: true
 *         squema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: {"apellido": "López"}
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {
 *                          "estado":"Éxito al actualizar alumno.",
 *                          "actualizado": {
 *                            "id": 1,
 *                            "dni": 45666777,
 *                            "nombre": "Ezequiel",
 *                            "apellido": "López",
 *                            "fecha_nac": "1995-07-06",
 *                            "carreraQueEstudia": {"nombre":"Licenciatura en informática"},
 *                            "materiasQueCursa": [
 *                              {"id_materia": 1, "materia": { "nombre":"Matemática I" } },
 *                              {"id_materia": 2, "materia": { "nombre":"Organización de computadoras" } }
 *                            ],
 *                            "id_carrera":1,
 *                            "updatedAt":"2023-11-07T04:18:01.860Z"
 *                          }
 *               }
 *       401:
 *         description: No autorizado.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error, token inválido
 *       404:
 *         description: No encontrado.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error, alumno con {id} no encontrado.
 *       5XX:
 *         description: Error en el servidor.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error interno del servidor.
 *   
 *   delete:
 *     summary: Busca un alumno por su id y lo elimina de la base de datos.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Alumnos
 *     parameters:
 *       - name: id
 *         in: path
 *         description: El id del alumno a eliminar.
 *         required: true
 *         squema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Éxito al eliminar alumno.
 *       401:
 *         description: No autorizado.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error, token inválido
 *       404:
 *         description: No encontrado.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error, alumno con {id} no encontrado.
 *       5XX:
 *         description: Error en el servidor.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error interno del servidor.
 */

//Obtener todos los alumnos
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