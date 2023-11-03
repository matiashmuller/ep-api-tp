require('dotenv').config();
const { createLogger, transports, format } = require('winston');
const { combine, timestamp, printf, colorize, align } = format;
const transpMySql = require('winston-mysql');

/*
Opciones para el log en base de datos
Por defecto, la librería winston-mysql lanza error si no existe un password para la db
(inconveniente para casos como este), por lo que se hizo una pequeña modificación en
node_modules\winston-mysql\lib\mysql_transport.js:66:19
descartando dicha comprobación
*/
const opcionesTransp = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    table: 'logs',
    /*
    Se creó una tabla propia para logs, así que se asigna correspondencia con los
    campos por defecto de la librería
    */
    fields: {
        level: 'nivel',
        meta: 'metadata',
        message: 'mensaje',
        timestamp: 'createdAt'
    }
};

//Función que retorna el json para pasar en los logs como metadata, evita repetición de código
const loggerMeta = (req, res) => {
    return {
        codigo: res.statusCode,
        metodo: req.method,
        estado: res.statusMessage,
        ruta: req.baseUrl,
        subRuta: req.url,
        encabezados: req.headers
    }
};

//Transportes defecto para log a base de datos y consola en ambiente 'development'
var transportesEnv = [
    new transports.Console({
        //Formato solo para consola
        format: combine(
            colorize({ all: true }),
            timestamp({
                format: 'YYYY-MM-DD hh:mm:ss.SSS A',
            }),
            align(),
            printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
        )
    }),
    new transpMySql(opcionesTransp)
]

//Cambia 'transportesEnv' para log a solo a consola si es ambiente de pruebas
if (process.env.NODE_ENV === 'test') {
    transportesEnv = [
        new transports.Console({
            //Formato solo para consola
            format: combine(
                timestamp({
                    format: 'YYYY-MM-DD hh:mm:ss.SSS A',
                }),
                align(),
                printf((info) => `[${info.timestamp}] Prueba: ${info.message}`)
            )
        })
    ]
}

//Crea el logger
const logger = createLogger({
    //Loguea dependiendo del ambiente
    transports: transportesEnv
});

module.exports = { loggerMeta, logger };