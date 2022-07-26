
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
var urlParams = new URLSearchParams(queryString);

var info = L.control({position:"bottomleft"});
var search = L.control({position:"bottomright"});

// console.log(urlParams.get("b"));
// console.log(urlParams.get("welcome"));

const overworld_map = L.map('overworld', {
    // crs: L.CRS.Simple,
    //fullscreenControl: true
    zoomSnap: 0.25,
    zoomDelta: 0.25,
    maxZoom: 20,
    renderer: L.canvas({padding: 1})
});

const zoomedIn = 18;
const zoomedOut = 17;

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', { //rastertiles/voyager_nolabels
    attribution: '©OpenStreetMap, ©CartoDB',
    // maxNativeZoom: 18,
    maxZoom:20

}).addTo(overworld_map);

var route = L.polyline([[0,0],[0,0]], {color: 'red', opacity: 0}).addTo(overworld_map);
var polyg = L.polygon([[0,0],[0,0]], {color: 'red', fillColor: 'red', opacity: 0, fillOpacity: 0.4}).addTo(overworld_map);

//Parameterise it to limit stretching problems
// let overlay_topLeft_x = 53.345575;
// let overlay_topLeft_y = 353.740604;

// let aspect_ratio = 0.46;
// let width = 0.000095; //2500 in pixels originall, 0.000095 in degrees
// let height = width*aspect_ratio;

var bounds_campus = [
    [53.345568, 353.740572],
    [53.341853, 353.750523]
    ];

// let bounds_DOlier = [
//     [53.346788, 353.741861],
//     [53.346419, 353.742815]
// ];

// let bounds_james = [
//     [53.34230827729277,353.70393276214605],
//     [53.34077093713762,353.7077736854554]
// ];

// let bounds_foster = [
//     [53.34500329299972,353.7376347184182],
//     [53.34425229267094,353.73941570520407]
// ];

// let bounds_pearse = [
//     [53.34421730506959,353.7504099888813],
//     [53.342757648513114,353.75396910467543]
// ];


var _overlays = [];
var _buildings = [];
var _areas = [];

$.ajax({
    type: "GET",
    async: false,
    dataType: "json",
    url: 'get/overlays',
    complete: function(data) {
        
        //console.log("data");
        //console.log($.parseJSON(data));
        //_buildings = $.parseJSON(data);

        if (typeof data === 'object')
            _overlays = data.responseJSON; // dont parse if its object
        
        else if (typeof data === 'string')
        _overlays = JSON.parse(data).responseJSON; // parse if its string

        //  console.log(JSON.stringify(_areas, null, 1));
        setOverlays(_overlays);

    }
});

var imageOverlays = [];

_overlays.forEach(overlay => {

    // console.log(JSON.stringify(overlay, null, 1));

    imageOverlays.push(L.imageOverlay(overlay.url, overlay.bounds, {zIndex:overlay.zIndex}).addTo(overworld_map));

})


// const overworld_image = L.imageOverlay('images/Overworld.svg', bounds).addTo(overworld_map);
// var overworld_image = L.imageOverlay('images/Overworld_TCDsenseColours_CartoOverlay_Rough.svg', bounds_campus, {zIndex:Zin}).addTo(overworld_map);
// var DOlierSt_image = L.imageOverlay('images/DOlier_street.svg', bounds_DOlier).addTo(overworld_map);
// var PearseSt_image = L.imageOverlay('images/Pearse_Street.svg', bounds_pearse).addTo(overworld_map);
// var FosterPlace_image = L.imageOverlay('images/Foster_Place.svg', bounds_foster).addTo(overworld_map);
// var StJames_image = L.imageOverlay('images/St_James.svg', bounds_james).addTo(overworld_map);

// Holder for debugging
let dummy_bounds = [[0, 0],[0.0000001, 0.0000001]];
var dummy_image = L.imageOverlay('images/red-dot.png', dummy_bounds).addTo(overworld_map);

// Resizing handles
// Change the target to activate on different images
var target_image = dummy_image;
var target_bounds = dummy_bounds;

target_image.setOpacity(0.5);

var redDot = L.icon({
    iconUrl: 'images/red-dot.png',
    iconSize: [10, 10],
    // iconAnchor: [5, 5],
    opacity:0.5
});

