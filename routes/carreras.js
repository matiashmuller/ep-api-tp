const express = require("express");
const router = express.Router();
const { obtenerTodasCarreras, obtenerCarreraPorId, registrarCarrera, actualizarCarrera, borrarCarrera } = require("../controllers/carrerasController");
const validarToken = require("../libs/validarToken");

/**
 * @openapi
 * 
 * /car/:
 *   get:
 *     summary: Muestra todas las carreras registradas en la base de datos paginadas (por defecto, de a 5 elementos por página).
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Carreras
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
 *                      "totalElementos": 1,
 *                      "totalPaginas": 1,
 *                      "paginaNro": 1,
 *                      "elementos": [{
 *                        "id": 1,
 *                        "nombre": "Licenciatura en informática",
 *                        "materiasIncluidas": [
 *                          {"id_materia": 1, "materia": { "nombre":"Matemática I" } },
 *                          {"id_materia": 2, "materia": { "nombre":"Organización de computadoras" } }
 *                        ],
 *                        "alumnosInscriptos": [
 *                          { "dni": 42565852, "nombre": "Ezequiel", "apellido": "Agüero" }
 *                        ]
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
 *     summary: Registra una nueva carrera en la base de datos.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Carreras
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: { "nombre": "Licenciatura en informática" }
 *     responses:
 *       201:
 *         description: Creado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {"estado":"Éxito al crear carrera","id":1}
 *       400:
 *         description: Bad request.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error, Esx carrera ya existe en la base de datos.
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
 * /car/{id}:
 *   get:
 *     summary: Busca y muestra una carrera por su 'id'.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Carreras
 *     parameters:
 *       - name: id
 *         in: path
 *         description: El id de la carrera a mostrar.
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
 *                         "id": 1,
 *                         "nombre": "Licenciatura en informática",
 *                         "materiasIncluidas": [
 *                           {"id_materia": 1, "materia": { "nombre":"Matemática I" } },
 *                           {"id_materia": 2, "materia": { "nombre":"Organización de computadoras" } }
 *                         ],
 *                         "alumnosInscriptos": [
 *                           { "dni": 42565852, "nombre": "Ezequiel", "apellido": "Agüero" }
 *                         ]
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
 *               example: Error, carrera con {id} no encontrado.
 *       5XX:
 *         description: Error en el servidor.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error interno del servidor.
 * 
 *   put:
 *     summary: Busca, actualiza y muestra una carrera por su 'id'.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Carreras
 *     parameters:
 *       - name: id
 *         in: path
 *         description: El id de la carrera a actualizar.
 *         required: true
 *         squema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: { "nombre": "Licenciatura en sistemas" }
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {
 *                          "estado":"Éxito al actualizar carrera.",
 *                          "actualizado": {
 *                            "id": 1,
 *                            "nombre": "Licenciatura en sistemas",
 *                            "materiasIncluidas": [
 *                              {"id_materia": 1, "materia": { "nombre":"Matemática I" } },
 *                              {"id_materia": 2, "materia": { "nombre":"Organización de computadoras" } }
 *                            ],
 *                            "alumnosInscriptos": [
 *                              { "dni": 42565852, "nombre": "Ezequiel", "apellido": "Agüero" }
 *                            ],
 *                            "updatedAt": "2023-11-08T00:26:14.672Z"
 *                          }
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
 *               example: Error, carrera con {id} no encontrado.
 *       5XX:
 *         description: Error en el servidor.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error interno del servidor.
 *   
 *   delete:
 *     summary: Busca una carrera por su id y la elimina de la base de datos.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Carreras
 *     parameters:
 *       - name: id
 *         in: path
 *         description: El id de la carrera a eliminar.
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
 *               example: Éxito al eliminar carrera.
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
 *               example: Error, carrera con {id} no encontrado.
 *       5XX:
 *         description: Error en el servidor.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error interno del servidor.
 */

//Mostrar todos los elementos de la tabla, paginados
router.get("/", validarToken, obtenerTodasCarreras);
//Obtener por id
router.get("/:id", validarToken, obtenerCarreraPorId);
//Crear registro con los valores del cuerpo de la petición
router.post("/", validarToken, registrarCarrera);
//Actualizar por id
router.put("/:id", validarToken, actualizarCarrera);
//Borrar por id
router.delete("/:id", validarToken, borrarCarrera);

module.exports = router;