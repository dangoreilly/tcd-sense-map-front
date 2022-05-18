
let saveLocations = false;
let coordinates = [];

var wayfind_end;
var wayfind_start;
var startListenFlag = false;
var endListenFlag = false;
var wayfind_listening = false;

var displayNodes = true;
var coordinates_array = [];

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

var info = L.control({position:"bottomleft"});


const overworld_map = L.map('overworld', {
    // crs: L.CRS.Simple,
    //fullscreenControl: true
    zoomSnap: 0.25,
    zoomDelta: 0.25,
    maxZoom: 20
});

const zoomedIn = 18;
const zoomedOut = 16;

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png', {
    attribution: '©OpenStreetMap, ©CartoDB',
    // maxNativeZoom: 17

}).addTo(overworld_map);

var route = L.polyline([[0,0],[0,0]], {color: 'red', opacity: 0}).addTo(overworld_map);
var polyg = L.polygon([[0,0],[0,0]], {color: 'red', fillColor: 'red', opacity: 0, fillOpacity: 0.4}).addTo(overworld_map);

//Parameterise it to limit stretching problems
// let overlay_topLeft_x = 53.345575;
// let overlay_topLeft_y = 353.740604;

// let aspect_ratio = 0.46;
// let width = 0.000095; //2500 in pixels originall, 0.000095 in degrees
// let height = width*aspect_ratio;

let bounds = [
    // [0,0],
    // [1000,1000] //SVG only map
    [53.345568, 353.740572],
    [53.341853, 353.750523]    //LatLng map
    // [overlay_topLeft_x, overlay_topLeft_y],
    // [overlay_topLeft_x+width, overlay_topLeft_y+height]
    ];

// const overworld_image = L.imageOverlay('images/Overworld.svg', bounds).addTo(overworld_map);
const overworld_image = L.imageOverlay('images/Overworld_TCDsenseColours_CartoOverlay_Rough.svg', bounds).addTo(overworld_map);
//zoom level 
// var bigText = L.imageOverlay('images/Overworld_bigText.svg', bounds).addTo(overworld_map);
// var littleText = L.imageOverlay('images/Overworld_littleText.svg', bounds);
var tooltips = [];

overworld_map.fitBounds(bounds); 
    //bounds);
// overworld_map.setMaxBounds([
//     // [850,-100],
//     // [0,1200]   
// ])


var _buildings = [];

$.ajax({
    type: "GET",
    async: false,
    dataType: "json",
    url: 'get/all',
    complete: function(data) {
        
        //console.log("data");
        //console.log($.parseJSON(data));
        //_buildings = $.parseJSON(data);

        if (typeof data === 'object')
            _buildings = data.responseJSON; // dont parse if its object
        
        else if (typeof data === 'string')
        _buildings = JSON.parse(data).responseJSON; // parse if its string

        //  console.log(JSON.stringify(_buildings, null, 1));
        setBuildings(_buildings);

    }
});

var _wfNodes = [];

// Standin for debugging
// PROD will make ajax request
loadNodes(wfNodes_hard, overworld_map);

function setBuildings(blds){
    _buildings = blds;
        //console.log(_buildings);
}

  //console.log("_buildings");
  //console.log(JSON.stringify(_buildings, null, 1));

// overworld_map.on('contextmenu', (e) => {

//     if (urlParams.has('drawPolygons')) {

//         draw_clicks(overworld_map, e)
//     }

// });


overworld_map.on('click', (e) => {

    console.log(`Coordinates: ${e.latlng}`)

    if (urlParams.has('drawNodes') && window.event.ctrlKey) {
        
        drawNode(e, overworld_map);
        // displayNodes = true;
    }

    if (endListenFlag || startListenFlag){
        wayfind.update();

        //Buffer needed because leaflet treats click on control as a click on the map
        if(wayfind_listening){

                //debugging marker
                // L.circleMarker(e.latlng, {color: 'red'}).addTo(overworld_map);
            
            if (endListenFlag) {

                //First clear the old marker, if it exists
                if (wayfind_end != null){
                    wayfind_end.marker.setStyle({opacity:0, fillOpacity:0});
                }

                //Then update it
                if ("ontouchstart" in document.documentElement){
                    wayfind_end = findNearestWfNode(overworld_map.getCenter());
                }
                else{
                    wayfind_end = findNearestWfNode(e.latlng);
                }

                wayfind_end.marker.setStyle({opacity:0.7, fillOpacity:0.3});
            }
            else {

                //First clear the old marker, if it exists
                if (wayfind_start != null){
                    wayfind_start.marker.setStyle({opacity:0, fillOpacity:0});
                }

                //Then update it
                if ("ontouchstart" in document.documentElement){
                    wayfind_start = findNearestWfNode(overworld_map.getCenter());
                }
                else{
                    wayfind_start = findNearestWfNode(e.latlng);
                }
                wayfind_start.marker.setStyle({opacity:0.7, fillOpacity:0.3});
            }
            
            startListenFlag = false;
            endListenFlag = false;
            wayfind_listening = false;
            wayfind.update();
            if (typeof wayfind_start !== 'undefined' && typeof wayfind_end !== 'undefined'){
                
                // findWay(overworld_map, [wayfind_start, wayfind_end], route);

            }
        }
        else {
            wayfind_listening = true;
        }
    }
    

    //info.update(overworld_map.zoom);

});

