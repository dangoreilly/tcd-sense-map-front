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
  //TODO: Handshake to get total and then request that. Hardcoded limit will not be a good SOP when rooms get involved
  axios.get('https://tcd-sense-map-back-zssh2.ondigitalocean.app/api/buildings?pagination[pageSize]=100', config)
  .then(function (response) {
    // handle success
    console.log(response.status);
    let buildings = [];
    let _buildings = response.data.data;
    // console.log(_buildings[0]);

    _buildings.forEach(element => {

      let attribs = element.attributes;

      let buildingInfo = {
        "name": attribs.Name || "NO NAME",
        "aka": attribs.aka || "",
        "bldID": attribs.bldID || "error",
        "description": attribs.Description || "No description available",
        "sensoryOverview": attribs.SensoryOverview || "No sensory overview available",

        "infoPageEnabled": attribs.infoPageEnabled || false,
        "sensoryAvailable": attribs.sensoryAvailable || false,
        "PhysicalAccessLink":attribs.PhysicalAccessLink || "#",

        "ZoomedInLabel": attribs.ZoomedInLabel || "",
        "ZoomedOutLabel": attribs.ZoomedOutLabel || "",
        "mapped": attribs.mapped || false
  
      }

      buildings.push({
        "properties": buildingInfo, 
        "type":"Feature", 
        "geometry":{
          "type": "Polygon",
          "coordinates":element.attributes.geometry.coordinates
        }
      });
      
    });

    // let buildings = response.data;
    // console.log(buildings[0]);
    // console.log(buildings[0].geometry);
    res.json(buildings);
    console.log("buildings read successfully from database");

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

router.get('/areas', function(req, res, next) {
  //TODO: Handshake to get total and then request that. Hardcoded limit will not be a good SOP when rooms get involved
  axios.get('https://tcd-sense-map-back-zssh2.ondigitalocean.app/api/outdoor-areas?pagination[pageSize]=100&populate=*', config)
  .then(function (response) {
    // handle success
    console.log(response.status);
    let areas = [];
    let _areas = response.data.data;
    // console.log(_buildings[0]);

    _areas.forEach(element => {

      areas.push({
        "properties":element.attributes,
        "type":"Feature", 
        "geometry":{
          "type": "Point",
          "coordinates":element.attributes.location.coordinates
        }
      });
      
    });

    // let buildings = response.data;
    // console.log(buildings[0]);
    // console.log(buildings[0].geometry);
    res.json(areas);
    console.log("areas read successfully from database");
    // console.log(areas);

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
