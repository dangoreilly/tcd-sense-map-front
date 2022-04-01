
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

        //  console.log(JSON.stringify(_buildings, null, 1));
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
    // let buildingtags = document.getElementsByName("building");
    // let visible_prefix = "<p name='building', class='label', style='opacity: 100%'>";
    // let invisible_prefix = "<p name='building', class='label', style='opacity: 0%'>";
    // let cap = "%'>";
    // let suffix = "</p>";
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

        document.documentElement.style.cssText = htmlStyle + "--vis-in: 0%; --vis-out: 100%";
        // document.documentElement.style.cssText = htmlStyle + "--vis-out: 100%";


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


function onEachFeature(feature, layer) {

    // console.log("Loading " + feature.name)

    //bind click
    layer.on('click', function (e){
        //window.location.href = featurepropertieslink;

        // let modal_title = '<h1 style="margin-bottom:0.1rem;">'+ feature.properties.Name +'</h1><div class="modalcontent">';
        let modal_aka = '<p><em>Also known as: ' + feature.properties.aka + '</em></p>';
        let modal_Description = '<p><b>Description</b><br>' + feature.properties.Description + '</p>';
        let modal_sensorycontent = '<p><b>Sensory Overview</b><br>' + feature.properties.SensoryOverview + '</p>' +
        '<p><b>Sensory Breakdown</b><br><div style="margin-left: 40px; background-color: #eee; padding:10px">' + 
            '<p><b>Sounds</b><br>' + feature.properties.Sound + '</p>' +
            '<p><b>Sights</b><br>' + feature.properties.Sight + '</p>' +
            '<p><b>Touch</b><br>' + feature.properties.Touch + '</p>' +
            '<p><b>Movement/Body Position</b><br>' + feature.properties.Movement + '</p>' +
            '<p><b>Smell</b><br>' + feature.properties.Smell + '</p><br>' +
        '</div></div>';
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
            text: "More Details",
            link: `/info/${feature.properties.bldID}`,
            disabled: !feature.properties.infoPageEnabled
        }
        
        let modal_map_button = {
            text: "Internal Map",
            link: `/map/${feature.properties.bldID}`,
            disabled: (!feature.properties.mapped) || true
        }
          
        let modal_content = "";
        
        if (feature.aka != "" && feature.aka != "null" && feature.aka != null){
            modal_content += modal_aka;
        }
        
        modal_content += modal_Description;
        
        if (feature.properties.sensoryAvailable){
            modal_content += modal_sensorycontent;
        }

        // modal_content += modal_buttons;

        // overworld_map.openModal({content: modal_content});
        openInfoModel(feature.properties.Name, modal_content, {modal_info_button, modal_map_button});

    });

    // if (urlParams.has(feature.name)){
    //     highlightFeature_overload(layer);
    // }

    if (feature) {

        let contentOfTheFirstPopup = "<p name='building'  class='zoomedInLabel'>" + feature.properties.ZoomedInLabel + " </p>";
        let contentOfTheSecondPopup = "<p name='building' class='zoomedOutLabel'>" + feature.properties.ZoomedOutLabel + "</p>";
        //layer.bindPopup(contentOfThePopup, {closeButton: false, offset: L.point(0, -20)});

        layer.bindTooltip(contentOfTheFirstPopup, {direction: "top", opacity:1, permanent: true}).addTo(overworld_map);
        layer.bindTooltip(contentOfTheSecondPopup, {direction: "top", opacity:1, permanent: true}).openTooltip();

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
    this.button.innerHTML = '<button type="button" class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#welcomeModal" style="margin-top:0">i</button>';
    this.button.style = "padding:0;"

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