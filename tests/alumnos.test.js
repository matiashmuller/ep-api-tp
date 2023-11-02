const app = require('../app');
const request = require('supertest');
const modelos = require('../models');
//Workaround para problema de timeout
jest.useFakeTimers()
//Crea una función mock de modelos
jest.mock('../models');

describe('GET ALL /alum', () => {
    const alumno = modelos.alumno

    test('debería mostrar todos los alumnos contados y paginados', async () => {
        //Envía la respuesta necesaria a partir del mock de findAndCountAll
        await alumno.findAndCountAll.mockImplementation(() => ({
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

        //Hace la petición HTTP
        const response = await request(app).get('/alum');

        //Comprueba la corrección de los resultados
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty('elementos')
    })
});