// function onLocationFound(e) {
//     var radius = e.accuracy;

//     L.marker(e.latlng).addTo(overworld_map).bindPopup("You are within " + radius + " meters from this point").openPopup();

//     L.circle(e.latlng, radius).addTo(overworld_map);
// }

// overworld_map.locate();

// overworld_map.on('locationfound', onLocationFound);

overworld_map.on('zoom', (e) => {

    //info.update(overworld_map.zoom);
    // console.log(overworld_map.getZoom());
    // let buildingtags = document.getElementsByName("building");
    // let visible_prefix = "<p name='building', class='label', style='opacity: 100%'>";
    // let invisible_prefix = "<p name='building', class='label', style='opacity: 0%'>";
    // let cap = "%'>";
    // let suffix = "</p>";
    let htmlStyle = "margin: 0px; width: 100%; height: 100%; overflow: hidden;";

    if (overworld_map.getZoom() > zoomedOut && overworld_map.getZoom() < zoomedIn){
        // bigText.remove();
        // littleText.addTo(overworld_map);

        // for(i = 0; i <= 10; i++){
            // buildingtags.forEach(element => {
            //     element.parentElement.innerHTML = visible_prefix + element.innerText + suffix;
            //     console.log(element);
            // });
        // }

        document.documentElement.style.cssText = htmlStyle + "--vis-in: 0%; --vis-out: 100%";
        // document.documentElement.style.cssText = htmlStyle + "--vis-out: 100%";


    }
    else if (overworld_map.getZoom() <= zoomedOut){
        // bigText.addTo(overworld_map);
        // littleText.remove();

        // for(i = 0; i <= 10; i++){
            // buildingtags.forEach(element => {
            //     element.parentElement.innerHTML = invisible_prefix + element.innerText + suffix;
            //     console.log(element);
            // });
        // }
        
        document.documentElement.style.cssText = htmlStyle + "--vis-in: 0%; --vis-out: 0%";
        // document.documentElement.style.cssText = htmlStyle + "--vis-out: 0%";
    }
    else{
        // bigText.remove()
        // littleText.remove();
        document.documentElement.style.cssText = htmlStyle + "--vis-in: 100%; --vis-out: 0%";
        // document.documentElement.style.cssText = htmlStyle + ";

    }


});


function style(feature) {

    //if (featurepropertiesmapped == 'true'){

        return {

            fillColor: '#e53397',
            weight: 2,
            opacity: 0,
            color: 'white',
            dashArray: '0',
            fillOpacity: 0
        };

}

// function replace(str, char_out, char_in){

//     let replacment = "";
    
//     for (let i = 0; i < str.length; i++) {

//         if (str[i] == "_"){
//             replacment += "<br>";
//         }
//         else{
//             replacment += str[i];
//         }

//     }

//     return replacment;

// }


