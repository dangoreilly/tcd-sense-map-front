var express = require('express');
const building = require('../models/building');
var router = express.Router();

//const building = require('../models/building')


router.post('/', function(req, res, next) {

    // res.json({
    //     confirmation:"success",
    //     building:req.body
    // });

    // return

    let findBuilding = {
        "name": req.body.name
        // "aka": req.body.aka,
        // "description": req.body.description,
        // "sensoryOverview": req.body.sensoryOverview,
        // "sensoryDetails": {
        //     "sounds": req.body.sounds,
        //     "sights": req.body.sights,
        //     "touch": req.body.touch,
        //     "movement": req.body.movement,
        //     "smell": req.body.smell
        // }

    };

    building.findOne(findBuilding, (err, building) => {
        if (err){
            res.json({
                confirmation:"fail",
                error:err,
                //building:building
            })
            return;
        }

        if (building == null){
            
            res.json({
                confirmation:"fail",
                building: "Building not found",
                searched: findBuilding
            });

            return;
        }

        res.json({
            confirmation:"success",
            building:building
        });

    });

});

module.exports = router;
