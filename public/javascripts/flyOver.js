// let toJamesIcon = L.icon({
//     iconUrl: 'images/toJames.svg',
//     iconSize: [30, 30],
//     // iconAnchor: [5, 5],
//     opacity: 1
// });

// let fromJamesIcon = L.icon({
//     iconUrl: 'images/fromJames.svg',
//     iconSize: [30, 30],
//     // iconAnchor: [5, 5],
//     opacity: 1
// });

// let toJames_markerLocation = [
//     [53.343584, 353.740522],
//     [53.343132, 353.741298]
// ];
// let fromJames_markerLocation = [
//     [53.342113, 353.707366], 
//     [53.34157, 353.708007]
// ];

// var toJames_marker = L.marker(toJames_markerLocation, {
//     draggable:true,
//     icon: toJamesIcon
// }).addTo(overworld_map);

// var fromJames_marker = L.marker(fromJames_markerLocation, {
//     draggable:true,
//     icon: fromJamesIcon
// }).addTo(overworld_map);

// var toJames_marker = L.imageOverlay('images/toJames.svg', toJames_markerLocation, {interactive:true}).addTo(overworld_map);
// var toJames_marker_anchor = L.marker([toJames_markerLocation[1][0], toJames_markerLocation[0][1]], {opacity: 0}).addTo(overworld_map);

// var fromJames_marker = L.imageOverlay('images/fromJames.svg', fromJames_markerLocation, {interactive:true}).addTo(overworld_map);
// var fromJames_marker_anchor = L.marker([fromJames_markerLocation[1][0], fromJames_markerLocation[0][1]], {opacity: 0}).addTo(overworld_map);

let shortcut_options = {
    direction: "bottom", 
    offset:[0,0], 
    opacity:1, 
    permanent: true};

// let toJamesTooltip = toJames_marker_anchor.bindTooltip("<p align='center' class='zoomedOutLabel'>St James</p>", flyOver_options).addTo(overworld_map);
// let fromJamesTooltip = fromJames_marker_anchor.bindTooltip("<p align='center' class='zoomedInLabel'>Main Campus</p>", flyOver_options).addTo(overworld_map);

// toJames_marker.on('moveend', e => {printMarkerLocation("toJames", e.getLatLng())});
// fromJames_marker.on('moveend', e => {printMarkerLocation("fromJames", e.getLatLng())});

// toJames_marker.on('click', e => {overworld_map.flyToBounds(bounds_james)});
// fromJames_marker.on('click', e => {overworld_map.flyToBounds(bounds_campus)});

let _shortcuts = [];
let shortcuts = [];

$.ajax({
    type: "GET",
    async: false,
    dataType: "json",
    url: 'get/shortcuts',
    complete: function(data) {
        
        // console.log("data");
        // console.log($.parseJSON(data));
        //_buildings = $.parseJSON(data);

        if (typeof data === 'object')
        shortcuts = data.responseJSON; // dont parse if its object
        
        else if (typeof data === 'string')
        shortcuts = JSON.parse(data).responseJSON; // parse if its string

        //  console.log(JSON.stringify(_buildings[0], null, 1));
        setShortcuts(shortcuts);

    }
});

_shortcuts.forEach(shortcut => {

    // console.log(JSON.stringify(overlay, null, 1));
    
    // Each shortcut is stored in the array as an object with both the overlay and the marker for the label to attach itself to
    // The marker can't contain the image itself because that will cause unwanted autoscaling 

    // Create each shortcut in the array

    // console.log("Going to try and find the midpoint of");
    // console.log([[shortcut.markerLocation[0][0],shortcut.markerLocation[1][1]],[shortcut.markerLocation[1][0],shortcut.markerLocation[1][1]]])

    shortcuts.push(

        {"shortcutImage": 
                        L.imageOverlay(shortcut.marker, shortcut.markerLocation, {interactive:true, zIndex:210})
                        .on('click', e => {console.log("Flying to"); overworld_map.flyToBounds(shortcut.target); })
                        .addTo(overworld_map),
        "labelAnchor": 
                        L.marker(midPoint([shortcut.markerLocation[1][0],shortcut.markerLocation[0][1]],[shortcut.markerLocation[1][0],shortcut.markerLocation[1][1]]), shortcut_options)
                        .setOpacity(0)
                        .bindTooltip(`<p align='center' class='zoomedOutLabel'>${shortcut.ZoomedOutLabel.replace(/([\\])/g, '<br>')}</p>`, shortcut_options)
                        .addTo(overworld_map)
                        .bindTooltip(`<p align='center' class='zoomedInLabel'>${shortcut.ZoomedInLabel.replace(/([\\])/g, '<br>')}</p>`, shortcut_options)
                        .openTooltip()
        }
    );

})

//Needed to escape the scope of the jquery
function setShortcuts(__shortcuts){
    _shortcuts = __shortcuts;
        // console.log(_areas);
}

function printMarkerLocation(markerName, location){
    // console.log(`${markerName}: ${location}`)
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
    //returns boolean

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

function midPoint(_p1, _p2){
    //Function to find the mid point of two x y coordinates
    //p1: [float, float]
    //p2: [float, float]
    //returns [float, float]

    // console.log(`[(${_p1[0]} + ${_p2[0]})/2, (${_p1[1]} + ${_p2[1]})/2]`)
    // console.log(`${[(_p1[0] + _p2[0])/2, (_p1[1] + _p2[1])/2]}`)

    return [(_p1[0] + _p2[0])/2, (_p1[1] + _p2[1])/2]
}