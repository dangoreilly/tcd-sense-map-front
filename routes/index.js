var express = require('express');
const building = require('../models/building');
var router = express.Router();

const buildings = require('../models/building')

/* GET home page. */
router.get('/', function(req, res, next) {

  buildings.find({}, (err, buildings_mongo) => {

    if (err){
      // res.json({
      //     confirmation: 'fail',
      //     error: err
      // });
      return next(err)
    }
  });

  res.render('index');

});

module.exports = router;
