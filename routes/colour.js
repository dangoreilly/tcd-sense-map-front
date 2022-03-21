var express = require('express');
const building = require('../models/building');
var router = express.Router();

const buildings = require('../models/building')

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('colour');

});

module.exports = router;
