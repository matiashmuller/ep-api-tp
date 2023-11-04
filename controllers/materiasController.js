const { responderAlError, buscarRegistro, comprobarAtributos } = require("../libs/helper_new");
const { logger, loggerMeta } = require("../libs/logger");

const models = require("../models");
const modelo = models.materia
const atributosABuscarYMostrar = ["id", "nombre", "carga_horaria"]
const atributosACrearOActualizar = ["nombre", "carga_horaria"]
const relacionesAIncluir = [{
  as: 'carrerasQueLaIncluyen',
  model: models.carrera,
  attributes: ["nombre"],
  through: { attributes: ["id"] }
}, {
  /**
  as: 'profQueLaDictan',
  model: models.docente,
  attributes: ["nombre", "apellido"],
  through: { attributes: ["letra", "dias", "turno"] }
  */
  as: 'comisiones',
  model: models.comision,
  attributes: ["letra", "dias", "turno"],
  include: {
    model: models.docente,
    attributes: ['id', 'nombre', 'apellido']
  }
}, {
  as: 'alumnQueLaCursan',
  model: models.alumno,
  attributes: ["nombre", "apellido"],
  through: { attributes: ["id"] }
}]
const nombreEntidad = 'materia'
const noEsTablaUnion = true

//Controlador para obtener todas las materias
async function obtenerTodasMaterias(req, res) {
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

//Controlador para obtener una materia por su id
async function obtenerMateriaPorId(req, res) {
  try {
    const registro = await buscarRegistro(modelo, atributosABuscarYMostrar, relacionesAIncluir, req.params.id, nombreEntidad);
    res.json(registro);
    logger.info(`Éxito al mostrar ${nombreEntidad}.`, loggerMeta(req, res));
  } catch (error) {
    responderAlError(error, req, res, req.params.id, nombreEntidad);
  }
}

//Controlador para registrar nueva materia
async function registrarMateria(req, res) {
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

//Controlador para actualizar materia
async function actualizarMateria(req, res) {
  try {
    //Comprueba validez de atributos ingresados en el cuerpo de la petición
    comprobarAtributos(atributosACrearOActualizar, req)
    //Busca el registro a actualizar
    const registro = await modelo.findOne({ where: { id: req.params.id } });
    //Actualiza los valores de los atributos del registro con los del cuerpo de la petición
    await registro.update(
      req.body, {
      fields: atributosACrearOActualizar
    });
    //Envía respuesta de éxito y loguea a consola y bd
    res.status(200).json({ estado: `Éxito al actualizar ${nombreEntidad}`, actualizado: registro });
    logger.info(`Éxito al actualizar ${nombreEntidad}`, loggerMeta(req, res));
  } catch (error) {
    responderAlError(error, req, res, req.params.id, nombreEntidad);
  }
}

//Controlador para borrar carrera
async function borrarMateria(req,res){
  try {
    //Busca el registro a borrar
    const registro = await modelo.findOne({ where: { id: req.params.id } });
    //Borra el registro
    await registro.destroy();
    //Envía respuesta de éxito y loguea a consola y bd
    res.status(200).send(`Éxito al eliminar ${nombreEntidad}.`);
    logger.info(`Éxito al eliminar ${nombreEntidad}.`, loggerMeta(req, res));
  } catch (error) {
    responderAlError(error, req, res, req.params.id, nombreEntidad);
  }
}

module.exports = { obtenerTodasMaterias, obtenerMateriaPorId, registrarMateria, actualizarMateria, borrarMateria }