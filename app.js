var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var carrerasRouter = require('./routes/carreras');
var docentesRouter = require('./routes/docentes');
var alumnosRouter = require('./routes/alumnos');
var materiasRouter = require('./routes/materias');
var comisionesRouter = require('./routes/comisiones');
var al_matRouter = require('./routes/alumno_materia');
var car_matRouter = require('./routes/carrera_materia');
var authRouter = require('./routes/authorization');
const { swaggerDocs } = require('./swagger');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Documentación
swaggerDocs(app, process.env.PORT || 3000)
app.use('/auth', authRouter);
app.use('/car', carrerasRouter);
app.use('/doc', docentesRouter);
app.use('/alum', alumnosRouter);
app.use('/mat', materiasRouter);
app.use('/com', comisionesRouter);
app.use('/almat', al_matRouter);
app.use('/carmat', car_matRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
