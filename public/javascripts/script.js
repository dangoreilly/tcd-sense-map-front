
let saveLocations = false;
let coordinates = [];
// let coordinates_array = [];

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

var info = L.control({position:"bottomleft"});


const overworld_map = L.map('overworld', {
    crs: L.CRS.Simple,
    //fullscreenControl: true
    zoomSnap: 0.25,
    zoomDelta: 0.25,
    maxZoom: 2.5
});

const bounds = [[0,0], [1000,1000]];

const overworld_image = L.imageOverlay('images/Overworld.svg', bounds).addTo(overworld_map);
//zoom level 
// var bigText = L.imageOverlay('images/Overworld_bigText.svg', bounds).addTo(overworld_map);
// var littleText = L.imageOverlay('images/Overworld_littleText.svg', bounds);
var tooltips = [];

overworld_map.fitBounds(bounds).setMaxBounds([
    [850,-100],
    [0,1200]
    ])


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

         console.log(JSON.stringify(_buildings, null, 1));
        setBuildings(_buildings);

    }
});

function setBuildings(blds){
    _buildings = blds;
        //console.log(_buildings);
}

  //console.log("_buildings");
  //console.log(JSON.stringify(_buildings, null, 1));

overworld_map.on('click', (e) => {

    if (urlParams.has('drawPolygons')) {
        draw_clicks(overworld_map, e)
    }
    

    //info.update(overworld_map.zoom);

});

overworld_map.on('zoom', (e) => {

    //info.update(overworld_map.zoom);
    console.log(overworld_map.getZoom());
    let buildingtags = document.getElementsByName("building");
    let visible_prefix = "<p name='building', class='label', style='opacity: 100%'>";
    let invisible_prefix = "<p name='building', class='label', style='opacity: 0%'>";
    let cap = "%'>";
    let suffix = "</p>";
    let htmlStyle = "margin: 0px; width: 100%; height: 100%; overflow: hidden;";

    if (overworld_map.getZoom() > 0.5 && overworld_map.getZoom() < 2){
        // bigText.remove();
        // littleText.addTo(overworld_map);

        // for(i = 0; i <= 10; i++){
            // buildingtags.forEach(element => {
            //     element.parentElement.innerHTML = visible_prefix + element.innerText + suffix;
            //     console.log(element);
            // });
        // }

        document.documentElement.style.cssText = htmlStyle + "--vis-in: 100%";
        document.documentElement.style.cssText = htmlStyle + "--vis-out: 0%";


    }
    else if (overworld_map.getZoom() <= 0.5){
        // bigText.addTo(overworld_map);
        // littleText.remove();

        // for(i = 0; i <= 10; i++){
            // buildingtags.forEach(element => {
            //     element.parentElement.innerHTML = invisible_prefix + element.innerText + suffix;
            //     console.log(element);
            // });
        // }
        
        document.documentElement.style.cssText = htmlStyle + "--vis-in: 0%";
        document.documentElement.style.cssText = htmlStyle + "--vis-out: 100%";
    }
    else{
        // bigText.remove()
        // littleText.remove();
        document.documentElement.style.cssText = htmlStyle + "--vis-in: 0%";
        document.documentElement.style.cssText = htmlStyle + "--vis-out: 0%";
    }


});


function style(feature) {

    //if (feature.properties.mapped == 'true'){

        return {

            fillColor: '#e53397',
            weight: 2,
            opacity: 0,
            color: 'white',
            dashArray: '0',
            fillOpacity: 0
        };

}


