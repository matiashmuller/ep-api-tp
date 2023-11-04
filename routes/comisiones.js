const express = require("express");
const router = express.Router();
const { obtenerTodasComisiones, obtenerComisionPorId, registrarComision, actualizarComision, borrarComision } = require("../controllers/comisionesController");
const validarToken = require("../libs/validarToken");

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