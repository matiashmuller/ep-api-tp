const express = require("express");
const router = express.Router();
const { obtenerTodosDocentes, obtenerDocPorId, registrarDocente, actualizarDocente, borrarDocente } = require("../controllers/docentesController");
const validarToken = require("../libs/validarToken");

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