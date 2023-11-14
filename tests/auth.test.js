const app = require('../app');
const request = require('supertest');
const modelos = require('../models')
const usuario = modelos.usuario
const bcrypt = require('bcrypt');

const usuarioRandom = { id: 1, nombre: 'Arquímedes', email: 'arquimedes@mail.com', contraseña: "3232" }
//Devuelve un objecto igual a usuarioRandom pero sin 'id': {nombre, email, contraseña}
const bodyRegistro = Object.fromEntries(Object.entries(usuarioRandom).slice(1))
//Devuelve un objecto igual a bodyRegistro pero sin 'nombre': {email, contraseña}
const bodyLogin = Object.fromEntries(Object.entries(bodyRegistro).slice(1, 3))

describe('POST /auth/registro', () => {
  test('debería registrar un nuevo usuario', async () => {
    //Mock de create usuario que devuelve usuarioRandom
    const mockCreate = jest.spyOn(usuario, 'create').mockImplementationOnce(() => (usuarioRandom));

    //Hace la petición HTTP que lanza create enviando como body 'bodyRegistro'
    const { statusCode, body } = await request(app).post('/auth/registro').send(bodyRegistro);

    //Comprueba la corrección de los resultados
    //El mock ha sido llamado una vez
    expect(mockCreate).toHaveBeenCalledTimes(1);
    //Código de estado
    expect(statusCode).toBe(201);
    //El cuerpo de la respuesta es un objeto con las propiedades y valores correctos
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('estado', 'Éxito al registrar usuario. Usuario nuevo: Arquímedes.');
    expect(body).toHaveProperty('token');
  });
});

describe('POST /auth/login', () => {
  test('debería iniciar sesión de un usuario', async () => {
    //Mock de findOne usuario que emula encontrar a usuarioRandom
    const mockFindOne = jest.spyOn(usuario, 'findOne').mockImplementationOnce(() => (usuarioRandom));
    //Mock de bcrypt.compare() que emula comparación de contraseña hasheada correcta (responde 'true')
    const mockBcrypt = jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(true);

    //Hace la petición HTTP que lanza 'findOne' y compara la contraseña, enviando como cuerpo 'bodyLogin'
    const { statusCode, body } = await request(app).post('/auth/login').send(bodyLogin);

    //Comprueba la corrección de los resultados
    //Cada mock ha sido llamado una vez
    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(mockBcrypt).toHaveBeenCalledTimes(1);
    //Código de estado
    expect(statusCode).toBe(200);
    //El cuerpo de la respuesta es un objeto con las propiedades y valores correctos
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('estado', 'Éxito al iniciar sesión. Usuario autenticado: Arquímedes.');
    expect(body).toHaveProperty('token');
  });

  test('debería responder estado 404 si no encuentra al usuario', async () => {
    //Envía respuesta emulada a partir del mock de findOne
    const mockFindOne = jest.spyOn(usuario, 'findOne').mockImplementationOnce(() => (undefined));

    //Hace la petición HTTP que lanza findOne
    const { statusCode, body } = await request(app).post('/auth/login').send(bodyLogin);

    //Comprueba la corrección de los resultados
    //El mock ha sido llamado una vez
    expect(mockFindOne).toHaveBeenCalledTimes(1)
    //Código de estado
    expect(statusCode).toBe(404);
    //El cuerpo de la respuesta es un objeto vacío
    expect(body).toEqual({})
  });
});

describe('GET /auth/cuenta', () => {
  test('debería mostrar la cuenta del usuario autenticado', async () => {
    //Mock de findOne usuario que emula encontrar a usuarioRandom
    const mockFindOne = jest.spyOn(usuario, 'findOne').mockImplementationOnce(() => (usuarioRandom));

    //Hace la petición HTTP que lanza 'findOne'
    const { statusCode, body } = await request(app).get('/auth/cuenta');

    //Comprueba la corrección de los resultados
    //El mock ha sido llamado una vez
    expect(mockFindOne).toHaveBeenCalledTimes(1);
    //Código de estado
    expect(statusCode).toBe(200);
    //El cuerpo de la respuesta es un objeto con las propiedades y valores correctos
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('estado', 'Éxito al mostrar cuenta.');
    expect(body).toHaveProperty('usuario');
    expect(body.usuario).toHaveProperty('id', 1);
    expect(body.usuario).toHaveProperty('nombre', 'Arquímedes');
    expect(body.usuario).toHaveProperty('email', 'arquimedes@mail.com')
  });
});

describe('GET /auth/logout', () => {
  test('debería cerrar sesión', async () => {
    //Hace la petición HTTP que cierra la sesión
    const { statusCode, text } = await request(app).get('/auth/logout');

    //Comprueba la corrección de los resultados
    //Código de estado
    expect(statusCode).toBe(200);
    expect(text).toBe('Éxito al cerrar sesión.')
  });
});