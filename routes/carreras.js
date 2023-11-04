const express = require("express");
const router = express.Router();
const { obtenerTodasCarreras, obtenerCarreraPorId, registrarCarrera, actualizarCarrera, borrarCarrera } = require("../controllers/carrerasController");
const validarToken = require("../libs/validarToken");

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