const app = require('../app');
const request = require('supertest');
const modelos = require('../models');
const alumno = modelos.alumno
//Workaround para problema de timeout con mysql
//jest.useFakeTimers()

const alumnosRandom = [
  { id: 1, dni: 40222333, nombre: 'Jónico', apellido: 'Dórico', fecha_nac: '2000-07-25', id_carrera: 1 },
  { id: 2, dni: 35123545, nombre: 'Cariátides', apellido: 'Magencio', fecha_nac: '1998-02-19', id_carrera: 3 },
  { id: 3, dni: 28545326, nombre: 'Tito', apellido: 'Corintio', fecha_nac: '1990-10-30', id_carrera: 2 }
]

describe('GET ALL /alum', () => {
  test('debería mostrar todos los alumnos contados y paginados', async () => {
    //Envía respuesta emulada a partir del mock de findAndCountAll
    const mockFindAndCountAll = jest.spyOn(alumno, 'findAndCountAll').mockImplementationOnce(() => ({
      rows: alumnosRandom,
      count: 3,
    }));

    //Hace la petición HTTP que lanza findAndCountAll
    const { statusCode, body } = await request(app).get('/alum');

    //Comprueba la corrección de los resultados
    expect(mockFindAndCountAll).toHaveBeenCalled()
    expect(statusCode).toBe(200);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('totalElementos')
    expect(body).toHaveProperty('totalPaginas')
    expect(body).toHaveProperty('paginaNro')
    expect(body).toHaveProperty('elementos')
    expect(body.totalElementos).toBe(3)
    expect(body.totalPaginas).toBe(1)
    expect(body.paginaNro).toBe(1)
    expect(body.elementos).toEqual(alumnosRandom);
  });
});

describe('GET /alum/:id', () => {
  test('debería mostrar un alumno por su ID', async () => {
    //Envía respuesta emulada a partir del mock de findOne
    const mockFindOne = jest.spyOn(alumno, 'findOne').mockImplementationOnce(() => (alumnosRandom[0]));

    //Hace la petición HTTP que lanza findOne
    const { statusCode, body } = await request(app).get('/alum/1');

    //Comprueba la corrección de los resultados
    expect(mockFindOne).toHaveBeenCalled()
    expect(statusCode).toBe(200);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('dni')
    expect(body).toHaveProperty('nombre')
    expect(body).toHaveProperty('apellido')
    expect(body).toHaveProperty('fecha_nac')
    expect(body).toHaveProperty('id_carrera')
    expect(body).toEqual(alumnosRandom[0]);
  });

  test('debería responder estado 404 si no encuentra alumno', async () => {
    //Envía respuesta emulada a partir del mock de findOne
    const mockFindOne = jest.spyOn(alumno, 'findOne').mockImplementationOnce(() => (undefined));

    //Hace la petición HTTP que lanza findOne
    const { statusCode, body } = await request(app).get('/alum/1');

    //Comprueba la corrección de los resultados
    expect(mockFindOne).toHaveBeenCalled()
    expect(statusCode).toBe(404);
    expect(body).toEqual({})
  });
});

describe('POST /alum', () => {
  test('debería registrar un nuevo alumno', async () => {
    //Envía respuesta emulada a partir del mock de create
    const mockCreate = jest.spyOn(alumno, 'create').mockImplementationOnce(() => (alumnosRandom[0]));

    //Quita de alumnosRandom[0] la propiedad 'id' no necesaria en el ingreso de datos en el body
    const bodyAlumno = Object.fromEntries(Object.entries(alumnosRandom[0]).slice(1));
    //Hace la petición HTTP que lanza create con los datos para 'body'
    const { statusCode, body } = await request(app).post('/alum').send(bodyAlumno);

    //Comprueba la corrección de los resultados
    expect(mockCreate).toHaveBeenCalled();
    expect(statusCode).toBe(201);
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('estado');
    expect(body.estado).toBe('Éxito al crear alumno');
    expect(body).toHaveProperty('id');
    expect(body.id).toBe(1);
  });
});