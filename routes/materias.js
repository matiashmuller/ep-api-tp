const express = require("express");
const router = express.Router();
const { obtenerTodasMaterias, obtenerMateriaPorId, registrarMateria, actualizarMateria, borrarMateria } = require("../controllers/materiasController");
const validarToken = require("../libs/validarToken");

/**
 * @openapi
 * 
 * /mat/:
 *   get:
 *     summary: Muestra todas las materias registradas en la base de datos paginadas (por defecto, de a 5 elementos por página).
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Materias
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
 *                                  "id": 1,
 *                                  "nombre": "Organización de computadoras",
 *                                  "carga_horaria": 8,
 *                                  "carrerasQueLaIncluyen": [{
 *                                    "nombre": "Licenciatura en informática",
 *                                    "carrera_materia": { "id": 1 }
 *                                  }],
 *                                  "comisiones": [{
 *                                      "letra": "A",
 *                                      "dias": "Lunes",
 *                                      "turno": "Mañana",
 *                                      "docente": {
 *                                        "id": 1,
 *                                        "nombre": "Marcela",
 *                                        "apellido": "Villalba"
 *                                      }
 *                                  }],
 *                                  "alumnQueLaCursan": [{
 *                                      "nombre": "Ezequiel",
 *                                      "apellido": "Agüero",
 *                                      "alumno_materia": { "id" : 1 }
 *                                  }]
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
 *     summary: Registra una nueva materia en la base de datos.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Materias
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: { "nombre": "Organización de computadoras", "carga_horaria": 8 }
 *     responses:
 *       201:
 *         description: Creado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {"estado":"Éxito al crear materia","id":1}
 *       400:
 *         description: Bad request.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error, Esx materia ya existe en la base de datos.
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
 * /mat/{id}:
 *   get:
 *     summary: Busca y muestra una materia por su 'id'.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Materias
 *     parameters:
 *       - name: id
 *         in: path
 *         description: El id de la materia a mostrar.
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
 *                       "id": 1,
 *                       "nombre": "Organización de computadoras",
 *                       "carga_horaria": 8,
 *                       "carrerasQueLaIncluyen": [{
 *                         "nombre": "Licenciatura en informática",
 *                         "carrera_materia": { "id": 1 }
 *                       }],
 *                       "comisiones": [{
 *                         "letra": "A",
 *                         "dias": "Lunes",
 *                         "turno": "Mañana",
 *                         "docente": {
 *                           "id": 1,
 *                           "nombre": "Marcela",
 *                           "apellido": "Villalba"
 *                         }
 *                       }],
 *                       "alumnQueLaCursan": [{
 *                         "nombre": "Ezequiel",
 *                         "apellido": "Agüero",
 *                         "alumno_materia": { "id" : 1 }
 *                       }]
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
 *               example: Error, materia con {id} no encontrado.
 *       5XX:
 *         description: Error en el servidor.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error interno del servidor.
 * 
 *   put:
 *     summary: Busca, actualiza y muestra una materia por su 'id'.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Materias
 *     parameters:
 *       - name: id
 *         in: path
 *         description: El id de la materia a actualizar.
 *         required: true
 *         squema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: { "nombre": "Introducción a la programación", "carga_horaria": 8 }
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {
 *                          "estado":"Éxito al actualizar materia.",
 *                          "actualizado": {
 *                                  "id": 1,
 *                                  "nombre": "Introducción a la programación",
 *                                  "carga_horaria": 8,
 *                                  "carrerasQueLaIncluyen": [{
 *                                    "nombre": "Licenciatura en informática",
 *                                    "carrera_materia": { "id": 1 }
 *                                  }],
 *                                  "comisiones": [{
 *                                    "letra": "A",
 *                                    "dias": "Lunes",
 *                                    "turno": "Mañana",
 *                                    "docente": {
 *                                      "id": 1,
 *                                      "nombre": "Marcela",
 *                                      "apellido": "Villalba"
 *                                    }
 *                                  }],
 *                                  "alumnQueLaCursan": [{
 *                                    "nombre": "Ezequiel",
 *                                    "apellido": "Agüero",
 *                                    "alumno_materia": { "id" : 1 }
 *                                  }],
 *                                  "updatedAt": "2023-11-08T00:26:14.672Z"
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
 *               example: Error, materia con {id} no encontrado.
 *       5XX:
 *         description: Error en el servidor.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error interno del servidor.
 *   
 *   delete:
 *     summary: Busca una materia por su id y la elimina de la base de datos.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Materias
 *     parameters:
 *       - name: id
 *         in: path
 *         description: El id de la materia a eliminar.
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
 *               example: Éxito al eliminar materia.
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
 *               example: Error, materia con {id} no encontrado.
 *       5XX:
 *         description: Error en el servidor.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Error interno del servidor.
 */

//Mostrar todos los elementos de la tabla, paginados
router.get("/", validarToken, obtenerTodasMaterias);
//Obtener por id
router.get("/:id", validarToken, obtenerMateriaPorId);
//Crear registro con los valores del cuerpo de la petición
router.post("/", validarToken, registrarMateria);
//Actualizar por id
router.put("/:id", validarToken, actualizarMateria);
//Borrar por id
router.delete("/:id", validarToken, borrarMateria);

module.exports = router;