var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');
var jwt = require('jsonwebtoken');

mongoose.connect(config.databaseUrl);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var shipmentsRouter = require('./routes/shipments');
var settingsRouter = require('./routes/settings');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  try {
    if (req.path === '/users/login' || req.path === '/users/register') {
      next();
      return;
    }
    var bearer = req.header('Authorization');
    if (!bearer) {
      throw new Error('No authorization header');
    }
    bearer = bearer.replace('Bearer', '').trim();
    var decoded = jwt.verify(bearer, config.tokenSecret);
    if (!decoded.userId) {
      throw new Error('Unknown user');
    }
    next();
  } catch (e) {
    res.status(403).json({error: 'No access!'});
  }
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/shipments', shipmentsRouter);
app.use('/settings', settingsRouter);

app.get('/test/:testparam', function(req, res){ // echo test
  res.status(200);
  res.end('Hello ' + req.params.testparam + '!');
});

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
