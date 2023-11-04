const express = require("express");
const router = express.Router();
const { obtenerTodosAlumnos, obtenerAlumPorId, registrarAlumno, actualizarAlumno, borrarAlumno } = require("../controllers/alumnosController");
const validarToken = require("../libs/validarToken");

//Mostrar todos los elementos de la tabla, paginados
router.get("/", validarToken, obtenerTodosAlumnos);
//Obtener por id
router.get("/:id", validarToken, obtenerAlumPorId);
//Crear registro con los valores del cuerpo de la petición
router.post("/", validarToken, registrarAlumno);
//Actualizar por id
router.put("/:id", validarToken, actualizarAlumno);
//Borrar por id
router.delete("/:id", validarToken, borrarAlumno);

module.exports = router;