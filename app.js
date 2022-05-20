var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// const mongoose = require("mongoose");
// const passport = require("passport");
// const session = require('express-session');

const dotenv = require('dotenv').config();

// const auth = {user: process.env.USER_ID, pass: process.env.USER_KEY};

// mongoose.connect("mongodb://tcdmap1:tpLbTSiWy2ikJWO58A8hfaVFcPRvP5JURfH1u7cBbUnhiNnBPLIvOlQnHotsrYRkPi3NN2OKj1uYHm6iGAiv4w==@tcdmap1.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@tcdmap1@", auth, (err,data) => {

//     if (err){
//         console.log("DB Connection Failed");
//         return
//     }

//     console.log("DB connection successful")

// });


var indexRouter = require('./routes/index');
// var addRouter = require('./routes/add');
// var addBuildingRouter = require('./routes/addBuilding');
// var updateRouter = require('./routes/update');
// var updateBuildingRouter = require('./routes/updateBuilding');
// var getBuildingRouter = require('./routes/getBuilding');
var getRouter = require('./routes/get');
var colourRouter = require('./routes/colour');
var infoRouter = require('./routes/info');
var mapRouter = require('./routes/map');

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hjs");
//app.set("view engine", "mustache");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/add', addRouter);
// app.use('/addBuilding', addBuildingRouter);
// app.use('/update', updateRouter);
// app.use('/updateBuilding', updateBuildingRouter);
// app.use('/getBuilding', getBuildingRouter);
app.use('/get', getRouter);
app.use('/colour', colourRouter);
app.use('/info', infoRouter);
app.use('/map', mapRouter);

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
