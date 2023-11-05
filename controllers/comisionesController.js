const { responderAlError, buscarRegistro, comprobarAtributos } = require("../libs/helper");
const { logger, loggerMeta } = require("../libs/logger");

const models = require("../models");
const modelo = models.comision
//No se incluyen foreign keys para mostrar un respuesta más prolija
const atributosABuscarYMostrar = ["id", "letra", "dias", "turno"]
const atributosACrearOActualizar = ["letra", "dias", "turno", "id_materia", "id_docente"]
const relacionesAIncluir = [{
  as: 'materia',
  model: models.materia,
  attributes: ['id', "nombre"]
}, {
  model: models.docente,
  attributes: ['id', "nombre", "apellido"]
}]
const nombreEntidad = 'comision'
const noEsTablaUnion = false

//Controlador para obtener todas las comisiones
async function obtenerTodasComisiones(req, res) {
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
    responderAlError(error, req, res, 1, nombreEntidad);
  }
}

//Controlador para obtener una comisión por su id
async function obtenerComisionPorId(req, res) {
  try {
    const registro = await buscarRegistro(modelo, atributosABuscarYMostrar, relacionesAIncluir, req.params.id);
    res.json(registro);
    logger.info(`Éxito al mostrar ${nombreEntidad}.`, loggerMeta(req, res));
  } catch (error) {
    responderAlError(error, req, res, req.params.id, nombreEntidad);
  }
}

//Controlador para registrar nueva comisión
async function registrarComision(req, res) {
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
    responderAlError(error, req, res, 1, nombreEntidad);
  }
}

//Controlador para actualizar comisión
async function actualizarComision(req, res) {
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
    responderAlError(error, req, res, req.params.id, nombreEntidad);
  }
}

//Controlador para borrar comisión
async function borrarComision(req,res){
  try {
    //Busca el registro a borrar
    const registro = await buscarRegistro(modelo, atributosABuscarYMostrar, relacionesAIncluir, req.params.id);
    //Borra el registro
    await registro.destroy();
    //Envía respuesta de éxito y loguea a consola y bd
    res.status(200).send(`Éxito al eliminar ${nombreEntidad}.`);
    logger.info(`Éxito al eliminar ${nombreEntidad}.`, loggerMeta(req, res));
  } catch (error) {
    responderAlError(error, req, res, req.params.id, nombreEntidad);
  }
}

module.exports = { obtenerTodasComisiones, obtenerComisionPorId, registrarComision, actualizarComision, borrarComision }