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

const logger = createLogger({
    transports: [
        new transports.Console({
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
});

module.exports = logger;