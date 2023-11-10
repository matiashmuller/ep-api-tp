const express = require("express");
const router = express.Router();
const { obtenerTodasComisiones, obtenerComisionPorId, registrarComision, actualizarComision, borrarComision } = require("../controllers/comisionesController");
const validarToken = require("../libs/validarToken");

/**
 * @openapi
 * 
 * /com/:
 *   get:
 *     summary: Muestra todas las comisiones registradas en la base de datos paginadas (por defecto, de a 5 elementos por página).
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Comisiones
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
 *                   "letra": "A",
 *                   "dias": "Lunes",
 *                   "turno": "Mañana",
 *                   "materia": { "id": 1, "nombre": "Organización de computadoras" },
 *                   "docente": { "id": 1, "nombre": "Marcela", "apellido": "Villalba" }
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
 *     summary: Registra una nueva comisión en la base de datos.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Comisiones
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: {"letra": "A", "dias": "Lunes","turno": "Mañana","id_materia": 1,"id_docente": 1}
 *     responses:
 *       201:
 *         description: Creado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {"estado":"Éxito al crear comisión","id":1}
 *       400:
 *         description: Bad request.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error, Esx comisión ya existe en la base de datos.
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
 * /com/{id}:
 *   get:
 *     summary: Busca y muestra una comisión por su 'id'.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Comisiones
 *     parameters:
 *       - name: id
 *         in: path
 *         description: El id de la comisión a mostrar.
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
 *                 "letra": "A",
 *                 "dias": "Lunes",
 *                 "turno": "Mañana",
 *                 "materia": { "id": 1, "nombre": "Organización de computadoras" },
 *                 "docente": { "id": 1, "nombre": "Marcela", "apellido": "Villalba" }
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
 *               example: Error, comisión con {id} no encontrado.
 *       5XX:
 *         description: Error en el servidor.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error interno del servidor.
 * 
 *   put:
 *     summary: Busca, actualiza y muestra una comisión por su 'id'.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Comisiones
 *     parameters:
 *       - name: id
 *         in: path
 *         description: El id de la comisión a actualizar.
 *         required: true
 *         squema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: {"turno": "Tarde"}
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {
 *                 "estado":"Éxito al actualizar comisión.",
 *                 "actualizado": {
 *                   "id": 1,
 *                   "letra": "A",
 *                   "dias": "Lunes",
 *                   "turno": "Tarde",
 *                   "materia": { "id": 1, "nombre": "Organización de computadoras" },
 *                   "docente": { "id": 1, "nombre": "Marcela", "apellido": "Villalba" },
 *                   "id_materia": 1,
 *                   "id_docente": 1,
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
 *               example: Error, comisión con {id} no encontrado.
 *       5XX:
 *         description: Error en el servidor.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error interno del servidor.
 *   
 *   delete:
 *     summary: Busca una comisión por su id y la elimina de la base de datos.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Comisiones
 *     parameters:
 *       - name: id
 *         in: path
 *         description: El id de la comisión a eliminar.
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
 *               example: Éxito al eliminar comisión.
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
 *               example: Error, comisión con {id} no encontrado.
 *       5XX:
 *         description: Error en el servidor.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error interno del servidor.
 */

//Mostrar todos los elementos de la tabla, paginados
router.get("/", validarToken, obtenerTodasComisiones);
//Obtener por id
router.get("/:id", validarToken, obtenerComisionPorId);
//Crear registro con los valores del cuerpo de la petición
router.post("/", validarToken, registrarComision);
//Actualizar por id
router.put("/:id", validarToken, actualizarComision);
//Borrar por id
router.delete("/:id", validarToken, borrarComision);

module.exports = router;