var bound1_marker = L.marker(target_bounds[0], {
    draggable:true,
    icon: redDot
}).addTo(overworld_map);

var bound2_marker = L.marker(target_bounds[1], {
    draggable:true,
    icon: redDot
}).addTo(overworld_map);

bound1_marker.on('move', e => {updateBounds()});
bound2_marker.on('move', e => {updateBounds()});
bound1_marker.on('moveend', e => {printNewBounds()});
bound2_marker.on('moveend', e => {printNewBounds()});

function updateBounds(){
    target_image.setBounds([bound1_marker.getLatLng(), bound2_marker.getLatLng()]);
}

function printNewBounds(){
    console.log(`Bounds have been updated to [[${[bound1_marker.getLatLng().lat, bound1_marker.getLatLng().lng]}],[${[bound2_marker.getLatLng().lat, bound2_marker.getLatLng().lng]}]]`)
}
//zoom level 
// var bigText = L.imageOverlay('images/Overworld_bigText.svg', bounds).addTo(overworld_map);
// var littleText = L.imageOverlay('images/Overworld_littleText.svg', bounds);
var tooltips = [];


overworld_map.on('load', (e) => {

    updateLabels();
    // console.log("labels updated on load");

    // console.log(`Checking whether to display the welcome modal: ${urlParams.get("welcome")}`);
    // // if (urlParams.get("welcome") == "no"){
    //     closeModal("welcomeModal")
    // // }

});

overworld_map.fitBounds(bounds_campus); 
overworld_map.setZoom(zoomedIn-0.5);
    //bounds);
// overworld_map.setMaxBounds([
//     // [850,-100],
//     // [0,1200]   
// ])



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

        //  console.log(JSON.stringify(_buildings[0], null, 1));
        setBuildings(_buildings);

    }
});

