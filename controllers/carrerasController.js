const { responderAlError, buscarRegistro, comprobarAtributos } = require("../libs/helper");
const { logger, loggerMeta } = require("../libs/logger");

const models = require("../models");
const modelo = models.carrera
const atributosABuscarYMostrar = ["id", "nombre"]
const atributosACrearOActualizar = ["nombre"]
const relacionesAIncluir = [{
  as: 'materiasIncluidas',
  model: models.carrera_materia,
  attributes: ["id_materia"],
  include: {
    as: 'materia',
    model: models.materia,
    attributes: ['nombre']
  }
}, {
  as: 'alumnosInscriptos',
  model: models.alumno,
  attributes: ["dni", "nombre", "apellido"]
}]
const nombreEntidad = 'carrera'
const noEsTablaUnion = true

//Controlador para obtener todas las carreras
async function obtenerTodasCarreras(req, res) {
  try {
    /*
    Toma de parámetros para paginación:
    Toma los valores pagina y cantPorPag pasados como parámetros, los parsea
    a Int y luego comprueba: si algún valor de los pasados fuera aún inválido
    (<=0 o no-número), asigna uno válido por defecto (1 y 5 respectivamente).
    */
    let pagina = parseInt(req.query.pagina);
    let cantPorPag = parseInt(req.query.cantPorPag);

    pagina = isNaN(pagina) || pagina <= 0 ? 1 : pagina;
    cantPorPag = isNaN(cantPorPag) || cantPorPag <= 0 ? 5 : cantPorPag;

    const resp = await modelo.findAndCountAll({
      attributes: atributosABuscarYMostrar,
      //Asocicación
      include: relacionesAIncluir,
      /*
      Paginación: Se muestran cantPorPag (5 por defecto) elementos por página,
      a partir de la página actual. Por defecto considera la página 1 como la primera.
      Ejemplo:
        Página 1 → Elementos 1 al 5
        Pagina 2 → Elementos 6 al 10
      */
      limit: cantPorPag,
      offset: (pagina - 1) * (cantPorPag),
      //Para contar correctamente los elementos, necesita ser true en todas las tablas, 
      //excepto en tablas de unión, que argumentarán con false
      distinct: noEsTablaUnion
    });
    //Loguea y manda respuesta de éxito
    const totalElementos = resp.count;
    const elementos = resp.rows;
    const totalPaginas = Math.ceil(totalElementos / cantPorPag);

    res.send({
      totalElementos,
      totalPaginas,
      paginaNro: pagina,
      elementos
    });
    logger.info(`Éxito al mostrar ${nombreEntidad}s.`, loggerMeta(req, res));
  } catch (error) {
    responderAlError(error, req, res);
  }
}

//Controlador para obtener una carrera por su id
async function obtenerCarreraPorId(req, res) {
  try {
    const registro = await buscarRegistro(modelo, atributosABuscarYMostrar, relacionesAIncluir, req.params.id, nombreEntidad);
    res.json(registro);
    logger.info(`Éxito al mostrar ${nombreEntidad}.`, loggerMeta(req, res));
  } catch (error) {
    responderAlError(error, req, res, nombreEntidad);
  }
}

//Controlador para registrar nueva carrera
async function registrarCarrera(req, res) {
  try {
    //Comprueba validez de atributos ingresados en el cuerpo de la petición
    comprobarAtributos(atributosACrearOActualizar, req)
    /*
    Crea el nuevo registro a partir de los atributos y valores ingresados
    en el cuerpo de la solicitud
    */
    const registro = await modelo.create(
      req.body
    );
    //Envía respuesta de creado, y loggea a consola y bd
    res.status(201).send({ estado: `Éxito al crear ${nombreEntidad}`, id: registro.id });
    logger.info(`Éxito al registrar ${nombreEntidad}.`, loggerMeta(req, res));
  } catch (error) {
    responderAlError(error, req, res, nombreEntidad);
  }
}

//Controlador para actualizar carrera
async function actualizarCarrera(req, res) {
  try {
    //Comprueba validez de atributos ingresados en el cuerpo de la petición
    comprobarAtributos(atributosACrearOActualizar, req, true)
    //Busca el registro a actualizar
    const registro = await buscarRegistro(modelo, atributosABuscarYMostrar, relacionesAIncluir, req.params.id);
    //Actualiza los valores de los atributos del registro con los del cuerpo de la petición
    const registroActualizado = await registro.update(req.body);
    //Envía respuesta de éxito y loguea a consola y bd
    res.status(200).json({ estado: `Éxito al actualizar ${nombreEntidad}.`, actualizado: registroActualizado });
    logger.info(`Éxito al actualizar ${nombreEntidad}`, loggerMeta(req, res));
  } catch (error) {
    responderAlError(error, req, res, nombreEntidad);
  }
}

//Controlador para borrar carrera
async function borrarCarrera(req,res){
  try {
    //Busca el registro a borrar
    const registro = await buscarRegistro(modelo, atributosABuscarYMostrar, relacionesAIncluir, req.params.id);
    //Borra el registro
    await registro.destroy();
    //Envía respuesta de éxito y loguea a consola y bd
    res.status(200).send(`Éxito al eliminar ${nombreEntidad}.`);
    logger.info(`Éxito al eliminar ${nombreEntidad}.`, loggerMeta(req, res));
  } catch (error) {
    responderAlError(error, req, res, nombreEntidad);
  }
}

module.exports = { obtenerTodasCarreras, obtenerCarreraPorId, registrarCarrera, actualizarCarrera, borrarCarrera }