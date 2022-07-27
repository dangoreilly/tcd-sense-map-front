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
    // console.log(response.status);
    let buildings = [];
    let _buildings = response.data.data;
    // console.log(_buildings[0]);

    _buildings.forEach(element => {

      let attribs = element.attributes;

      let buildingInfo = {
        "Name": attribs.Name || "NO NAME",
        "aka": attribs.aka || "",
        "bldID": attribs.bldID || "error",
        "Description": attribs.Description || "No description available",
        "SensoryOverview": attribs.SensoryOverview || "No sensory overview available",

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
          "coordinates":element.attributes.geometry.coordinates || [[[0,0],[1,1]]]
        }
      });
      
    });

    // let buildings = response.data;
    // console.log(buildings[0]);
    // console.log(buildings[0].geometry);
    res.json(buildings);
    // console.log("buildings read successfully from database");

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
    // console.log(response.status);
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
    // console.log("areas read successfully from database");
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

router.get('/overlays', function(req, res, next) {
  axios.get('https://tcd-sense-map-back-zssh2.ondigitalocean.app/api/overlays?populate=*&fields=bounds,drawOverBuildings', config)
  .then(function (response) {
    // handle success
    let overlays = [];
    let _overlays = response.data.data;

    _overlays.forEach(element => {

      let zIndex = 1;
      if (element.attributes.drawOverBuildings){
        zIndex = 200;
      }

      overlays.push({
        "url":element.attributes.Image.data.attributes.url,
        "bounds":element.attributes.Bounds, 
        "zIndex":zIndex
      });
      
    });
    res.json(overlays);

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



router.get('/shortcuts', function(req, res, next) {
  axios.get('https://tcd-sense-map-back-zssh2.ondigitalocean.app/api/overlays?populate=*&fields=bounds,drawOverBuildings', config)
  .then(function (response) {
    // handle success
    let overlays = [];
    let _overlays = response.data.data;

    _overlays.forEach(element => {

      let zIndex = 1;
      if (element.attributes.drawOverBuildings){
        zIndex = 200;
      }

      overlays.push({
        "url":element.attributes.Image.data.attributes.url,
        "bounds":element.attributes.Bounds, 
        "zIndex":zIndex
      });
      
    });
    res.json(overlays);

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
