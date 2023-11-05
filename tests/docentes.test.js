const app = require('../app');
const request = require('supertest');
const modelos = require('../models');
const docente = modelos.docente

//Simula elementos presentes en la base de datos
const docentesRandom = [
  { id: 1, dni: 40222333, nombre: 'Armando', apellido: 'Barreda', titulo: 'Lic. en informática', fecha_nac: '2000-07-25' },
  { id: 2, dni: 35123545, nombre: 'Pepe', apellido: 'Argento', titulo: 'Ing. bioquímica', fecha_nac: '1998-02-19' },
  { id: 3, dni: 28545326, nombre: 'Rita', apellido: 'Almeyda', titulo: 'Ing. en sistemas', fecha_nac: '1990-10-30' }
]

describe('GET /doc', () => {
  test('debería mostrar todos los docentes contados y paginados', async () => {
    //Envía respuesta emulada a partir del mock de findAndCountAll
    const mockFindAndCountAll = jest.spyOn(docente, 'findAndCountAll').mockImplementationOnce(() => ({
      rows: docentesRandom,
      count: 3,
    }));

    //Hace la petición HTTP que lanza findAndCountAll
    const { statusCode, body } = await request(app).get('/doc');

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
    expect(body).toHaveProperty('elementos', docentesRandom)
  });
});

describe('GET /doc/:id', () => {
  test('debería mostrar un docente por su ID', async () => {
    //Envía respuesta emulada a partir del mock de findOne
    const mockFindOne = jest.spyOn(docente, 'findOne').mockImplementationOnce(() => (docentesRandom[0]));

    //Hace la petición HTTP que lanza findOne
    const { statusCode, body } = await request(app).get('/doc/1');

    //Comprueba la corrección de los resultados
    //El mock ha sido llamado una vez
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    //Código de estado
    expect(statusCode).toBe(200);
    //El cuerpo de la respuesta es un objeto con las propiedades correspondientes
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('dni')
    expect(body).toHaveProperty('nombre')
    expect(body).toHaveProperty('apellido')
    expect(body).toHaveProperty('titulo')
    expect(body).toHaveProperty('fecha_nac')
    //El cuerpo de la respuesta es el docente que se espera encontrar
    expect(body).toEqual(docentesRandom[0]);
  });

  test('debería responder estado 404 si no encuentra docente', async () => {
    //Envía respuesta emulada a partir del mock de findOne
    const mockFindOne = jest.spyOn(docente, 'findOne').mockImplementationOnce(() => (undefined));

    //Hace la petición HTTP que lanza findOne
    const { statusCode, body } = await request(app).get('/doc/1');

    //Comprueba la corrección de los resultados
    //El mock ha sido llamado una vez
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    //Código de estado
    expect(statusCode).toBe(404);
    //El cuerpo de la respuesta es un objeto vacío
    expect(body).toEqual({})
  });
});

describe('POST /doc', () => {
  test('debería registrar un nuevo docente', async () => {
    //Envía respuesta emulada a partir del mock de create
    const mockCreate = jest.spyOn(docente, 'create').mockImplementationOnce(() => (docentesRandom[0]));
    //Crea un nuevo objeto en base a docentesRandom[0] sin la propiedad 'id', no necesaria en el ingreso de datos en el body
    const bodydocente = Object.fromEntries(Object.entries(docentesRandom[0]).slice(1));
    //Hace la petición HTTP que lanza create con los datos para 'body'
    const { statusCode, body } = await request(app).post('/doc').send(bodydocente);

    //Comprueba la corrección de los resultados
    //El mock ha sido llamado una vez
    expect(mockCreate).toHaveBeenCalledTimes(1);
    //Código de estado
    expect(statusCode).toBe(201);
    //El cuerpo de la respuesta es un objeto con las propiedades y valores correctos
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('estado', 'Éxito al crear docente');
    expect(body).toHaveProperty('id', 1);
  });
});

describe('PUT /doc/:id', () => {
  test('debería actualizar un docente por su ID', async () => {
    //Hace un clon de un docente y le cambia el nombre
    clon = structuredClone(docentesRandom[0])
    clon.nombre = 'Bort'
    //Emula un update de docente devolviendo el clon con la propiedad cambiada
    const mockUpdate = jest.spyOn(docente, 'update').mockImplementationOnce(() => (clon))
    //Agrega propiedad update a docentesRandom[0] y le asigna el mockUpdate para simular la actualización del mismo
    docentesRandom[0].update = mockUpdate

    //Emula findOne encontrando a 'docentesRandom[0]'
    const mockFindOne = jest.spyOn(docente, 'findOne').mockImplementationOnce(() => (docentesRandom[0]))

    //Prepara el body para la request, el 'clon' sin id
    const bodyParaActualizar = Object.fromEntries(Object.entries(clon).slice(1));
    //Hace la petición HTTP que lanza findOne y update, enviando el body 'bodyParaActualizar'
    const { statusCode, body } = await request(app).put('/doc/1').send(bodyParaActualizar);

    //Comprueba la corrección de los resultados
    //Cada mock ha sido llamado una vez
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    //Código de estado
    expect(statusCode).toBe(200);
    //Responde con un objeto con las propiedades y valores correctos
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('estado', 'Éxito al actualizar docente.')
    expect(body).toHaveProperty('actualizado')
    //'actualizado' contiene las propiedades y valores correctos
    const { actualizado } = body
    expect(actualizado).toHaveProperty('id', 1)
    expect(actualizado).toHaveProperty('nombre', 'Bort')
    expect(actualizado).toHaveProperty('apellido', 'Barreda')
  });
});

describe('DELETE /doc/:id', () => {
  test('debería eliminar un docente por su ID', async () => {
    //Emula un destroy de docente
    const mockDestroy = jest.spyOn(docente, 'destroy').mockImplementationOnce(() => (1))

    //Agrega propiedad destroy y le asigna el mockDestroy para simular el borrado
    docentesRandom[0].destroy = mockDestroy
    //Emula findOne encontrando a 'docentesRandom[0]'
    const mockFindOne = jest.spyOn(docente, 'findOne').mockImplementationOnce(() => (docentesRandom[0]))

    //Hace la petición HTTP que lanza findOne y destroy
    const { status, text } = await request(app).delete('/doc/1')

    //Comprueba la corrección de los resultados
    //Cada mock ha sido llamado una vez
    expect(mockDestroy).toHaveBeenCalledTimes(1)
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    //Las propiedades de la respuesta tienen los valores esperados
    expect(status).toBe(200);
    expect(text).toBe('Éxito al eliminar docente.');
  });
});
