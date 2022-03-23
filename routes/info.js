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

var default_image = {"src": "/public/images/TCDSenseMapLogo.svg", "alt":"No image available"};

/* GET home page. */
router.get('/:id', function(req, res, next) {
  
    axios.get(`https://tcd-sense-map-back-zssh2.ondigitalocean.app/api/buildings?filters[bldID][$eq]=${req.params.id}&populate=*`, config)
    .then(function (response) {
      // handle success
      console.log(response.status);
      let B = response.data.data[0].attributes;
      let images = [];

      let im = B.Gallery.data;

      if (im != null && im != []){
        im.forEach(element => {
          images.push({
            "url":element.attributes.url || "",
            "alt":element.attributes.alternativeText || "",
            "caption":element.attributes.caption || ""
          });
        });
      }
      let _PrimaryImage;

      if (B.PrimaryImage.data == null){
        _PrimaryImage = default_image;
      }
      else {
        _PrimaryImage = {
          "src":B.PrimaryImage.data.attributes.url || "",
          "alt":B.PrimaryImage.data.attributes.alternativeText || ""
        }
      }
      
      var buildingInfo = {
        "name":B.Name || "",
        "aka":B.aka || "",
        "description":B.Description || "",
        "sensoryOverview":B.SensoryOverview || "",

        "sensoryAvailable": (B.sensoryAvailable ? "block" : "none"),

        "sensoryDetails":{
          "sound":B.Sound || "",
          "sight":B.Sight || "",
          "touch":B.Touch || "",
          "movement":B.Movement || "",
          "smell":B.Smell || ""
        },
        "tips":B.Tips || "",
  
        "primaryImage":{
          "src": _PrimaryImage.src || "",
          "alt": _PrimaryImage.src || ""
        },
  
        "images":images
  
      }

      res.render('info', {buildingInfo});
  
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
    

});

module.exports = router;
