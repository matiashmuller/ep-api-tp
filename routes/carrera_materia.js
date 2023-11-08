const express = require("express");
const router = express.Router();
const { obtenerTodasCarMat, obtenerCarMatPorId, registrarCarMat, borrarCarMat, actualizarCarMat } = require("../controllers/car_matController");
const validarToken = require("../libs/validarToken");

//Mostrar todos los elementos de la tabla, paginados
router.get("/", validarToken, obtenerTodasCarMat);
//Obtener por id
router.get("/:id", validarToken, obtenerCarMatPorId);
//Crear registro con los valores del cuerpo de la petición
router.post("/", validarToken, registrarCarMat);
//Actualizar por id
router.put("/:id", validarToken, actualizarCarMat);
//Borrar por id
router.delete("/:id", validarToken, borrarCarMat);

module.exports = router;