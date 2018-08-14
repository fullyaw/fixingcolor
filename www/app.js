var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cors = require('cors');
var apiRouter = require('./routes/routes');
var bodyParser = require('body-parser');
//var busboy = require('connect-busboy');
var app = express();
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');

var whitelist = [
    'http://localhost:3000',
    'http://localhost:4200',  
];

var corsOptions = {
    origin: function(origin, callback){
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
};

var mongoose_conn = '';
var env = process.env.NODE_ENV || 'dev';
if (env == 'dev') {
  var mongoose_conn = 'mongodb://localhost/ColorNinja';
}  else {
  var mongoose_conn = config.database;  
}

//
//mongodb://localhost/ColorNinja

mongoose.connect(mongoose_conn, { promiseLibrary: require('bluebird') })
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));

app.use(passport.initialize());  
app.use(cors(corsOptions));    
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
//app.use(express.static(path.join(__dirname, 'dist/ColorNinja')));
app.use('/', express.static(path.join(__dirname, 'dist/ColorNinja')));
app.use('/css', express.static(path.join(__dirname, 'dist/ColorNinja/assets/css')));
app.use('/img', express.static(path.join(__dirname, 'dist/ColorNinja/assets/img')));
app.use('/api', apiRouter);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
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
  res.send(err.status);
});

module.exports = app;
