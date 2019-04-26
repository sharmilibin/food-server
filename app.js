var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/loginRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.options('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With'
  );
  res.send(200);
});

function auth(req, res, next) {
  var authHeader = req.headers.authorization;
  if (!authHeader) {
    var err = new Error('You r not authenticated No Header');
    res.setHeader('wwww-authenticate', 'Basic');
    err.status = 401;
    next(err);
    return;
  } else {
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64')
      .toString()
      .split(':');
    var user = auth[0];
    var password = auth[1];
    if (user === 'sharmi' && password === 'libin') {
      next();
    } else {
      var err = new Error('User Name and Password Missmatch');
      res.setHeader('www-authenticate', 'Basic');
      err.status = 401;
      next(err);
    }
  }
}

app.use(auth);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);

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