function onEachFeature(feature, layer) {

    // console.log("Loading " + feature.name)

    //bind click
    layer.on('click', function (e){
        //window.location.href = feature.properties.link;

        let modal_title = '<h1 style="margin-bottom:0.1rem;">'+ feature.attributes.Name +'</h1><div class="modalcontent">';
        let modal_aka = '<p><em>Also known as: ' + feature.attributes.aka + '</em></p>';
        let modal_sensorycontent = '<p><b>Description</b><br>' + feature.attributes.Description + '</p>' +
        '<p><b>Sensory Overview</b><br>' + feature.attributes.SensoryOverview + '</p>' +
        '<p><b>Sensory Breakdown</b><br><div style="margin-left: 40px; background-color: #eee; padding:10px">' + 
            '<p><b>Sounds</b><br>' + feature.attributes.Sound + '</p>' +
            '<p><b>Sights</b><br>' + feature.attributes.Sight + '</p>' +
            '<p><b>Touch</b><br>' + feature.attributes.Touch + '</p>' +
            '<p><b>Movement/Body Position</b><br>' + feature.attributes.Movement + '</p>' +
            '<p><b>Smell</b><br>' + feature.attributes.Smell + '</p><br>' +
        '</div></div>';
        //cheap and dirty button disabler
        function checkEnabled(chk){
            if(check) return "";
            else return "disabled";
        }

        let modal_info_button = '<div style="width=800px;"> <button ' + checkEnabled(feature.attributes.sensoryAvailable) + `class="centered" style="display:inline-flex; width=45%;" onclick="window.location.href=/info/${feature.attributes.bldID}">More Details</button>`;
        let modal_map_button = '<div style="width=800px;"> <button ' + checkEnabled(false) + 'class="centered" style="display:inline-flex; width=45%;" onclick="window.location.href=/">More Details</button>';

        

        let modal_buttons = modal_info_button + '<span style="display:inline-flex; width: 5%;"></span>' + modal_map_button;

        let modal_content = modal_title;
        
        if (feature.aka != ""){
            modal_content += modal_aka;
        }

        modal_content += modal_sensorycontent + modal_buttons;

        overworld_map.openModal({content: modal_content});

    });

    // if (urlParams.has(feature.name)){
    //     highlightFeature_overload(layer);
    // }

    if (feature) {

        let contentOfThePopup = "<p name='building'> <span class='zoomedOutLabel'>" + feature.attributes.zoomedOutLabel + "</span><span class='zoomedOutLabel'>" + feature.attributes.zoomedInLabel + "</span></p>";
        //layer.bindPopup(contentOfThePopup, {closeButton: false, offset: L.point(0, -20)});

        layer.bindTooltip(contentOfThePopup, {direction: "top", opacity:1, permanent: true}).openTooltip();

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
    }
}

var geojson = L.geoJson(_buildings, {
    style: style,
    onEachFeature: onEachFeature

}).addTo(overworld_map);

//Info Box

info.onAdd = function (overworld_map) {
    this.button = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    // this.button.title = "Click on buildings to get sensory information and access the internal map, if one exists";
     this.button.value = "i";
    this.button.innerHTML = '<input onclick="openInfoModal()" type="button" value="i" id="infoButton"></input><div id="infoBox"><\div>';

    return this.button;
};

function fadeLayerLeaflet(lyr, startOpacity, finalOpacity, opacityStep, delay) {
    
    let opacity = startOpacity;
    let timer = setTimeout(function changeOpacity() {
    
        if (opacity != finalOpacity) {

            lyr.setStyle({
                //opacity: opacity,
                fillOpacity: opacity
            });
            
            opacity = opacity + opacityStep
        }
        
        timer = setTimeout(changeOpacity, delay);
    
    }, delay);
}



function changeInfo(){

    if (document.getElementById("infoButton").value == "i"){

        document.getElementById("infoButton").value="x";
        document.getElementById("infoBox").innerHTML="Click on buildings to get sensory information and access the internal map, if one exists";

    }

    else {

        document.getElementById("infoButton").value="i";
        document.getElementById("infoBox").innerHTML="";

    }
}

info.addTo(overworld_map);
openInfoModal();

function openInfoModal() {
    overworld_map.openModal({
        content: `
        <h1>Welcome</h1>
        <p> TCD Sense - The Trinity Sensory Processing Project - aims to make Trinity more inclusive by reviewing and improving new and existing spaces, building sensory awareness and delivering specialist supports to students who experience barriers to managing and adapting the sensory environments of college.</p>
        <br>
        <p> Press the X button in the top right to close this modal and view the map. Click/tap on a building to see the available sensory information, or click below for more information about the project</p>
        <button  class="centered" style="display:inline-flex; width=45%;" onclick="window.location.href='https://www.tcd.ie/disability/services/tcdsense.php'">More Information about the TCD Sense Project</button>
    `
    }
    );
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
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