const mongoose = require("mongoose");

const building = new mongoose.Schema({
    name: {type:String, default:"Unknown", unique:true},
    type: {type:String, default:"Feature"},
    label: {type:String, default:""},
    aka: {type:String, default:""},
    description: {type:String, default:"No description"},
    sensoryOverview: {type:String, default:"No sensory overview"},
    sensoryDetails: {
        sound: {type:String, default:"No description"},
        sight: {type:String, default:"No description"},
        touch: {type:String, default:"No description"},
        movement: {type:String, default:"No description"},
        smell: {type:String, default:"No description"}
    },
    geometry: {
        type: {type:String, default:"Polygon"},
        coordinates: {type:[[[Number]]], default:[[[0,0], [0,1], [1,1], [1,0]]]}
    },
    images: [String]
},
{timestamps: true});

module.exports = mongoose.model("building", building);