$.ajax({
    type: "GET",
    async: false,
    dataType: "json",
    url: 'get/areas',
    complete: function(data) {
        
        //console.log("data");
        //console.log($.parseJSON(data));
        //_buildings = $.parseJSON(data);

        if (typeof data === 'object')
            _areas = data.responseJSON; // dont parse if its object
        
        else if (typeof data === 'string')
        _areas = JSON.parse(data).responseJSON; // parse if its string

        //  console.log(JSON.stringify(_areas, null, 1));
        setAreas(_areas);

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
function setAreas(areas){
    _areas = areas;
        // console.log(_areas);
}
function setOverlays(overlays){
    _overlays = overlays;
        // console.log(_areas);
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
//     let options = {
//         radius: e.accuracy,
//         interactive: false,

//     }

//     // L.marker(e.latlng).addTo(overworld_map).bindPopup("You are within " + radius + " meters from this point").openPopup();

//     L.circleMarker(e.latlng, options).addTo(overworld_map);
//     console.log(`User is within ${e.accuracy} of ${e.latlng}`);
// }

// overworld_map.locate({setView: false});

// overworld_map.on('locationfound', onLocationFound);

function updateLabels(){

    let htmlStyle = "margin: 0px; width: 100%; height: 100%; overflow: hidden;";

    if (overworld_map.getZoom() > zoomedOut && overworld_map.getZoom() < zoomedIn){
        
        document.documentElement.style.cssText = htmlStyle + "--vis-in: 0%; --vis-out: 100%";
        
    }
    else if (overworld_map.getZoom() <= zoomedOut){
        
        document.documentElement.style.cssText = htmlStyle + "--vis-in: 0%; --vis-out: 0%";

    }
    else{

        document.documentElement.style.cssText = htmlStyle + "--vis-in: 100%; --vis-out: 0%";

    }

    // console.log("labels updated")

}

overworld_map.on('zoom', (e) => {

    updateLabels();

});

overworld_map.on('movestart', (e) => {

    updateLabels();

});

// overworld_map.on('move', () => {



// });



function style(feature) {

    //if (featurepropertiesmapped == 'true'){

        return {

            fillColor: '#0087A2',
            weight: 1,
            opacity: 1,
            color: '#FCE891',
            dashArray: '0',
            fillOpacity: 1,
            noClip:true
        };

}


function addIconToAreas(feature, layer) {

    let myIcon = L.icon({
        iconUrl: feature.properties.Icon.data.attributes.formats.thumbnail.url,
        iconSize: [50, 50],
        className: "zoomedInLabel"
        // iconAnchor: [15, 15],
        // popupAnchor: [-3, -76],
        // shadowUrl: 'my-icon-shadow.png',
        // shadowSize: [68, 95],
        // shadowAnchor: [22, 94]
    });

    let modal_aka = '<p><em>Also known as: ' + feature.properties.aka + '</em></p>';
    let modal_Description = '<p><b>Description</b><br>' + feature.properties.Description + '</p>';
    let modal_sensorycontent = '<p><b>Sensory Overview</b><br>' + feature.properties.SensoryOverview + '</p>';

    let modal_content = "";
        
    if (feature.properties.aka != "" && feature.properties.aka != "null" && feature.properties.aka != null){
        modal_content += modal_aka;
    }
    
    modal_content += modal_Description;
    modal_content += modal_sensorycontent;

    let modal_info_button = {
        text: "Sensory Info",
        link: `/info/${feature.properties.bldID}`,
        disabled: true //!feature.properties.infoPageEnabled
    }

    // console.log(`feature.geometry: ${feature.geometry.coordinates}`)
    
    L.marker([feature.geometry.coordinates[0],feature.geometry.coordinates[1]], {
        icon: myIcon,
        zIndexOffset:1000,

        })
        .on("click", e=>{
            openInfoModal(feature.properties.Name, modal_content, [modal_info_button]);
        })
        .addTo(overworld_map);

    // L.circleMarker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
    //     radius:30,
    //     interactive:true,
    //     opacity:1
    // }).addTo(overworld_map);

    console.log(`Marker added for ${feature.properties.Name}`)

    

}

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
        // function checkEnabled(chk){
        //     if(chk) return "";
        //     else return "disabled";
        // }
        // function provideLink(chk, url){
        //     if(chk) return `href="/info/${url}"`;
        //     else return "";

        // }

        let modal_info_button = {
            text: "Sensory Info",
            link: `/info/${feature.properties.bldID}`,
            disabled: !feature.properties.infoPageEnabled
        }
        
        let modal_map_button = {
            text: "Internal Map",
            // link: `/map/${feature.properties.bldID}`,
            link: `/map/${feature.properties.bldID}`,
            disabled: !feature.properties.mapped
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

        if (urlParams.get("b") == feature.properties.bldID){
            // layer.setStyle({
            //     weight: 5,
            //     color: '#E53397',
            //     fillOpacity: 1,
            //     opacity: 0.5
                
            // });
            highlightFeature({target: layer});
            // layer.bindPopup(`<p>${feature.properties.Name}</p>`).openPopup();
            overworld_map.flyTo(layer.getCenter(), zoomedIn+2);
            // overworld_map.setZoom(zoomedIn);
            
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

    var geojson_areas = L.geoJson(_areas, {
        // style: style,
        onEachFeature: addIconToAreas

    }).addTo(overworld_map);
}
//Info Box

info.onAdd = function (overworld_map) {
    this.button = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    // this.button.title = "Click on buildings to get sensory information and access the internal map, if one exists";
     this.button.value = "i";
     this.button.innerHTML = '<button type="button" class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#welcomeModal" style="margin-top:0">i</button>';
     this.button.innerHTML += '<button type="button" id="mainCampusButton" disabled class="btn btn-outline-primary btn-sm" onclick="flyHome()" style="display: none; margin-top:0; margin-left:0.5rem;">Main Campus</button>';
    this.button.style = "padding:0;"

    return this.button;
};

//Link to Search
search.onAdd = function (overworld_map) {
    this.button = L.DomUtil.create('div', 'search'); // create a div with a class "info"
    // this.button.title = "Click on buildings to get sensory information and access the internal map, if one exists";
     this.button.value = "i";
    this.button.innerHTML = '<a role="button" href="/search" class="btn btn-primary" style="margin-top:0; ">Search</button>';
    this.button.style = "padding:0;"

    return this.button;
};

info.addTo(overworld_map);
search.addTo(overworld_map);
// wayfind.addTo(overworld_map);


function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#E53397',
        fillColor: '#E53397',
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