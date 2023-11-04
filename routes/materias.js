const express = require("express");
const router = express.Router();
const { obtenerTodasMaterias, obtenerMateriaPorId, registrarMateria, actualizarMateria, borrarMateria } = require("../controllers/materiasController");
const validarToken = require("../libs/validarToken");

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