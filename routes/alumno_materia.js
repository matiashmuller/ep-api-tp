const express = require("express");
const router = express.Router();
const { obtenerTodasAlMat, obtenerAlMatPorId, borrarAlMat, registrarAlMat } = require("../controllers/alum_matController");
const validarToken = require("../libs/validarToken");

//Mostrar todos los elementos de la tabla, paginados
router.get("/", validarToken, obtenerTodasAlMat);
//Obtener por id
router.get("/:id", validarToken, obtenerAlMatPorId);
//Crear registro con los valores del cuerpo de la petición
router.post("/", validarToken, registrarAlMat);
//Actualizar por id
//router.put("/:id", validarToken, actualizarAlumno);
//Borrar por id
router.delete("/:id", validarToken, borrarAlMat);

module.exports = router;