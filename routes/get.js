var express = require('express');
// const building = require('../models/building');
var router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv').config();

let token = process.env.STRAPI_BEARER;

const config = {
  headers: { Authorization: `Bearer ${token}` }
};

//var addBuildingRouter = require('./routes/addBuilding');

router.get('/', function(req, res, next) {

  res.redirect('../');

});

router.get('/all', function(req, res, next) {

  axios.get('https://tcd-sense-map-back-zssh2.ondigitalocean.app/api/buildings', config)
  .then(function (response) {
    // handle success
    console.log(response.status);
    let buildings = response.data;
    res.json(buildings);
    console.log("buildings read successfully from server");

  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
    return;
  });

});

module.exports = router;
