var express = require('express');
const building = require('../models/building');
var router = express.Router();

var ejs = require('ejs');
ejs.open = '{{';
ejs.close = '}}';

/* POST data. */
router.post('/', function(req, res, next) {

    // res.json({
    //     confirmation:"success",
    //     building:req.body
    // });

    // return

    console.log("Received"); console.log(req.body);

    let building_data = {
        "name": req.body.name,
        "aka": req.body.aka,
        "description": req.body.description,
        "label": req.body.description,
        "sensoryOverview": req.body.sensoryOverview,
        "sensoryDetails": {
            "sound": req.body.sound,
            "sight": req.body.sight,
            "touch": req.body.touch,
            "movement": req.body.movement,
            "smell": req.body.smell
        },
        "geometry":{
            "coordinates":req.body.coords
        }

    };

    console.log("searching for", req.body.name);
    
    if (req.body.updateName != null){
        building_data.name = req.body.updateName;
    }

    if (req.body.name == ""){

        res.json({
            confirmation:"fail",
            error: new Error("Building has no name")
            //building:building
        })
        console.log(error);
        return;
    }

    //building.findOne({name: req.body.name}, (err, building) => {

        building.findOneAndUpdate({name: req.body.name}, building_data, {upsert: true}, (err, building) => {
            if (err){
                res.json({
                    confirmation:"fail",
                    error:err,
                    //building:building
                })
                console.log(err)
                return;
            }

            res.json({
                confirmation:"success: " + req.body.name + " updated",
                building:req.body.name,
                previous:building,
                update:building_data
            });

        });
    //});

});


router.post('/coords', function(req, res, next) {

    let building_data = {
        "name": req.body.name,
        "geometry":{
            "coordinates":req.body.coords
        }
    };

    building.findOneAndUpdate({name: req.body.name}, building_data, {upsert: true}, (err, building) => {
        if (err){
            res.json({
                confirmation:"fail",
                error:err,
                //building:building
            })
            return;
        }

        res.json({
            confirmation:"successfully updated coordinates",
            building:building
        });

    });

});

router.post('/sharepoint', function(req, res, next) {

    let building_data = {
        "name": req.body.name,
        "aka": req.body.aka,
        "description": req.body.description,
        //"label": req.body.description,
        "sensoryOverview": req.body.sensoryOverview,
        "sensoryDetails": {
            "sound": req.body.sound,
            "sight": req.body.sight,
            "touch": req.body.touch,
            "movement": req.body.movement,
            "smell": req.body.smell
        }

    };

    building.findOneAndUpdate({name: req.body.name}, building_data, (err, building) => {
        if (err){
            res.json({
                confirmation:"fail",
                error:err,
                //building:building
            })
            return;
        }

        res.json({
            confirmation:"successfully updated from sharepoint",
            building:building_data
        });

    });

});

module.exports = router;
