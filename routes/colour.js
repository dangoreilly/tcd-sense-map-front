var express = require('express');
var router = express.Router();

const buildings = require('../models/building')

/* GET home page. */
router.get('/', function(req, res, next) {

  let options = {
    pathColour:"#0087a2",
    buildingColour: "#c2f4fe",
    grassColour: "#fff0ad",
    plinthColour: "#00a29f"
  }

  res.render('custom_svg', {options});

});

module.exports = router;
