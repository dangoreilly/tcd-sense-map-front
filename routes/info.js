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

/* GET home page. */
router.get('/:id', function(req, res, next) {

  console.log(req.params);

  if (req.params.id == "42"){

    
  
    res.render('info', {buildingInfo});

  }
  else{
  
    axios.get(`https://tcd-sense-map-back-zssh2.ondigitalocean.app/api/buildings?filters[bldID][$eq]=${req.params.id}&populate=*`, config)
    .then(function (response) {
      // handle success
      console.log(response.status);
      let B = response.data.data[0].attributes;
      let images = [];

      let im = B.Gallery.data;

      im.forEach(element => {
        images.push({
          "url":element.attributes.url,
           "alt":element.attributes.alternativeText || "",
          "caption":element.attributes.caption || ""
        });
      });
      
      var buildingInfo = {
        "name":B.Name || "",
        "aka":B.aka || "",
        "description":B.Description || "",
        "sensoryOverview":B.sensoryDetails || "",

        "sensoryDetails":{
          "sound":B.Sound || "",
          "sight":B.Sight || "",
          "touch":B.Touch || "",
          "movement":B.Movement || "",
          "smell":B.Smell || ""
        },
        "tips":B.Tips || "",
  
        "primaryImage":{
          "src":B.PrimaryImage.data.attributes.url,
          "alt":B.PrimaryImage.data.attributes.alternativeText || ""
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
    

    
  
  
  }

});

module.exports = router;
