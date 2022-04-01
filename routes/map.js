var express = require('express');
// const building = require('../models/building');
var router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv').config();

let token = process.env.STRAPI_BEARER;

const config = {
  headers: { Authorization: `Bearer ${token}` }
};

//const buildings = require('../models/building')

// var default_image = {"src": "/public/images/TCDSenseMapLogo.svg", "alt":"No image available"};

/* GET info page. */
router.get('/:id', function(req, res, next) {
  
  // axios.get(`https://tcd-sense-map-back-zssh2.ondigitalocean.app/api/buildings?filters[bldID][$eq]=${req.params.id}&populate=*`, config)
  // .then(function (response) {
  //   // handle success
  //   console.log(response.status);
    
  //   res.render('map', {buildingInfo});

  // })
  // .catch(function (error) {
  //   // handle error
  //   console.log(error);
  //   res.redirect("../");
  // })
  // .then(function () {
  //   // always executed
  //   return;
  // });

  let buildingInfo = "TestData";
    
  res.render('map', {buildingInfo});

});

module.exports = router;
