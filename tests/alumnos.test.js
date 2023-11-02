const app = require('../app');
const request = require('supertest');
const modelos = require('../models');
const alumno = modelos.alumno
//Workaround para problema de timeout con mysql
jest.useFakeTimers()

describe('GET ALL /alum', () => {
  test('debería mostrar todos los alumnos contados y paginados', async () => {
    //Envía respuesta emulada a partir del mock de findAndCountAll
    jest.spyOn(alumno, 'findAndCountAll').mockImplementationOnce(() => ({
      rows: [{
        id: 1,
        nombre: 'Jónico',
        apellido: 'Dórico',
        fecha_nac: '2000-07-25',
        id_carrera: 1
      }, {
        id: 2,
        nombre: 'Cariátides',
        apellido: 'Magencio',
        fecha_nac: '1998-02-19',
        id_carrera: 3
      }, {
        id: 3,
        nombre: 'Tito',
        apellido: 'Corintio',
        fecha_nac: '1990-10-30',
        id_carrera: 2
      }],
      count: 3,
    }));

    //Hace la petición HTTP que lanza findAndCountAll
    const response = await request(app).get('/alum');

    //Comprueba la corrección de los resultados
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('totalElementos')
    expect(response.body).toHaveProperty('totalPaginas')
    expect(response.body).toHaveProperty('paginaNro')
    expect(response.body).toHaveProperty('elementos')
    expect(response.body.totalElementos).toBe(3)
    expect(response.body.totalPaginas).toBe(1)
    expect(response.body.paginaNro).toBe(1)
    expect(response.body.elementos).toEqual([{
      id: 1,
      nombre: 'Jónico',
      apellido: 'Dórico',
      fecha_nac: '2000-07-25',
      id_carrera: 1
    }, {
      id: 2,
      nombre: 'Cariátides',
      apellido: 'Magencio',
      fecha_nac: '1998-02-19',
      id_carrera: 3
    }, {
      id: 3,
      nombre: 'Tito',
      apellido: 'Corintio',
      fecha_nac: '1990-10-30',
      id_carrera: 2
    }]);
  });
});

describe('GET /alum/:id', () => {
  test('debería mostrar un alumno por su ID', async () => {
    //Envía respuesta emulada a partir del mock de findOne
    jest.spyOn(alumno, 'findOne').mockImplementationOnce(() => ({
      id: 1,
      nombre: 'Jónico',
      apellido: 'Dórico',
      fecha_nac: '2000-07-25',
      id_carrera: 1
    }
    ));

    //Hace la petición HTTP que lanza findOne
    const response = await request(app).get('/alum/1');

    //Comprueba la corrección de los resultados
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toEqual({
      id: 1,
      nombre: 'Jónico',
      apellido: 'Dórico',
      fecha_nac: '2000-07-25',
      id_carrera: 1
    });
  });

  test('debería responder estado 404 si no encuentra alumno', async () => {
    //Envía respuesta emulada a partir del mock de findOne
    jest.spyOn(alumno, 'findOne').mockImplementationOnce(() => (undefined));

    //Hace la petición HTTP que lanza findOne
    const response = await request(app).get('/alum/1');

    //Comprueba la corrección de los resultados
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({})
  });
});