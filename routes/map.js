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
  
  axios.get(`https://tcd-sense-map-back-zssh2.ondigitalocean.app/api/floors?filters[building][bldID][$eq]=${req.params.id}&populate[Layout][fields][0]=url&populate[building][fields][0]=Name`, config)
  .then(function (response) {
    // handle success
    console.log(response.status);
    let B = response.data.data;

    _floors = [];

    B.forEach(_floor => {
      _floors.push({
        floorID: _floor.id,
        floorImageURL: _floor.attributes.Layout.data.attributes.url,
        floorPosition: _floor.attributes.FloorPosition
      });
    });

    let buildingInfo = {
      name:B[0].attributes.building.data.attributes.Name,
      floors: _floors
    };
    
    res.render('map', {buildingInfo});
    // console.log(buildingInfo);

  })
  .catch(function (error) {
    // handle error
    console.log(error);
    res.redirect("../");
  })
  .then(function () {
    // always executed
    return;
  });

  // let buildingInfo = "TestData";
    
  // res.render('map', {buildingInfo});
  // console.log("Arts Rendered");

});

module.exports = router;
