const app = require('../app');
const request = require('supertest');
const modelos = require('../models');
const carrera_materia = modelos.carrera_materia
const carrera = modelos.carrera
const materia = modelos.materia

//Simula elementos presentes en la base de datos
const relacionesCarreraMateria = [
  { id: 1, id_carrera: 1, id_materia: 1 },
  { id: 2, id_carrera: 1, id_materia: 2 },
  { id: 3, id_carrera: 1, id_materia: 3 }
]

describe('GET /carmat', () => {
  test('debería mostrar todas las relaciones carrera_materia contadas y paginadas', async () => {
    //Envía respuesta emulada a partir del mock de findAndCountAll
    const mockFindAndCountAll = jest.spyOn(carrera_materia, 'findAndCountAll').mockImplementationOnce(() => ({
      rows: relacionesCarreraMateria,
      count: 3,
    }));

    //Hace la petición HTTP que lanza findAndCountAll
    const { statusCode, body } = await request(app).get('/carmat');

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
    expect(body).toHaveProperty('elementos', relacionesCarreraMateria)
  });
});

describe('GET /carmat/:id', () => {
  test('debería mostrar una relación carrera_materia por su ID', async () => {
    //Envía respuesta emulada a partir del mock de findOne
    const mockFindOne = jest.spyOn(carrera_materia, 'findOne').mockImplementationOnce(() => (relacionesCarreraMateria[0]));

    //Hace la petición HTTP que lanza findOne
    const { statusCode, body } = await request(app).get('/carmat/1');

    //Comprueba la corrección de los resultados
    //El mock ha sido llamado una vez
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    //Código de estado
    expect(statusCode).toBe(200);
    //El cuerpo de la respuesta es un objeto con las propiedades correspondientes
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('id', 1)
    expect(body).toHaveProperty('id_carrera', 1)
    expect(body).toHaveProperty('id_materia', 1)
    //El cuerpo de la respuesta es el carrera_materia que se espera encontrar
    expect(body).toEqual(relacionesCarreraMateria[0]);
  });

  test('debería responder estado 404 si no encuentra carrera_materia', async () => {
    //Envía respuesta emulada a partir del mock de findOne
    const mockFindOne = jest.spyOn(carrera_materia, 'findOne').mockImplementationOnce(() => (undefined));

    //Hace la petición HTTP que lanza findOne
    const { statusCode, body } = await request(app).get('/carmat/1');

    //Comprueba la corrección de los resultados
    //El mock ha sido llamado una vez
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    //Código de estado
    expect(statusCode).toBe(404);
    //El cuerpo de la respuesta es un objeto vacío
    expect(body).toEqual({})
  });
});

describe('POST /carmat', () => {
  test('debería registrar un nuevo carrera_materia', async () => {
    //Emula el 'findOne' en los modelos relacionados correspondientes, disparados por la comprobación de fks 
    const mockComprobarFk1 = jest.spyOn(carrera, 'findOne').mockReturnValueOnce({});
    const mockComprobarFk2 = jest.spyOn(materia, 'findOne').mockReturnValueOnce({});
    //Envía respuesta emulada a partir del mock de create
    const mockCreate = jest.spyOn(carrera_materia, 'create').mockImplementationOnce(() => (relacionesCarreraMateria[0]));
    //Crea un nuevo objeto en base a relacionesCarreraMateria[0] sin la propiedad 'id', no necesaria en el ingreso de datos en el body
    const bodyCarreraMateria = Object.fromEntries(Object.entries(relacionesCarreraMateria[0]).slice(1));
    //Hace la petición HTTP que lanza create con los datos para 'body'
    const { statusCode, body } = await request(app).post('/carmat').send(bodyCarreraMateria);

    //Comprueba la corrección de los resultados
    //Cada mock ha sido llamado una vez
    expect(mockComprobarFk1).toHaveBeenCalledTimes(1);
    expect(mockComprobarFk2).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledTimes(1);
    //Código de estado
    expect(statusCode).toBe(201);
    //El cuerpo de la respuesta es un objeto con las propiedades y valores correctos
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('estado', 'Éxito al crear carrera_materia');
    expect(body).toHaveProperty('id', 1);
  });
});

describe('PUT /carmat/:id', () => {
  test('debería actualizar un carrera_materia por su ID', async () => {
    //Emula el 'findOne' en el modelo relacionado correspondiente, disparado por la comprobación de fks 
    const mockComprobarFkCambiada = jest.spyOn(carrera, 'findOne').mockReturnValueOnce({});
    //Hace un clon de una carrera_materia y le cambia el id_carrera
    clon = structuredClone(relacionesCarreraMateria[0])
    clon.id_carrera = 3
    //Emula un update de carrera_materia devolviendo el clon con la propiedad cambiada
    const mockUpdate = jest.spyOn(carrera_materia, 'update').mockImplementationOnce(() => (clon))
    //Agrega propiedad update a relacionesCarreraMateria[0] y le asigna el mockUpdate para simular la actualización del mismo
    relacionesCarreraMateria[0].update = mockUpdate

    //Emula findOne encontrando a 'relacionesCarreraMateria[0]'
    const mockFindOne = jest.spyOn(carrera_materia, 'findOne').mockImplementationOnce(() => (relacionesCarreraMateria[0]))

    //Hace la petición HTTP que lanza findOne y update, enviando el body con la propiedad a actualizar y el valor deseado
    const { statusCode, body } = await request(app).put('/carmat/1').send({ id_carrera: 3 });

    //Comprueba la corrección de los resultados
    //Cada mock ha sido llamado una vez
    expect(mockComprobarFkCambiada).toHaveBeenCalledTimes(1);
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    //Código de estado
    expect(statusCode).toBe(200);
    //Responde con un objeto con las propiedades y valores correctos
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('estado', 'Éxito al actualizar carrera_materia.')
    expect(body).toHaveProperty('actualizado')
    //'actualizado' contiene las propiedades y valores correctos
    const { actualizado } = body
    expect(actualizado).toHaveProperty('id', 1)
    expect(actualizado).toHaveProperty('id_carrera', 3)
    expect(actualizado).toHaveProperty('id_materia', 1)
  });
});

describe('DELETE /carmat/:id', () => {
  test('debería eliminar una relación carrera_materia por su ID', async () => {
    //Emula un destroy de carrera_materia
    const mockDestroy = jest.spyOn(carrera_materia, 'destroy').mockImplementationOnce(() => (1))

    //Agrega propiedad destroy y le asigna el mockDestroy para simular el borrado
    relacionesCarreraMateria[0].destroy = mockDestroy
    //Emula findOne encontrando a 'relacionesCarreraMateria[0]'
    const mockFindOne = jest.spyOn(carrera_materia, 'findOne').mockImplementationOnce(() => (relacionesCarreraMateria[0]))

    //Hace la petición HTTP que lanza findOne y destroy
    const { status, text } = await request(app).delete('/carmat/1')

    //Comprueba la corrección de los resultados
    //Cada mock ha sido llamado una vez
    expect(mockDestroy).toHaveBeenCalledTimes(1)
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    //Las propiedades de la respuesta tienen los valores esperados
    expect(status).toBe(200);
    expect(text).toBe('Éxito al eliminar carrera_materia.');
  });
});
