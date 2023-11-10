const express = require("express");
const router = express.Router();
const { obtenerTodosDocentes, obtenerDocPorId, registrarDocente, actualizarDocente, borrarDocente } = require("../controllers/docentesController");
const validarToken = require("../libs/validarToken");

/**
 * @openapi
 * 
 * /doc/:
 *   get:
 *     summary: Muestra todos los docentes registrados en la base de datos paginados (por defecto, de a 5 elementos por página).
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Docentes
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
 *                 "totalElementos":1,
 *                 "totalPaginas":1,
 *                 "paginaNro":1,
 *                 "elementos": [{
 *                   "id": 1,
 *                   "dni": 33789582,
 *                   "nombre": "Marcela",
 *                   "apellido": "Villalba",
 *                   "titulo": "Lic. en informática",
 *                   "fecha_nac": "1982-05-02",
 *                   "comisionesAsignadas": [{
 *                     "letra": "A",
 *                     "dias": "Lunes",
 *                     "turno": "Mañana",
 *                     "materia": { "id": 1, "nombre": "Organización de computadoras" }
 *                   }]
 *                 }]
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
 *     summary: Registra un nuevo docente en la base de datos.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Docentes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: {"dni": 33789582, "nombre": "Marcela", "apellido": "Villalba", "título": "Lic. en informática", "fecha_nac": "1982-05-02"}
 *     responses:
 *       201:
 *         description: Creado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {"estado":"Éxito al crear docente", "id":1}
 *       400:
 *         description: Bad request.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error, Esx docente ya existe en la base de datos.
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
 * /doc/{id}:
 *   get:
 *     summary: Busca y muestra un docente por su 'id'.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Docentes
 *     parameters:
 *       - name: id
 *         in: path
 *         description: El id del docente a mostrar.
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
 *                 "id": 1,
 *                 "dni": 33789582,
 *                 "nombre": "Marcela",
 *                 "apellido": "Villalba",
 *                 "titulo": "Lic. en informática",
 *                 "fecha_nac": "1982-05-02",
 *                 "comisionesAsignadas": [{
 *                   "letra": "A",
 *                   "dias": "Lunes",
 *                   "turno": "Mañana",
 *                   "materia": { "id": 1, "nombre": "Organización de computadoras" }
 *                 }]
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
 *               example: Error, docente con {id} no encontrado.
 *       5XX:
 *         description: Error en el servidor.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error interno del servidor.
 * 
 *   put:
 *     summary: Busca, actualiza y muestra un docente por su 'id'.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Docentes
 *     parameters:
 *       - name: id
 *         in: path
 *         description: El id del docente a actualizar.
 *         required: true
 *         squema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: {"nombre": "Mónica"}
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {
 *                 "estado":"Éxito al actualizar docente.",
 *                 "actualizado": {
 *                   "id": 1,
 *                   "dni": 33789582,
 *                   "nombre": "Mónica",
 *                   "apellido": "Villalba",
 *                   "titulo": "Lic. en informática",
 *                   "fecha_nac": "1982-05-02",
 *                   "comisionesAsignadas": [{
 *                     "letra": "A",
 *                     "dias": "Lunes",
 *                     "turno": "Mañana",
 *                     "materia": { "id": 1, "nombre": "Organización de computadoras" }
 *                   }],
 *                   "updatedAt":"2023-11-07T04:18:01.860Z"
 *                 }
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
 *               example: Error, docente con {id} no encontrado.
 *       5XX:
 *         description: Error en el servidor.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error interno del servidor.
 *   
 *   delete:
 *     summary: Busca un docente por su id y lo elimina de la base de datos.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Docentes
 *     parameters:
 *       - name: id
 *         in: path
 *         description: El id del docente a eliminar.
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
 *               example: Éxito al eliminar docente.
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
 *               example: Error, docente con {id} no encontrado.
 *       5XX:
 *         description: Error en el servidor.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error interno del servidor.
 */

//Mostrar todos los elementos de la tabla, paginados
router.get("/", validarToken, obtenerTodosDocentes);
//Obtener por id
router.get("/:id", validarToken, obtenerDocPorId);
//Crear registro con los valores del cuerpo de la petición
router.post("/", validarToken, registrarDocente);
//Actualizar por id
router.put("/:id", validarToken, actualizarDocente);
//Borrar por id
router.delete("/:id", validarToken, borrarDocente);

module.exports = router;