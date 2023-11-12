const app = require('../app');
const request = require('supertest');
const modelos = require('../models');
const materia = modelos.materia

//Simula elementos presentes en la base de datos
const materiasRandom = [
  { id: 1, nombre: 'Arte y tecnología', carga_horaria: 2 },
  { id: 2, nombre: 'Elementos de ingeniería de software', carga_horaria: 8 },
  { id: 3, nombre: 'Desarrollo de aplicaciones', carga_horaria: 8 }
]

describe('GET /mat', () => {
  test('debería mostrar todas las materias contados y paginados', async () => {
    //Envía respuesta emulada a partir del mock de findAndCountAll
    const mockFindAndCountAll = jest.spyOn(materia, 'findAndCountAll').mockImplementationOnce(() => ({
      rows: materiasRandom,
      count: 3,
    }));

    //Hace la petición HTTP que lanza findAndCountAll
    const { statusCode, body } = await request(app).get('/mat');

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
    expect(body).toHaveProperty('elementos', materiasRandom)
  });
});

describe('GET /mat/:id', () => {
  test('debería mostrar un materia por su ID', async () => {
    //Envía respuesta emulada a partir del mock de findOne
    const mockFindOne = jest.spyOn(materia, 'findOne').mockImplementationOnce(() => (materiasRandom[0]));

    //Hace la petición HTTP que lanza findOne
    const { statusCode, body } = await request(app).get('/mat/1');

    //Comprueba la corrección de los resultados
    //El mock ha sido llamado una vez
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    //Código de estado
    expect(statusCode).toBe(200);
    //El cuerpo de la respuesta es un objeto con las propiedades correspondientes
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('nombre')
    expect(body).toHaveProperty('carga_horaria')
    //El cuerpo de la respuesta es el materia que se espera encontrar
    expect(body).toEqual(materiasRandom[0]);
  });

  test('debería responder estado 404 si no encuentra materia', async () => {
    //Envía respuesta emulada a partir del mock de findOne
    const mockFindOne = jest.spyOn(materia, 'findOne').mockImplementationOnce(() => (undefined));

    //Hace la petición HTTP que lanza findOne
    const { statusCode, body } = await request(app).get('/mat/1');

    //Comprueba la corrección de los resultados
    //El mock ha sido llamado una vez
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    //Código de estado
    expect(statusCode).toBe(404);
    //El cuerpo de la respuesta es un objeto vacío
    expect(body).toEqual({})
  });
});

describe('POST /mat', () => {
  test('debería registrar un nuevo materia', async () => {
    //Envía respuesta emulada a partir del mock de create
    const mockCreate = jest.spyOn(materia, 'create').mockImplementationOnce(() => (materiasRandom[0]));
    //Crea un nuevo objeto en base a materiasRandom[0] sin la propiedad 'id', no necesaria en el ingreso de datos en el body
    const bodymateria = Object.fromEntries(Object.entries(materiasRandom[0]).slice(1));
    //Hace la petición HTTP que lanza create con los datos para 'body'
    const { statusCode, body } = await request(app).post('/mat').send(bodymateria);

    //Comprueba la corrección de los resultados
    //El mock ha sido llamado una vez
    expect(mockCreate).toHaveBeenCalledTimes(1);
    //Código de estado
    expect(statusCode).toBe(201);
    //El cuerpo de la respuesta es un objeto con las propiedades y valores correctos
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('estado', 'Éxito al crear materia');
    expect(body).toHaveProperty('id', 1);
  });
});

describe('PUT /mat/:id', () => {
  test('debería actualizar un materia por su ID', async () => {
    //Hace un clon de una materia y le cambia el nombre
    clon = structuredClone(materiasRandom[0])
    clon.nombre = 'Historia del rock nacional'
    //Emula un update de materia devolviendo el clon con la propiedad cambiada
    const mockUpdate = jest.spyOn(materia, 'update').mockImplementationOnce(() => (clon))
    //Agrega propiedad update a materiasRandom[0] y le asigna el mockUpdate para simular la actualización del mismo
    materiasRandom[0].update = mockUpdate

    //Emula findOne encontrando a 'materiasRandom[0]'
    const mockFindOne = jest.spyOn(materia, 'findOne').mockImplementationOnce(() => (materiasRandom[0]))

    //Hace la petición HTTP que lanza findOne y update, enviando el body con la propiedad a actualizar y el valor deseado
    const { statusCode, body } = await request(app).put('/mat/1').send({ nombre: 'Historia del rock nacional' });

    //Comprueba la corrección de los resultados
    //Cada mock ha sido llamado una vez
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    //Código de estado
    expect(statusCode).toBe(200);
    //Responde con un objeto con las propiedades y valores correctos
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('estado', 'Éxito al actualizar materia.')
    expect(body).toHaveProperty('actualizado')
    //'actualizado' contiene las propiedades y valores correctos
    const { actualizado } = body
    expect(actualizado).toHaveProperty('id', 1)
    expect(actualizado).toHaveProperty('nombre', 'Historia del rock nacional')
    expect(actualizado).toHaveProperty('carga_horaria', 2)
  });
});

describe('DELETE /mat/:id', () => {
  test('debería eliminar un materia por su ID', async () => {
    //Emula un destroy de materia
    const mockDestroy = jest.spyOn(materia, 'destroy').mockImplementationOnce(() => (1))

    //Agrega propiedad destroy y le asigna el mockDestroy para simular el borrado
    materiasRandom[0].destroy = mockDestroy
    //Emula findOne encontrando a 'materiasRandom[0]'
    const mockFindOne = jest.spyOn(materia, 'findOne').mockImplementationOnce(() => (materiasRandom[0]))

    //Hace la petición HTTP que lanza findOne y destroy
    const { status, text } = await request(app).delete('/mat/1')

    //Comprueba la corrección de los resultados
    //Cada mock ha sido llamado una vez
    expect(mockDestroy).toHaveBeenCalledTimes(1)
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    //Las propiedades de la respuesta tienen los valores esperados
    expect(status).toBe(200);
    expect(text).toBe('Éxito al eliminar materia.');
  });
});
