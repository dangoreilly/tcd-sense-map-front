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