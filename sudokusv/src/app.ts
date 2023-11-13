var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var app = express();
var auth=require('./config/auth');
var session=require('cookie-session');
const nocache=require('nocache');
import * as cors from 'cors';
import 'reflect-metadata';
import Connection from '../database/db';
import bodyParser from 'body-parser';
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  name:"Sudoku session",
  secret:auth.secret,
  httpOnly:true
}));
app.use(express.static(path.join(__dirname, 'views')));
app.use(cors());
app.use('/',indexRouter);
Connection();
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept"
  );
  next();
});
app.use(nocache());
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','jade');

export default app;