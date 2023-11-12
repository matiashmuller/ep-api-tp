const app = require('../app');
const request = require('supertest');
const modelos = require('../models');
const comision = modelos.comision
const materia = modelos.materia
const docente = modelos.docente

//Simula elementos presentes en la base de datos
const comisionesRandom = [
  { id: 1, letra: 'A', dias: 'Lunes', turno: 'Mañana', id_materia: 1, id_docente: 1 },
  { id: 2, letra: 'B', dias: 'Lunes', turno: 'Tarde', id_materia: 1, id_docente: 1 },
  { id: 3, letra: 'C', dias: 'Martes', turno: 'Mañana', id_materia: 1, id_docente: 2 }
]

describe('GET /com', () => {
  test('debería mostrar todas las comisions contados y paginados', async () => {
    //Envía respuesta emulada a partir del mock de findAndCountAll
    const mockFindAndCountAll = jest.spyOn(comision, 'findAndCountAll').mockImplementationOnce(() => ({
      rows: comisionesRandom,
      count: 3,
    }));

    //Hace la petición HTTP que lanza findAndCountAll
    const { statusCode, body } = await request(app).get('/com');

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
    expect(body).toHaveProperty('elementos', comisionesRandom)
  });
});

describe('GET /com/:id', () => {
  test('debería mostrar un comision por su ID', async () => {
    //Envía respuesta emulada a partir del mock de findOne
    const mockFindOne = jest.spyOn(comision, 'findOne').mockImplementationOnce(() => (comisionesRandom[0]));

    //Hace la petición HTTP que lanza findOne
    const { statusCode, body } = await request(app).get('/com/1');

    //Comprueba la corrección de los resultados
    //El mock ha sido llamado una vez
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    //Código de estado
    expect(statusCode).toBe(200);
    //El cuerpo de la respuesta es un objeto con las propiedades correspondientes
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('letra')
    expect(body).toHaveProperty('dias')
    expect(body).toHaveProperty('turno')
    expect(body).toHaveProperty('id_materia')
    expect(body).toHaveProperty('id_docente')
    //El cuerpo de la respuesta es el comision que se espera encontrar
    expect(body).toEqual(comisionesRandom[0]);
  });

  test('debería responder estado 404 si no encuentra comision', async () => {
    //Envía respuesta emulada a partir del mock de findOne
    const mockFindOne = jest.spyOn(comision, 'findOne').mockImplementationOnce(() => (undefined));

    //Hace la petición HTTP que lanza findOne
    const { statusCode, body } = await request(app).get('/com/1');

    //Comprueba la corrección de los resultados
    //El mock ha sido llamado una vez
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    //Código de estado
    expect(statusCode).toBe(404);
    //El cuerpo de la respuesta es un objeto vacío
    expect(body).toEqual({})
  });
});

describe('POST /com', () => {
  test('debería registrar un nuevo comisión', async () => {
    //Emula los 'findOne' en los modelos relacionados correspondientes, disparados por la comprobación de fks
    const mockComprobarFk1 = jest.spyOn(materia, 'findOne').mockReturnValueOnce({});
    const mockComprobarFk2 = jest.spyOn(docente, 'findOne').mockReturnValueOnce({});
    //Envía respuesta emulada a partir del mock de create
    const mockCreate = jest.spyOn(comision, 'create').mockImplementationOnce(() => (comisionesRandom[0]));
    //Crea un nuevo objeto en base a comisionesRandom[0] sin la propiedad 'id', no necesaria en el ingreso de datos en el body
    const bodycomision = Object.fromEntries(Object.entries(comisionesRandom[0]).slice(1));
    //Hace la petición HTTP que lanza create con los datos para 'body'
    const { statusCode, body } = await request(app).post('/com').send(bodycomision);

    //Comprueba la corrección de los resultados
    //Cada mock ha sido llamado una vez
    expect(mockComprobarFk1).toHaveBeenCalledTimes(1);
    expect(mockComprobarFk2).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledTimes(1);
    //Código de estado
    expect(statusCode).toBe(201);
    //El cuerpo de la respuesta es un objeto con las propiedades y valores correctos
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('estado', 'Éxito al crear comisión');
    expect(body).toHaveProperty('id', 1);
  });
});

describe('PUT /com/:id', () => {
  test('debería actualizar un comision por su ID', async () => {
    //Emula el 'findOne' en el modelo relacionado correspondiente, disparado por la comprobación de fks
    const mockComprobarFkCambiada = jest.spyOn(docente, 'findOne').mockReturnValueOnce({});
    //Hace un clon de una comision y le cambia el id_docente
    clon = structuredClone(comisionesRandom[0])
    clon.id_docente = 3
    //Emula un update de comision devolviendo el clon con la propiedad cambiada
    const mockUpdate = jest.spyOn(comision, 'update').mockImplementationOnce(() => (clon))
    //Agrega propiedad update a comisionesRandom[0] y le asigna el mockUpdate para simular la actualización del mismo
    comisionesRandom[0].update = mockUpdate

    //Emula findOne encontrando a 'comisionesRandom[0]'
    const mockFindOne = jest.spyOn(comision, 'findOne').mockImplementationOnce(() => (comisionesRandom[0]))

    //Hace la petición HTTP que lanza findOne y update, enviando el body 'bodyParaActualizar'
    const { statusCode, body } = await request(app).put('/com/1').send({ id_docente: 3 });

    //Comprueba la corrección de los resultados
    //Cada mock ha sido llamado una vez
    expect(mockComprobarFkCambiada).toHaveBeenCalledTimes(1);
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    //Código de estado
    expect(statusCode).toBe(200);
    //Responde con un objeto con las propiedades y valores correctos
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('estado', 'Éxito al actualizar comisión.')
    expect(body).toHaveProperty('actualizado')
    //'actualizado' contiene las propiedades y valores correctos
    const { actualizado } = body
    expect(actualizado).toHaveProperty('id', 1)
    expect(actualizado).toHaveProperty('letra', 'A')
    expect(actualizado).toHaveProperty('id_docente', 3)
  });
});

describe('DELETE /com/:id', () => {
  test('debería eliminar un comision por su ID', async () => {
    //Emula un destroy de comision
    const mockDestroy = jest.spyOn(comision, 'destroy').mockImplementationOnce(() => (1))

    //Agrega propiedad destroy y le asigna el mockDestroy para simular el borrado
    comisionesRandom[0].destroy = mockDestroy
    //Emula findOne encontrando a 'comisionesRandom[0]'
    const mockFindOne = jest.spyOn(comision, 'findOne').mockImplementationOnce(() => (comisionesRandom[0]))

    //Hace la petición HTTP que lanza findOne y destroy
    const { status, text } = await request(app).delete('/com/1')

    //Comprueba la corrección de los resultados
    //Cada mock ha sido llamado una vez
    expect(mockDestroy).toHaveBeenCalledTimes(1)
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    //Las propiedades de la respuesta tienen los valores esperados
    expect(status).toBe(200);
    expect(text).toBe('Éxito al eliminar comisión.');
  });
});
