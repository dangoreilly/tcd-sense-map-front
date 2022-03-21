var express = require('express');
const building = require('../models/building');
var router = express.Router();

//var addBuildingRouter = require('./routes/addBuilding');

router.get('/', function(req, res, next) {

  res.render('getBuilding');

});

router.get('/all', function(req, res, next) {

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
