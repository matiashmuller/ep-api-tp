const app = require('../app');
const request = require('supertest');
const modelos = require('../models');
const carrera = modelos.carrera

//Simula elementos presentes en la base de datos
const carrerasRandom = [
  { id: 1, nombre: 'Tecnicatura en programación' },
  { id: 2, nombre: 'Tecnicatura en videojuegos' },
  { id: 3, nombre: 'Licenciatura en informática' }
]

describe('GET /car', () => {
  test('debería mostrar todas las carreras contados y paginados', async () => {
    //Envía respuesta emulada a partir del mock de findAndCountAll
    const mockFindAndCountAll = jest.spyOn(carrera, 'findAndCountAll').mockImplementationOnce(() => ({
      rows: carrerasRandom,
      count: 3,
    }));

    //Hace la petición HTTP que lanza findAndCountAll
    const { statusCode, body } = await request(app).get('/car');

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
    expect(body).toHaveProperty('elementos', carrerasRandom)
  });
});

describe('GET /car/:id', () => {
  test('debería mostrar un carrera por su ID', async () => {
    //Envía respuesta emulada a partir del mock de findOne
    const mockFindOne = jest.spyOn(carrera, 'findOne').mockImplementationOnce(() => (carrerasRandom[0]));

    //Hace la petición HTTP que lanza findOne
    const { statusCode, body } = await request(app).get('/car/1');

    //Comprueba la corrección de los resultados
    //El mock ha sido llamado una vez
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    //Código de estado
    expect(statusCode).toBe(200);
    //El cuerpo de la respuesta es un objeto con las propiedades correspondientes
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('nombre')
    //El cuerpo de la respuesta es el carrera que se espera encontrar
    expect(body).toEqual(carrerasRandom[0]);
  });

  test('debería responder estado 404 si no encuentra carrera', async () => {
    //Envía respuesta emulada a partir del mock de findOne
    const mockFindOne = jest.spyOn(carrera, 'findOne').mockImplementationOnce(() => (undefined));

    //Hace la petición HTTP que lanza findOne
    const { statusCode, body } = await request(app).get('/car/1');

    //Comprueba la corrección de los resultados
    //El mock ha sido llamado una vez
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    //Código de estado
    expect(statusCode).toBe(404);
    //El cuerpo de la respuesta es un objeto vacío
    expect(body).toEqual({})
  });
});

describe('POST /car', () => {
  test('debería registrar un nuevo carrera', async () => {
    //Envía respuesta emulada a partir del mock de create
    const mockCreate = jest.spyOn(carrera, 'create').mockImplementationOnce(() => (carrerasRandom[0]));
    //Crea un nuevo objeto en base a carrerasRandom[0] sin la propiedad 'id', no necesaria en el ingreso de datos en el body
    const bodycarrera = Object.fromEntries(Object.entries(carrerasRandom[0]).slice(1));
    //Hace la petición HTTP que lanza create con los datos para 'body'
    const { statusCode, body } = await request(app).post('/car').send(bodycarrera);

    //Comprueba la corrección de los resultados
    //El mock ha sido llamado una vez
    expect(mockCreate).toHaveBeenCalledTimes(1);
    //Código de estado
    expect(statusCode).toBe(201);
    //El cuerpo de la respuesta es un objeto con las propiedades y valores correctos
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('estado', 'Éxito al crear carrera');
    expect(body).toHaveProperty('id', 1);
  });
});

describe('PUT /car/:id', () => {
  test('debería actualizar un carrera por su ID', async () => {
    //Hace un clon de una carrera y le cambia el nombre
    clon = structuredClone(carrerasRandom[0])
    clon.nombre = 'Tecnicatura en IA'
    //Emula un update de carrera devolviendo el clon con la propiedad cambiada
    const mockUpdate = jest.spyOn(carrera, 'update').mockImplementationOnce(() => (clon))
    //Agrega propiedad update a carrerasRandom[0] y le asigna el mockUpdate para simular la actualización del mismo
    carrerasRandom[0].update = mockUpdate

    //Emula findOne encontrando a 'carrerasRandom[0]'
    const mockFindOne = jest.spyOn(carrera, 'findOne').mockImplementationOnce(() => (carrerasRandom[0]))

    //Prepara el body para la request, el 'clon' sin id
    const bodyParaActualizar = Object.fromEntries(Object.entries(clon).slice(1));
    //Hace la petición HTTP que lanza findOne y update, enviando el body 'bodyParaActualizar'
    const { statusCode, body } = await request(app).put('/car/1').send(bodyParaActualizar);

    //Comprueba la corrección de los resultados
    //Cada mock ha sido llamado una vez
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    //Código de estado
    expect(statusCode).toBe(200);
    //Responde con un objeto con las propiedades y valores correctos
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('estado', 'Éxito al actualizar carrera.')
    expect(body).toHaveProperty('actualizado')
    //'actualizado' contiene las propiedades y valores correctos
    const { actualizado } = body
    expect(actualizado).toHaveProperty('id', 1)
    expect(actualizado).toHaveProperty('nombre', 'Tecnicatura en IA')
  });
});

describe('DELETE /car/:id', () => {
  test('debería eliminar un carrera por su ID', async () => {
    //Emula un destroy de carrera
    const mockDestroy = jest.spyOn(carrera, 'destroy').mockImplementationOnce(() => (1))

    //Agrega propiedad destroy y le asigna el mockDestroy para simular el borrado
    carrerasRandom[0].destroy = mockDestroy
    //Emula findOne encontrando a 'carrerasRandom[0]'
    const mockFindOne = jest.spyOn(carrera, 'findOne').mockImplementationOnce(() => (carrerasRandom[0]))

    //Hace la petición HTTP que lanza findOne y destroy
    const { status, text } = await request(app).delete('/car/1')

    //Comprueba la corrección de los resultados
    //Cada mock ha sido llamado una vez
    expect(mockDestroy).toHaveBeenCalledTimes(1)
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    //Las propiedades de la respuesta tienen los valores esperados
    expect(status).toBe(200);
    expect(text).toBe('Éxito al eliminar carrera.');
  });
});
