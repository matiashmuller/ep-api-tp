const express = require("express");
const router = express.Router();
const { obtenerTodasAlMat, obtenerAlMatPorId, borrarAlMat, registrarAlMat, actualizarAlMat } = require("../controllers/alum_matController");
const validarToken = require("../libs/validarToken");

/**
 * @openapi
 * 
 * /almat/:
 *   get:
 *     summary: Muestra todas las relaciones alumno/materia registradas en la base de datos paginadas (por defecto, de a 5 elementos por página).
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Relación Alumno/Materia
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
 *                 "totalElementos": 1,
 *                 "totalPaginas": 1,
 *                 "paginaNro": 1,
 *                 "elementos": [{
 *                   "id": 1,
 *                   "alumno": { "id": 1, "nombre": "Ezequiel", "apellido": "Agüero" },
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
 *     summary: Registra una nueva alumno_materia en la base de datos.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Relación Alumno/Materia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: {"id_alumno": 1,"id_materia": 1}
 *     responses:
 *       201:
 *         description: Creado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {"estado":"Éxito al crear alumno_materia","id":1}
 *       400:
 *         description: Bad request.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error, Esx alumno_materia ya existe en la base de datos.
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
 * /almat/{id}:
 *   get:
 *     summary: Busca y muestra una alumno_materia por su 'id'.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Relación Alumno/Materia
 *     parameters:
 *       - name: id
 *         in: path
 *         description: El id de la alumno_materia a mostrar.
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
 *                 "alumno": { "id": 1, "nombre": "Ezequiel", "apellido": "Agüero" },
 *                 "materia": { "id": 1, "nombre": "Organización de computadoras" }
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
 *               example: Error, alumno_materia con {id} no encontrado.
 *       5XX:
 *         description: Error en el servidor.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error interno del servidor.
 * 
 *   put:
 *     summary: Busca, actualiza y muestra una alumno_materia por su 'id'.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Relación Alumno/Materia
 *     parameters:
 *       - name: id
 *         in: path
 *         description: El id de la alumno_materia a actualizar.
 *         required: true
 *         squema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: { "id_alumno": 2 }
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {
 *                 "estado":"Éxito al actualizar alumno_materia.",
 *                 "actualizado": {
 *                   "id": 1,
 *                   "alumno": { "id": 2, "nombre": "Manuel", "apellido": "Ibáñez" },
 *                   "materia": { "id": 1, "nombre": "Organización de computadoras" },
 *                   "id_alumno": 2,
 *                   "updatedAt": "2023-11-08T00:26:14.672Z"
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
 *               example: Error, alumno_materia con {id} no encontrado.
 *       5XX:
 *         description: Error en el servidor.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error interno del servidor.
 *   
 *   delete:
 *     summary: Busca una alumno_materia por su id y la elimina de la base de datos.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Relación Alumno/Materia
 *     parameters:
 *       - name: id
 *         in: path
 *         description: El id de la alumno_materia a eliminar.
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
 *               example: Éxito al eliminar alumno_materia.
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
 *               example: Error, alumno_materia con {id} no encontrado.
 *       5XX:
 *         description: Error en el servidor.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error interno del servidor.
 */

//Mostrar todos los elementos de la tabla, paginados
router.get("/", validarToken, obtenerTodasAlMat);
//Obtener por id
router.get("/:id", validarToken, obtenerAlMatPorId);
//Crear registro con los valores del cuerpo de la petición
router.post("/", validarToken, registrarAlMat);
//Actualizar por id
router.put("/:id", validarToken, actualizarAlMat);
//Borrar por id
router.delete("/:id", validarToken, borrarAlMat);

module.exports = router;