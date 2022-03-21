var express = require('express');
var router = express.Router();
const building = require('../models/building');

var ejs = require('ejs');
ejs.open = '{{';
ejs.close = '}}';

//   res.render('updateBuilding');

// });


router.get('/', function(req, res, next) {

    //Model being updated
    // let toUpdate = building.findOne({name: req.params.buildingName});
    console.log("Searching for " + req.query.name);

    if (req.query.name){

        building.findOne({name: req.query.name}, function (err, toUpdate) {

            if (err){

                console.log(err)
                return;

            }
            else if (toUpdate != null){

                let payload = {
                    name:toUpdate.name || "Unknown",
                    aka:toUpdate.aka || "Unknown",
                    label:toUpdate.label || "Unknown",
                    description:toUpdate.description || "Unknown",
                    overview:toUpdate.sensoryOverview || "Unknown",
                    sight:toUpdate.sensoryDetails.sight || "Unknown",
                    smell:toUpdate.sensoryDetails.smell || "Unknown",
                    sound:toUpdate.sensoryDetails.sound || "Unknown",
                    touch:toUpdate.sensoryDetails.touch || "Unknown",
                    movement:toUpdate.sensoryDetails.movement || "Unknown"
                }

                console.log("Payload : ", payload);
                res.render('updateBuilding', payload);
                //Mustache.render('updateBuilding', payload);
            }
            else console.log("Building note found");
            res.render('updateBuilding', {buildingnotfound: true});
        });

    }
    else{

        building.find({}, (err, buildings) => {

            if (err){

                res.json({

                    confirmation:"fail",
                    error:err
                    //building:building

                });
        
                console.log(err);
                
                return;
            }
        
            console.log("buildings read successfully from server");
            //console.log(buildings)
            //res.json(buildings);
            let options = "";
            
            buildings.forEach(element => {
                options = options + '<option value="' + element.name + '">' + element.name + '</option>';
            });

            res.render('updateBuilding', {options});

        });
    }

});

    //console.log(toUpdate);
    
    // res.json({
    //     confirmation:"debug",
    //     toUpdate:toUpdate,
    //     //building:building
    // })
    // return;
//     let payload = {
//         name:toUpdate.name,
//         aka:toUpdate.aka,
//         description:toUpdate.description,
//         overview:toUpdate.overview,
//         sight:toUpdate.sight,
//         smell:toUpdate.smell,
//         sound:toUpdate.sound,
//         touch:toUpdate.touch,
//         movement:toUpdate.movement
//     }
//     console.log("payload");
//     console.log(payload);

//   res.render('updateBuilding', payload);


module.exports = router;

