var express = require('express');
const building = require('../models/building');
var router = express.Router();

//const buildings = require('../models/building')

/* GET home page. */
router.get('/:id', function(req, res, next) {

  console.log(req.params);

  if (req.params.id == "42"){

    let buildingInfo = {
      "name":"GMB",
      "id":req.params.id,
      "geometry":
      {"coordinates":[[[218.4,635.4],[218.4,617],[208,617],[208,614.6],[189.5,614.6],[189.5,617],[180.7,617],[180.7,635.4],[189.5,635.4],[189.5,637],[208,637],[208,635.4],[218.4,635.4]]]},"__v":0,"createdAt":{"$date":"2022-02-28T20:20:25.506Z"},"type":"Feature",
      "label":"",
      "aka":"Graduates Memorial Building",
      "description":"Many rooms large society rooms, with pool tables, debate chambers, social rooms, computer room, library and society meeting spaces.  ",
      "sensoryOverview":"Many Large rooms that hold many society events, can get busy but with several smaller or less use areas that you can use to get away. ",
      "sensoryDetails":{"sound":"Building is likely to be very loud with people moving up and down stairs, going in and out of rooms, however building is old and with doors closed not a lot of sound travels, the chamber room is also carpeted which reduces noise levels.  ",
      "sight":"Most rooms have large windows which let in a lot of natural light, though it could get dark and cold in the winter. ",
      "touch":"If extremely busy it's likely you may brush off people when moving around, though rooms and stairs are quite big so mostly you can avoid touching others, most rooms have squashy couches and arms chairs to sit in.  ",
      "movement":"The only access to upper levels is by stairs, so could be hard work for people of limited mobility. ",
      "smell":"No smell information"},

      "primaryImage":{
        "src":"https://tcd-sense-map-assets.fra1.digitaloceanspaces.com/demo/23.jpg",
        "caption":"Caption"
      },

      "images":[
        {
          "url":"https://tcd-sense-map-assets.fra1.digitaloceanspaces.com/demo/IMG_20200420_173857.jpg",
          "caption":"Caption 1"},
        {
          "url":"https://tcd-sense-map-assets.fra1.digitaloceanspaces.com/demo/IMG_20200416_204820.jpg",
          "caption":"Caption 2"},
        {
          "url":"https://tcd-sense-map-assets.fra1.digitaloceanspaces.com/demo/IMG_20200416_205155.jpg",
          "caption":"Caption 3"},
        {
          "url":"https://tcd-sense-map-assets.fra1.digitaloceanspaces.com/demo/IMG_20200416_204759.jpg",
          "caption":"Caption 4"},
      ]

    }
  
    res.render('info', {buildingInfo});

  }
  else {
  

    

    
  
    res.render('info', {buildingInfo});
  
  }

});

module.exports = router;
