let toJamesIcon = L.icon({
    iconUrl: 'images/toJames.svg',
    iconSize: [30, 30],
    // iconAnchor: [5, 5],
    opacity: 1
});

// let fromJamesIcon = L.icon({
//     iconUrl: 'images/fromJames.svg',
//     iconSize: [30, 30],
//     // iconAnchor: [5, 5],
//     opacity: 1
// });

let toJames_markerLocation = [
    [53.343584, 353.740522],
    [53.343132, 353.741298]
];
let fromJames_markerLocation = [
    [53.342113, 353.707366], 
    [53.34157, 353.708007]
];

// var toJames_marker = L.marker(toJames_markerLocation, {
//     draggable:true,
//     icon: toJamesIcon
// }).addTo(overworld_map);

// var fromJames_marker = L.marker(fromJames_markerLocation, {
//     draggable:true,
//     icon: fromJamesIcon
// }).addTo(overworld_map);

var toJames_marker = L.imageOverlay('images/toJames.svg', toJames_markerLocation, {interactive:true}).addTo(overworld_map);
var toJames_marker_anchor = L.marker([toJames_markerLocation[1][0], toJames_markerLocation[0][1]], {opacity: 0}).addTo(overworld_map);

var fromJames_marker = L.imageOverlay('images/fromJames.svg', fromJames_markerLocation, {interactive:true}).addTo(overworld_map);
var fromJames_marker_anchor = L.marker([fromJames_markerLocation[1][0], fromJames_markerLocation[0][1]], {opacity: 0}).addTo(overworld_map);

let flyOver_options = {
    direction: "bottom", 
    offset:[20,0], 
    opacity:1, 
    permanent: true};

let toJamesTooltip = toJames_marker_anchor.bindTooltip("<p align='center' class='zoomedOutLabel'>St James</p>", flyOver_options).addTo(overworld_map);
let fromJamesTooltip = fromJames_marker_anchor.bindTooltip("<p align='center' class='zoomedInLabel'>Main Campus</p>", flyOver_options).addTo(overworld_map);

// toJames_marker.on('moveend', e => {printMarkerLocation("toJames", e.getLatLng())});
// fromJames_marker.on('moveend', e => {printMarkerLocation("fromJames", e.getLatLng())});

toJames_marker.on('click', e => {overworld_map.flyToBounds(bounds_james)});
fromJames_marker.on('click', e => {overworld_map.flyToBounds(bounds_campus)});

function printMarkerLocation(markerName, location){
    console.log(`${markerName}: ${location}`)
}

overworld_map.on("move", (e) => {

    let flyButton = document.getElementById("mainCampusButton")

    if (isInside(overworld_map.getCenter(),bounds_campus)){
        flyButton.disabled = true;
        flyButton.style.display = "none";
    } 
    else {
        flyButton.disabled = false;
        flyButton.style.display = "";
    }

    //Has to be added in this file because having two different triggers for on move causes a stackoverflow
    // overworld_map.fitBounds(overworld_map.getBounds());

});


function flyHome(){
    overworld_map.flyToBounds(bounds_campus);
}

//function to check if a point is inside bounds
function isInside(point, bounds){
    //point:[float, float]
    //bounds:[ [float, float],[float, float] ]

    // Check if the point is bigger/smaller than both corresponding points in the bounds
    // If it's bigger/smaller than both corresponding points in any direction, that makes 
    // the point outside the bounds
    if (point.lat > bounds[0][0] && point.lat > bounds[1][0]){
        return false;
    }
    if (point.lat < bounds[0][0] && point.lat < bounds[1][0]){
        return false;
    }
    if (point.lng > bounds[0][1] && point.lng > bounds[1][1]){
        return false;
    }
    if (point.lng < bounds[0][1] && point.lng < bounds[1][1]){
        return false;
    }

    // If all those conditions failed, then the point is inside
    return true;
}