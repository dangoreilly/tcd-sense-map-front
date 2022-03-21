var express = require('express');
const { status } = require('express/lib/response');
const building = require('../models/building');
var router = express.Router();

//const building = require('../models/building')

/* POST data. */
router.post('/', function(req, res, next) {

    console.log(req.body);
    // res.json({
    //     confirmation:"success",
    //     building:req.body
    // });

    // return

    if (req.body.name == ""){

        res.json({
            confirmation:"fail",
            error: new Error("Building has no name")
            //building:building
        })
        return;
    }

     if (building.findOne({name: req.body.name}, (err, building) => {
        if (err){
            res.json({
                confirmation:"fail",
                error:err,
                //building:building
            })
            return;
        }

        if (building == null){
            //Building doesn't exist yet, we can add it

            return false;
        }
        else return true;
        
    })){
        res.json({
            confirmation:"fail",
            error: new Error("building already exists"),
            status: 400
            //building:building
        })
        return;
    }
    else{

        let makeBuilding = {
            "name": req.body.name,
            "aka": req.body.aka,
            "description": req.body.description,
            "sensoryOverview": req.body.sensoryOverview,
            "sensoryDetails": {
                "sound": req.body.sound,
                "sight": req.body.sight,
                "touch": req.body.touch,
                "movement": req.body.movement,
                "smell": req.body.smell
            },
            "geometry": {
                "coordinates": req.body.coords,
            }
        }

        building.create(makeBuilding, (err, building) => {
            if (err){
                res.json({
                    confirmation:"fail",
                    error:err,
                    //building:building
                })
                return;
            }

            res.json({
                confirmation:"success",
                building:building
            });

            console.log("Added " + req.body.name + " to the database");

        });
        
    }

});

router.post('/py', function(req, res, next) {

    if (typeof req.body === 'object')
            data = req.body.responseJSON; // dont parse if its object
        
    else if (typeof req.body === 'string')
        data = JSON.parse(req.body).responseJSON; // parse if its string

        let makeBuilding = {
            "name": data.name,
            "aka": data.aka,
            "description": data.description,
            "sensoryOverview": data.sensoryOverview,
            "sensoryDetails": {
                "sound": data.sound,
                "sight": data.sight,
                "touch": data.touch,
                "movement": data.movement,
                "smell": data.smell
            },
            "geometry": {
                "coordinates": data.coords,
            }

        };

    building.create(makeBuilding, (err, building) => {
        if (err){
            res.json({
                confirmation:"fail",
                error:err,
                //building:building
            })
            return;
        }

        res.json({
            confirmation:"success",
            building:building
        });

        console.log("Added " + req.body.name + " to the database");

    });

});

module.exports = router;
