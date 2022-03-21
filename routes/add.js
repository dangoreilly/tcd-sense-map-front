var express = require('express');
const building = require('../models/building');
var router = express.Router();
var ejs = require('ejs');
ejs.open = '{{';
ejs.close = '}}';

//var addBuildingRouter = require('./routes/addBuilding');

router.get('/', function(req, res, next) {

  res.render('addBuilding');

});

module.exports = router;
