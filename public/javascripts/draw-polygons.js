
const draft_map = L.map('draft', {
    // crs: L.CRS.Simple,
    //fullscreenControl: true
    zoomSnap: 0.25,
    zoomDelta: 0.25,
    maxZoom: 20,
    // renderer: L.canvas({padding: 1})
});


L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', { //rastertiles/voyager_nolabels
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    // maxNativeZoom: 18,
    maxZoom:20

}).addTo(draft_map);

//Drawing controls in the top left corner
draft_map.pm.addControls({  
    position: 'topleft',  
    drawCircle: false,  
    drawCircleMarker: false,
    drawText: false,
    drawPolyline: false,
    editMode: false,
    rotateMode: false,
    drawMarker:false,
    cutPolygon:false,
    drawRectangle:false
  });

var bounds_campus = [
[53.345568, 353.740572],
[53.341853, 353.750523]
];

draft_map.fitBounds(bounds_campus); 
draft_map.setZoom(17.5);


var _buildings = [];

$.ajax({
  type: "GET",
  async: false,
  dataType: "json",
  url: 'get/buildings',
  complete: function(data) {
      
      //console.log("data");
      //console.log($.parseJSON(data));
      //_buildings = $.parseJSON(data);

      if (typeof data === 'object')
          _buildings = data.responseJSON; // dont parse if its object
      
      else if (typeof data === 'string')
      _buildings = JSON.parse(data).responseJSON; // parse if its string

      //  console.log(JSON.stringify(_buildings[0], null, 1));
      setBuildings(_buildings);

  }
});


function setBuildings(blds){
  _buildings = blds;
      //console.log(_buildings);
}

var editedStyle = {

  fillColor: '#E53397',
  weight: 1,
  opacity: 1,
  color: '#FCE891',
  dashArray: '0',
  fillOpacity: 0.5,
  noClip:true
};


var unEditedStyle = {

  fillColor: '#0087A2',
  weight: 1,
  opacity: 1,
  color: '#FCE891',
  dashArray: '0',
  fillOpacity: 1,
  noClip:true
};



function style(feature) {

  return unEditedStyle    

}

let centerMarker = L.marker(draft_map.getCenter())

draft_map.on("move", e=> {

  centerMarker.setLatLng(draft_map.getCenter());

})

function toggleCenterView(){

  //First flip the value
  showCenter = !showCenter;

  //Then add or remove the center marker
  if (showCenter) centerMarker.addTo(draft_map);
  else centerMarker.remove();

}

function onEachFeature(feature, layer){

  layer.pm.enable()

  layer.on("pm:update", (d) => {
    // console.log("Edit mode exited");
    // pushCoordsToModal(feature.properties.Name, d.layer._latlngs[0]);
    layer.setStyle(editedStyle)
  })

  layer.on("click", (d) => {
    // console.log(d)
    pushCoordsToModal(feature.properties.Name, d.target._latlngs[0]);
  })

  //If the user right clicks on the building, toggle its ability to be edited
  layer.on("contextmenu", (d) => {
    // console.log(d)
    // pushCoordsToModal(feature.properties.Name, d.target._latlngs[0]);
    layer.pm.toggleEdit();

    //Once toggled, change the opacity to give visual feedback
    if(layer.pm.enabled()){
      layer.setStyle({fillOpacity:0.5})
    }
    else {
      layer.setStyle({fillOpacity:1})
    }
  })

}

var geojson = L.geoJson(_buildings, {
  style: style,
  onEachFeature: onEachFeature

}).addTo(draft_map);

// Mouse readout for top right corner
var info = L.control({  
  position: 'topright'
});

var showCenter = false;

info.onAdd = function (draft_map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    let center = draft_map.getCenter()
    this.update([center.lng,center.lat]);
    return this._div;
};

info.update = function(coords){
  //Mouse readout
  info._div.innerHTML = `<h4 style="width:14vw">Mouse</h4><p>[${coords[0]},<br>${coords[1]}]</p>`;

  //Check if the toggle switch was toggled
  let center_check = showCenter ? "checked" : "";
  //toggle to display center marker
  info._div.innerHTML += `<div class="form-check form-switch"><input class="form-check-input" type="checkbox" role="switch" id="centerMarkerToggleSwitch" ${center_check} onclick="toggleCenterView()"><label class="form-check-label" for="centerMarkerToggleSwitch">Show screen center</label></div>`;
  //Button to acquire centre
  info._div.innerHTML += `<div class="d-grid gap-2"><button type="button" id="getCenterButton" class="btn btn-primary btn-sm" onclick="printCenter()" style="margin-top:0;">Screen Center</button></div>`


}

