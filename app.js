var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');

var devices = require('./routes/devices');
var positions = require('./routes/positions');

// load mongoose package
var mongoose = require('mongoose');

// Use native Node promises
mongoose.Promise = global.Promise;

// connect to MongoDB
var conn = 'mongodb://dbuser:dbuser@ds157571.mlab.com:57571/ecoretest';


mongoose.connect(conn)
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());

app.use('/devices', devices);
app.use('/positions', positions);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500 || 400);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500 || 400);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;