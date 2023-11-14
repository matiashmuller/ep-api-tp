# Universidad Nacional de Hurlingham 
# Estrategias de persistencia

## Trabajo práctico: Desarrollo de API con Node.js y Sequelize

### Consigna

Desarrollar una API (Application Programming Interface) utilizando Node.js + Sequelize como ORM, en dos iteraciones de código.
1. Primera iteración: Clonar el proyecto de base https://gitlab.com/pmarcelli/unahur_alumnos_1_2020 y crear al menos dos entidades más, similares a la llamada "carreras" realizada en el mismo.
2. Segunda iteración: Realizar al menos una asociación a elección entre dos de las tablas creadas. Una vez finalizado esto, seguir incrementando funcionalidad, haciendo implementaciones de libre elección. Por ejemplo:
    * Paginación
    * JWT
    * Login
    * Test
    * Swagger
    * Logueo de peticiones en una tabla para registro de auditoría.
    * Asociaciones múltiples cruzadas.
    * Reestructuración / Refactorización del código.

## Sobre esta API

 Permite realizar operaciones CRUD en las entidades siguientes:
 - Carrera
 - Materia
 - Docente
 - Alumno
 - Comisión
 - Relacion alumno/materia
 - Relación carrera/materia.
 
 Además, contiene las entidades 'Log' para registrar las peticiones HTTP, y 'Usuario' para permitir el registro de quien/es hará/n uso de la misma, post inicio de sesión.

### Otras funcionalidades implementadas

- [x] Paginación
- [x] JWT
- [x] Login
- [x] Tests
- [x] Swagger
- [x] Logueo de peticiones en una tabla para registro de auditoría.
- [x] Asociaciones múltiples cruzadas.
- [x] Refactorización del código.
- [x] Seeders de ejemplo para poblar las tablas rápidamente.

### Tecnologías usadas

#### Entorno y SGBDR

- [Node.js](https://nodejs.org/en/download)

- [MySQL](https://dev.mysql.com/downloads/mysql/)

#### Dependencias

- Interacción con base de datos
  - [Sequelize](https://github.com/sequelize/cli)
  - [MySQL 2](https://www.npmjs.com/package/mysql2)

- Carga de variables de entorno
  - [dotenv](https://www.npmjs.com/package/dotenv)

- Seguridad e inicio de sesión
  - [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
  - [bcrypt](https://www.npmjs.com/package/bcrypt)

- Logueo de peticiones
  - [winston](https://www.npmjs.com/package/winston)
  - [winston-mysql](https://www.npmjs.com/package/winston-mysql)

- Tests unitarios
  - [Jest](https://jestjs.io/es-ES/docs/getting-started)
  - [SuperTest](https://www.npmjs.com/package/supertest)

- Validador de strings
  - [validator](https://www.npmjs.com/package/validator)

- Documentación
  - [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc)
  - [Swagger UI Express](https://www.npmjs.com/package/swagger-ui-express)

- Reinicio automático (sugerido)
  - [nodemon](https://www.npmjs.com/package/nodemon) 

### Para comenzar
- Crear base de datos.
- Clonar proyecto.
- Agregar en el directorio raíz tu archivo .env con las variables de entorno, por ejemplo:

  ```
  SECRET_KEY = stringhash

  NODE_ENV = 'development'

  API_PORT = 3000

  DB_USER = root
  DB_PASS = root
  DB_NAME = ep-api-tp
  DB_HOST = localhost
  DB_PORT = 3306
  DB_DIALECT = mysql
  ```
- Instalar dependencias

  ```
  npm i
  ```
- Crear las tablas

  ```
  npx sequelize-cli db:migrate
  ```
- Poblar tablas (opcional)

  ```
  npx sequelize-cli db:seed:all
  ```
  - Nota: En caso de usar esta opción, los datos del usuario ejemplo que será creado y con el que vas a poder iniciar sesión (con nombre o email), serán:

    ```
    //nombre: 'matiashm'
    email: 'matias@email.com'
    contraseña: '1234'
    ```
- Arrancar aplicación
  - Con nodemon

    ```
    npx nodemon
    ```
  - Sin nodemon

    ```
    npm start
    ```
- Una vez corriendo la API, para ver la documentación completa y probar funcionalidad, la ruta será http://localhost:3000/apiepdoc suponiendo el ejemplo de puerto 3000.