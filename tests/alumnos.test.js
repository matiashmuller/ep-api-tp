const app = require('../app');
const request = require('supertest');
const modelos = require('../models');
const alumno = modelos.alumno

//Simula elementos presentes en la base de datos
const alumnosRandom = [
  { id: 1, dni: 40222333, nombre: 'Jónico', apellido: 'Dórico', fecha_nac: '2000-07-25', id_carrera: 1 },
  { id: 2, dni: 35123545, nombre: 'Cariátides', apellido: 'Magencio', fecha_nac: '1998-02-19', id_carrera: 3 },
  { id: 3, dni: 28545326, nombre: 'Tito', apellido: 'Corintio', fecha_nac: '1990-10-30', id_carrera: 2 }
]

describe('GET /alum', () => {
  test('debería mostrar todos los alumnos contados y paginados', async () => {
    //Envía respuesta emulada a partir del mock de findAndCountAll
    const mockFindAndCountAll = jest.spyOn(alumno, 'findAndCountAll').mockImplementationOnce(() => ({
      rows: alumnosRandom,
      count: 3,
    }));

    //Hace la petición HTTP que lanza findAndCountAll
    const { statusCode, body } = await request(app).get('/alum');

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
    expect(body).toHaveProperty('elementos', alumnosRandom)
  });
});

describe('GET /alum/:id', () => {
  test('debería mostrar un alumno por su ID', async () => {
    //Envía respuesta emulada a partir del mock de findOne
    const mockFindOne = jest.spyOn(alumno, 'findOne').mockImplementationOnce(() => (alumnosRandom[0]));

    //Hace la petición HTTP que lanza findOne
    const { statusCode, body } = await request(app).get('/alum/1');

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
    expect(body).toHaveProperty('fecha_nac')
    expect(body).toHaveProperty('id_carrera')
    //El cuerpo de la respuesta es el alumno que se espera encontrar
    expect(body).toEqual(alumnosRandom[0]);
  });

  test('debería responder estado 404 si no encuentra alumno', async () => {
    //Envía respuesta emulada a partir del mock de findOne
    const mockFindOne = jest.spyOn(alumno, 'findOne').mockImplementationOnce(() => (undefined));

    //Hace la petición HTTP que lanza findOne
    const { statusCode, body } = await request(app).get('/alum/1');

    //Comprueba la corrección de los resultados
    //El mock ha sido llamado una vez
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    //Código de estado
    expect(statusCode).toBe(404);
    //El cuerpo de la respuesta es un objeto vacío
    expect(body).toEqual({})
  });
});

describe('POST /alum', () => {
  test('debería registrar un nuevo alumno', async () => {
    //Envía respuesta emulada a partir del mock de create
    const mockCreate = jest.spyOn(alumno, 'create').mockImplementationOnce(() => (alumnosRandom[0]));
    //Crea un nuevo objeto en base a alumnosRandom[0] sin la propiedad 'id', no necesaria en el ingreso de datos en el body
    const bodyAlumno = Object.fromEntries(Object.entries(alumnosRandom[0]).slice(1));
    //Hace la petición HTTP que lanza create con los datos para 'body'
    const { statusCode, body } = await request(app).post('/alum').send(bodyAlumno);

    //Comprueba la corrección de los resultados
    //El mock ha sido llamado una vez
    expect(mockCreate).toHaveBeenCalledTimes(1);
    //Código de estado
    expect(statusCode).toBe(201);
    //El cuerpo de la respuesta es un objeto con las propiedades y valores correctos
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('estado', 'Éxito al crear alumno');
    expect(body).toHaveProperty('id', 1);
  });
});

describe('PUT /alum/:id', () => {
  test('debería actualizar un alumno por su ID', async () => {
    //Hace un clon de un alumno y le cambia el nombre
    clon = structuredClone(alumnosRandom[0])
    clon.nombre = 'Homero'
    //Emula un update de alumno devolviendo el clon con la propiedad cambiada
    const mockUpdate = jest.spyOn(alumno, 'update').mockImplementationOnce(() => (clon))
    //Agrega propiedad update a alumnosRandom[0] y le asigna el mockUpdate para simular la actualización del mismo
    alumnosRandom[0].update = mockUpdate

    //Emula findOne encontrando a 'alumnosRandom[0]'
    const mockFindOne = jest.spyOn(alumno, 'findOne').mockImplementationOnce(() => (alumnosRandom[0]))

    //Prepara el body para la request, el 'clon' sin id
    const bodyParaActualizar = Object.fromEntries(Object.entries(clon).slice(1));
    //Hace la petición HTTP que lanza findOne y update, enviando el body 'bodyParaActualizar'
    const { statusCode, body } = await request(app).put('/alum/1').send(bodyParaActualizar);

    //Comprueba la corrección de los resultados
    //Cada mock ha sido llamado una vez
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    //Código de estado
    expect(statusCode).toBe(200);
    //Responde con un objeto con las propiedades y valores correctos
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('estado', 'Éxito al actualizar alumno.')
    expect(body).toHaveProperty('actualizado')
    //'actualizado' contiene las propiedades y valores correctos
    const { actualizado } = body
    expect(actualizado).toHaveProperty('id', 1)
    expect(actualizado).toHaveProperty('nombre', 'Homero')
    expect(actualizado).toHaveProperty('apellido', 'Dórico')
  });
});

describe('DELETE /alum/:id', () => {
  test('debería eliminar un alumno por su ID', async () => {
    //Emula un destroy de alumno
    const mockDestroy = jest.spyOn(alumno, 'destroy').mockImplementationOnce(() => (1))

    //Agrega propiedad destroy y le asigna el mockDestroy para simular el borrado
    alumnosRandom[0].destroy = mockDestroy
    //Emula findOne encontrando a 'alumnosRandom[0]'
    const mockFindOne = jest.spyOn(alumno, 'findOne').mockImplementationOnce(() => (alumnosRandom[0]))

    //Hace la petición HTTP que lanza findOne y destroy
    const { status, text } = await request(app).delete('/alum/1')

    //Comprueba la corrección de los resultados
    //Cada mock ha sido llamado una vez
    expect(mockDestroy).toHaveBeenCalledTimes(1)
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    //Las propiedades de la respuesta tienen los valores esperados
    expect(status).toBe(200);
    expect(text).toBe('Éxito al eliminar alumno.');
  });
});