function onEachFeature(feature, layer) {

    // console.log("Loading " + feature.name)

    //bind click
    layer.on('click', function (e){
        //window.location.href = featurepropertieslink;

        // let modal_title = '<h1 style="margin-bottom:0.1rem;">'+ feature.properties.Name +'</h1><div class="modalcontent">';
        let modal_aka = '<p><em>Also known as: ' + feature.properties.aka + '</em></p>';
        let modal_Description = '<p><b>Description</b><br>' + feature.properties.Description + '</p>';
        let modal_sensorycontent = '<p><b>Sensory Overview</b><br>' + feature.properties.SensoryOverview + '</p>';
        // '<p><b>Sensory Breakdown</b><br><div style="background-color: #eee; padding:10px">' + 
        //     '<p><b>Sounds</b><br>' + feature.properties.Sound + '</p>' +
        //     '<p><b>Sights</b><br>' + feature.properties.Sight + '</p>' +
        //     '<p><b>Touch</b><br>' + feature.properties.Touch + '</p>' +
        //     '<p><b>Movement/Body Position</b><br>' + feature.properties.Movement + '</p>' +
        //     '<p><b>Smell</b><br>' + feature.properties.Smell + '</p><br>' +
        // '</div></div>';
        //cheap and dirty button disabler
        function checkEnabled(chk){
            if(chk) return "";
            else return "disabled";
        }
        function provideLink(chk, url){
            if(chk) return `href="/info/${url}"`;
            else return "";

        }

        let modal_info_button = {
            text: "Sensory Info",
            link: `/info/${feature.properties.bldID}`,
            disabled: !feature.properties.infoPageEnabled
        }
        
        let modal_map_button = {
            text: "Internal Map",
            link: `/map/${feature.properties.bldID}`,
            disabled: (!feature.properties.mapped) || true
        }
        
        let modal_physical_access_button = {
            text: "Physical Access",
            link: `${feature.properties.PhysicalAccessLink}`,
            disabled: (feature.properties.PhysicalAccessLink == "#" || feature.properties.PhysicalAccessLink == null) ? true : false
        }
          
        let modal_content = "";
        
        if (feature.properties.aka != "" && feature.properties.aka != "null" && feature.properties.aka != null){
            modal_content += modal_aka;
        }
        
        modal_content += modal_Description;
        
        // if (feature.properties.sensoryAvailable){
        //     modal_content += modal_sensorycontent;
        // }

        modal_content += modal_sensorycontent;

        // overworld_map.openModal({content: modal_content});
        openInfoModal(feature.properties.Name, modal_content, [modal_info_button, modal_physical_access_button, modal_map_button]);

    });

    

    if (feature) {

        let contentOfTheFirstPopup = "<p align='center' name='building'  class='zoomedInLabel'>" + feature.properties.ZoomedInLabel.replace(/([\\])/g, '<br>') + " </p>";
        let contentOfTheSecondPopup = "<p align='center' name='building' class='zoomedOutLabel'>" + feature.properties.ZoomedOutLabel.replace(/([\\])/g, '<br>') + "</p>";
        //layer.bindPopup(contentOfThePopup, {closeButton: false, offset: L.point(0, -20)});

        layer.bindTooltip(contentOfTheFirstPopup, {direction: "top", offset:[0,-20], opacity:1, permanent: true}).addTo(overworld_map);
        layer.bindTooltip(contentOfTheSecondPopup, {direction: "top", offset:[0,-20], opacity:1, permanent: true}).openTooltip();

        //littleText.bindTooltip(tip);
        //tooltips.push(tip);
        // layer.on('scroll', function(e) { 
        //     //layer.openPopup();
        //     console.log("checking scroll")

        //     if (overworld_map.getZoom() > 1){
        //         // bigText.remove();
        //         // littleText.addTo(overworld_map);
        //         layer.closeTooltip();

        //     }

        //     else {
        //         layer.openTooltip();
        //     }
        //     // if (layer.getZoom() < )
        //     // highlightFeature(e);
        // });

        if (urlParams.has(feature.properties.bldID)){
            layer.setStyle({
                weight: 5,
                color: '#E53397',
                fillOpacity: 1,
                opacity: 0.5
                
            });
        }

        layer.on('mouseover', function(e) { 
            //layer.openPopup();
            highlightFeature(e);
            // fadeLayerLeaflet(layer, 0, 1, 0.05, 50)
        });
        layer.on('mouseout', function(e) { 
            //layer.closePopup();
            resetHighlight(e);
            //fadeLayerLeaflet(layer, 1, 0, -0.05, 50)
        });

        // if(urlParams)
    }
}

if (urlParams.has('drawNodes')){
    
    console.log("Playing with nodes, no need to draw buildings");
}
else{

    var geojson = L.geoJson(_buildings, {
        style: style,
        onEachFeature: onEachFeature

    }).addTo(overworld_map);
}
//Info Box

info.onAdd = function (overworld_map) {
    this.button = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    // this.button.title = "Click on buildings to get sensory information and access the internal map, if one exists";
     this.button.value = "i";
    this.button.innerHTML = '<button type="button" class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#welcomeModal" style="margin-top:0">i</button>';
    this.button.style = "padding:0;"

    return this.button;
};

// function fadeLayerLeaflet(lyr, startOpacity, finalOpacity, opacityStep, delay) {
    
//     let opacity = startOpacity;
//     let timer = setTimeout(function changeOpacity() {
    
//         if (opacity != finalOpacity) {

//             lyr.setStyle({
//                 //opacity: opacity,
//                 fillOpacity: opacity
//             });
            
//             opacity = opacity + opacityStep
//         }
        
//         timer = setTimeout(changeOpacity, delay);
    
//     }, delay);
// }



// function changeInfo(){

//     if (document.getElementById("infoButton").value == "i"){

//         document.getElementById("infoButton").value="x";
//         document.getElementById("infoBox").innerHTML="Click on buildings to get sensory information and access the internal map, if one exists";

//     }

//     else {

//         document.getElementById("infoButton").value="i";
//         document.getElementById("infoBox").innerHTML="";

//     }
// }

info.addTo(overworld_map);
wayfind.addTo(overworld_map);
// openInfoModal();

// function openInfoModal() {
//     overworld_map.openModal({
//         content: `
//         <h1>Welcome</h1>
//         <p> TCD Sense - The Trinity Sensory Processing Project - aims to make Trinity more inclusive by reviewing and improving new and existing spaces, building sensory awareness and delivering specialist supports to students who experience barriers to managing and adapting the sensory environments of college.</p>
//         <br>
//         <p> Press the X button in the top right to close this modal and view the map. Click/tap on a building to see the available sensory information, or click below for more information about the project</p>
//         <a  class="btn welcome" href='https://www.tcd.ie/disability/services/tcdsense.php'>More Information about the TCD Sense Project</a>
//     `
//     }
//     );
// }

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#E53397',
        fillOpacity: 1,
        opacity: 0.5
        
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }


}

function highlightFeature_overload(l) {
    var layer = l;

    layer.setStyle({
        weight: 5,
        color: '#aaa',
        fillColor: '#0a0aaa',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }


}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}