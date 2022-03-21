var express = require('express');
const building = require('../models/building');
var router = express.Router();

//var addBuildingRouter = require('./routes/addBuilding');

router.get('/', function(req, res, next) {

  res.redirect('../');

});

router.get('/all', function(req, res, next) {

  let protoBuilding = {
    "id": 1,
    "attributes": {
        "Name": "Graduate Memorial Building",
        "bldID": "graduate-memorial-building",
        "Description": "No description available",
        "SensoryOverview": "No Sensory Overview",
        "ZoomedInLabel": "GMB",
        "ZoomedOutLabel": "GMB",
        "geometry": null,
        "sensoryAvailable": false,
        "aka": "GMB",
        "Sight": "No description available",
        "Smell": "No description available",
        "Sound": "No description available",
        "Touch": "No description available",
        "Movement": null,
        "Tips": "No tips for this area",
        "infoPageEnabled": true,
        "createdAt": "2022-03-21T20:24:10.107Z",
        "updatedAt": "2022-03-21T20:24:15.148Z",
        "publishedAt": "2022-03-21T20:24:15.144Z",
        "locale": "en"
    }
  };

  

  building.find({}, (err, buildings) => {
    if (err){
        res.json({
            confirmation:"fail",
            error:err,
            //building:building
        });

        console.log(err);
        
        return;
    }

    console.log("buildings read successfully from server");
    //console.log(buildings)
    res.json(buildings);

    return;

  });

});

module.exports = router;
