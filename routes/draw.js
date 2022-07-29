var express = require('express');
var router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv').config();

let token = process.env.STRAPI_BEARER;

const config = {
  headers: { Authorization: `Bearer ${token}` }
};

// const buildings = require('../models/building')

/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.render('draw');
  
});


module.exports = router;