//handling of the getCenterButton
function printCenter(){
  let center = draft_map.getCenter();

  pushCoordsToModal("Centre of the screen", [center])
}


info.addTo(draft_map);

draft_map.on("mousemove", e => {

  info.update([e.latlng.lng, e.latlng.lat]);

})



draft_map.on('pm:create', (e) => {
  // console.log(stringyCoords(e.layer._latlngs[0]));
  pushCoordsToModal("New Building", e.layer._latlngs[0]);
  // console.log(e.layer._latlngs[0]);

  e.layer.on("pm:update", (d) => {
    // console.log("Edit mode exited");
    pushCoordsToModal("New Building", d.layer._latlngs[0]);
  })

  e.layer.on("click", (d) => {
    // console.log("Layer Clicked")
    pushCoordsToModal("New Building", d.target._latlngs[0]);
  })
  
  e.layer.on("contextmenu", (d) => {
    // console.log(d)
    // pushCoordsToModal(feature.properties.Name, d.target._latlngs[0]);
    e.layer.pm.toggleEdit();
  })
});

function stringyCoords(latlngs){
  // let returnString = "[<br>&emsp;[";

  // for(i = 0; i < latlngs.length; i++){
    
  //   returnString += `<br>&emsp;&emsp;[<br>&emsp;&emsp;&emsp;${latlngs[i].lng},<br>&emsp;&emsp;&emsp;${latlngs[i].lat}<br>&emsp;&emsp;]`
    
  //   if(i < latlngs.length-1){
      
  //     returnString += `,`

  //   }
  // }

  let returnString = "\n\t[\n\t\t[";

  for(i = 0; i < latlngs.length; i++){
    
    returnString += `\n\t\t\t[\n\t\t\t\t${latlngs[i].lng},\n\t\t\t\t${latlngs[i].lat}\n\t\t\t]`
    
    if(i < latlngs.length-1){
      
      returnString += `,`

    }
  }

  returnString += "\n\t\t]\n\t]\n";

  return returnString
}

function pushCoordsToModal(name, latlngs){

  let _title = `${name} Coordinates`;

  let coords = `{"coordinates": ${stringyCoords(latlngs)}}`

  let _bodyhtml = `<b>Copy and paste these into the CMS to update the geometry</b><div class="container" style="height:40vh"><textarea readonly=true class="code">${coords}</textarea></div>`


  openInfoModal(_title, _bodyhtml, [])
}

// polyg.on("click", function (e){


//     // openInfoModal(feature.properties.Name, modal_content, [modal_info_button, modal_physical_access_button, modal_map_button]);
//     console.log("Polyg clicked")

// });



// function draw_clicks(mymap, e){

//     coordinates_array = [...coordinates_array, [e.latlng["lat"], e.latlng["lng"]]];

//     polyg.setLatLngs(coordinates_array);
//     polyg.setStyle({opacity:1});
//     polyg.redraw();

//     // if (coordinates_array != undefined) {

//     //     try{
//     //         polyline.remove(mymap);
//     //     } catch (error) {
//     //         console.error(error);
//     //         // expected output: ReferenceError: nonExistentFunction is not defined
//     //         // Note - error messages will vary depending on browser
//     //       }

//     //     coordinates_array_draw = [...coordinates_array_draw, [e.latlng["lat"], e.latlng["lng"]]];
//     //     coordinates_array = [...coordinates_array, [e.latlng["lng"], e.latlng["lat"]]];

//     //     let polyline = L.polyline(coordinates_array_draw).addTo(mymap);
//     //     polyline.redraw()

//     //     if (coordinates_array.length == 1){

//     //         let newMarker = new L.marker(e.latlng).addTo(mymap).on('click', function() {    
            
//     //             console.log(JSON.stringify(coordinates_array).replace(/],/g,"],\n"));
//     //             coordinates_array = [];
//     //             coordinates_array_draw = [];
            
//     //         });
//     //         //console.log("newMarker added");
//     //     }
//     //     console.log(JSON.stringify(coordinates_array).replace(/],/g,"],\n"));
//     // } 
//     // else {

//     //     coordinates_array_draw = [
//     //         [e.latlng["lat"], e.latlng["lng"]]
//     //     ];

//     //     coordinates_array = [
//     //         [e.latlng["lat"], e.latlng["lng"]]
//     //     ];

//     // }

//     // coordinates = [
//     //     [e.latlng["lat"], e.latlng["lng"]]
//     // ];

// }

// function jsonCoords(coordArr){



// }