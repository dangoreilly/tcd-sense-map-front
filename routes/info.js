var express = require('express');
var router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv').config();

let token = process.env.STRAPI_BEARER;

const config = {
  headers: { Authorization: `Bearer ${token}` }
};

//const buildings = require('../models/building')

var default_image = {"src": "/public/images/TCDSenseMapLogo.svg", "alt":"No image available"};

/* GET info page. */
router.get('/:id', function(req, res, next) {
  
    axios.get(`https://tcd-sense-map-back-zssh2.ondigitalocean.app/api/buildings?filters[bldID][$eq]=${req.params.id}&populate=*`, config)
    .then(function (response) {
      // handle success
      console.log(response.status);
      let B = response.data.data[0].attributes;
      let images = [];

      let im = B.Gallery.data;

      // Process images for gallery, make sure one exists. Pass empty data if it doesn't
      let numImages = 1;
      if (im != null && im != []){
        im.forEach(element => {
          images.push({
            "url":element.attributes.url || "",
            "alt":element.attributes.alternativeText || "",
            "caption":element.attributes.caption || "",
            "index": numImages
          });
          //iterate over the number of images each time one is added to get the index for carousel
          numImages++;
        });
      }

      // Process image for top of page. If one doesn't exist, send the default
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

      // Process tips. Take in string with - delimiters and return a string array
      //that mustache will turn into a ul
      let tips = B.Tips.split("-") || "";
      // First element will probably be empty because of split.
      // Gotta pop, flip it and reverse it. Not in that order
      if (tips[0] == ""){
        tips.reverse();
        tips.pop();
        tips.reverse()
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
        "tips": tips || "",
  
        "primaryImage":{
          "src": _PrimaryImage.src || "",
          "alt": _PrimaryImage.src || ""
        },
  
        "images":images,
        "physicalAccess":B.PhysicalAccessLink || "#"
  
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
