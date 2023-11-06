const app = require('../app');
const request = require('supertest');
const modelos = require('../models');
const alumno_materia = modelos.alumno_materia

//Simula elementos presentes en la base de datos
const relacionesAlumnoMateria = [
  { id: 1, id_alumno: 1, id_materia: 1 },
  { id: 2, id_alumno: 1, id_materia: 2 },
  { id: 3, id_alumno: 1, id_materia: 3 }
]

describe('GET /almat', () => {
  test('debería mostrar todas las relaciones alumno_materia contadas y paginadas', async () => {
    //Envía respuesta emulada a partir del mock de findAndCountAll
    const mockFindAndCountAll = jest.spyOn(alumno_materia, 'findAndCountAll').mockImplementationOnce(() => ({
      rows: relacionesAlumnoMateria,
      count: 3,
    }));

    //Hace la petición HTTP que lanza findAndCountAll
    const { statusCode, body } = await request(app).get('/almat');

    //Comprueba la corrección de los resultados
    //El mock ha sido llamado una vez
    expect(mockFindAndCountAll).toHaveBeenCalledTimes(1)
    //Código de estado
    expect(statusCode).toBe(200);
    //El cuerpo de la respuesta es un objeto con las propiedades y valores correctos
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('totalElementos', 3)
    expect(body).toHaveProperty('totalPaginas', 1)
    expect(body).toHaveProperty('paginaNro', 1)
    expect(body).toHaveProperty('elementos', relacionesAlumnoMateria)
  });
});

describe('GET /almat/:id', () => {
  test('debería mostrar una relación alumno_materia por su ID', async () => {
    //Envía respuesta emulada a partir del mock de findOne
    const mockFindOne = jest.spyOn(alumno_materia, 'findOne').mockImplementationOnce(() => (relacionesAlumnoMateria[0]));

    //Hace la petición HTTP que lanza findOne
    const { statusCode, body } = await request(app).get('/almat/1');

    //Comprueba la corrección de los resultados
    //El mock ha sido llamado una vez
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    //Código de estado
    expect(statusCode).toBe(200);
    //El cuerpo de la respuesta es un objeto con las propiedades correspondientes
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('id', 1)
    expect(body).toHaveProperty('id_alumno', 1)
    expect(body).toHaveProperty('id_materia', 1)
    //El cuerpo de la respuesta es el alumno_materia que se espera encontrar
    expect(body).toEqual(relacionesAlumnoMateria[0]);
  });

  test('debería responder estado 404 si no encuentra alumno_materia', async () => {
    //Envía respuesta emulada a partir del mock de findOne
    const mockFindOne = jest.spyOn(alumno_materia, 'findOne').mockImplementationOnce(() => (undefined));

    //Hace la petición HTTP que lanza findOne
    const { statusCode, body } = await request(app).get('/almat/1');

    //Comprueba la corrección de los resultados
    //El mock ha sido llamado una vez
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    //Código de estado
    expect(statusCode).toBe(404);
    //El cuerpo de la respuesta es un objeto vacío
    expect(body).toEqual({})
  });
});

describe('POST /almat', () => {
  test('debería registrar un nuevo alumno_materia', async () => {
    //Envía respuesta emulada a partir del mock de create
    const mockCreate = jest.spyOn(alumno_materia, 'create').mockImplementationOnce(() => (relacionesAlumnoMateria[0]));
    //Crea un nuevo objeto en base a relacionesAlumnoMateria[0] sin la propiedad 'id', no necesaria en el ingreso de datos en el body
    const bodyalumno_materia = Object.fromEntries(Object.entries(relacionesAlumnoMateria[0]).slice(1));
    //Hace la petición HTTP que lanza create con los datos para 'body'
    const { statusCode, body } = await request(app).post('/almat').send(bodyalumno_materia);

    //Comprueba la corrección de los resultados
    //El mock ha sido llamado una vez
    expect(mockCreate).toHaveBeenCalledTimes(1);
    //Código de estado
    expect(statusCode).toBe(201);
    //El cuerpo de la respuesta es un objeto con las propiedades y valores correctos
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('estado', 'Éxito al crear alumno_materia');
    expect(body).toHaveProperty('id', 1);
  });
});

/**
describe('PUT /almat/:id', () => {
  test('debería actualizar un alumno_materia por su ID', async () => {
    //Hace un clon de una alumno_materia y le cambia el id_docente
    clon = structuredClone(relacionesAlumnoMateria[0])
    clon.id_docente = 3
    //Emula un update de alumno_materia devolviendo el clon con la propiedad cambiada
    const mockUpdate = jest.spyOn(alumno_materia, 'update').mockImplementationOnce(() => (clon))
    //Agrega propiedad update a relacionesAlumnoMateria[0] y le asigna el mockUpdate para simular la actualización del mismo
    relacionesAlumnoMateria[0].update = mockUpdate

    //Emula findOne encontrando a 'relacionesAlumnoMateria[0]'
    const mockFindOne = jest.spyOn(alumno_materia, 'findOne').mockImplementationOnce(() => (relacionesAlumnoMateria[0]))

    //Prepara el body para la request, el 'clon' sin id
    const bodyParaActualizar = Object.fromEntries(Object.entries(clon).slice(1));
    //Hace la petición HTTP que lanza findOne y update, enviando el body 'bodyParaActualizar'
    const { statusCode, body } = await request(app).put('/almat/1').send(bodyParaActualizar);

    //Comprueba la corrección de los resultados
    //Cada mock ha sido llamado una vez
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    //Código de estado
    expect(statusCode).toBe(200);
    //Responde con un objeto con las propiedades y valores correctos
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('estado', 'Éxito al actualizar alumno_materia.')
    expect(body).toHaveProperty('actualizado')
    //'actualizado' contiene las propiedades y valores correctos
    const { actualizado } = body
    expect(actualizado).toHaveProperty('id', 1)
    expect(actualizado).toHaveProperty('letra', 'A')
    expect(actualizado).toHaveProperty('id_docente', 3)
  });
});
*/

describe('DELETE /almat/:id', () => {
  test('debería eliminar una relación alumno_materia por su ID', async () => {
    //Emula un destroy de alumno_materia
    const mockDestroy = jest.spyOn(alumno_materia, 'destroy').mockImplementationOnce(() => (1))

    //Agrega propiedad destroy y le asigna el mockDestroy para simular el borrado
    relacionesAlumnoMateria[0].destroy = mockDestroy
    //Emula findOne encontrando a 'relacionesAlumnoMateria[0]'
    const mockFindOne = jest.spyOn(alumno_materia, 'findOne').mockImplementationOnce(() => (relacionesAlumnoMateria[0]))

    //Hace la petición HTTP que lanza findOne y destroy
    const { status, text } = await request(app).delete('/almat/1')

    //Comprueba la corrección de los resultados
    //Cada mock ha sido llamado una vez
    expect(mockDestroy).toHaveBeenCalledTimes(1)
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    //Las propiedades de la respuesta tienen los valores esperados
    expect(status).toBe(200);
    expect(text).toBe('Éxito al eliminar alumno_materia.');
  });
});
