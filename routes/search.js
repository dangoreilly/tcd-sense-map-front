var express = require('express');
var router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv').config();

let token = process.env.STRAPI_BEARER;

const config = {
  headers: { Authorization: `Bearer ${token}` }
};

// const buildings = require('../models/building')

/* GET home page. */
router.get('/', function(req, res, next) {

  axios.get(`https://tcd-sense-map-back-zssh2.ondigitalocean.app/api/buildings?fields=Name,aka,bldID,Description,infoPageEnabled,PhysicalAccessLink,mapped,ZoomedInLabel,ZoomedOutLabel&pagination[pageSize]=150&sort[1]=Name`, config)
    .then(function (response) {

      let A = response.data.data;
      // console.log(A.data);
      // console.log(response.data);

      var buildings = {
        "list":[
          // {"name":"Arts Building", "bldID":"arts-building", "aka":"| "+"Arts Block", "description":"Test Description"},
          // {"name":"GMB", "bldID":"graduate-memorial-building", "description":"Test Description"},
          // {"name":"D'Olier", "bldID":"dolier-st", "description":"Test Description"},
          // {"name":"TBSI", "aka":"| "+"Med building", "bldID":"tbsi", "description":"Test Description"},
          // {"name":"SNIAM", "aka":"| "+"Sami Nasir", "bldID":"sniam", "description":"Test Description"}
        ]
      }

      for (i = 0; i < A.length; i++){
        let B = A[i].attributes;

        let Paccess = false;
        if (B.PhysicalAccessLink != "" && B.PhysicalAccessLink != null){
          Paccess = true;
        }
        
        let _aka = "";
        let _akaList = [];
        if (B.aka != null && B.aka != ""){
          _aka = "| " + B.aka;
          _akaList = B.aka.split(",");
        }


        buildings.list.push({
          "Name": B.Name,
          "aka": _aka,
          "akaList": _akaList,
          "bldID": B.bldID,
          "ZoomedOutLabel": B.ZoomedOutLabel || "",
          "ZoomedInLabel": B.ZoomedInLabel || "",
          "Description": B.Description,
          "infoPageEnabled": B.infoPageEnabled || false,
          "PhysicalAccessLink": B.PhysicalAccessLink,
          "Paccess": Paccess, //Annoying inversion because Mustache is acting up
          "mapped":  B.mapped || false
        })
      }
      // console.log(buildings);

      res.render('search', {buildings});
    }
  );
});


module.exports = router;
