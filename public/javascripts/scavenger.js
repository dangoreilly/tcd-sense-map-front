

// let scavengerLocations_options = {
//     direction: "bottom", 
//     offset:[0,0], 
//     opacity:1, 
//     permanent: true};



let _scavengerLocations = [];
let scavengerLocations = [];

$.ajax({
    type: "GET",
    async: false,
    dataType: "json",
    url: 'get/scavengerLocations',
    complete: function(data) {
        
        // console.log("data");
        // console.log($.parseJSON(data));
        //_buildings = $.parseJSON(data);

        if (typeof data === 'object')
        scavengerLocations = data.responseJSON; // dont parse if its object
        
        else if (typeof data === 'string')
        scavengerLocations = JSON.parse(data).responseJSON; // parse if its string

        //  console.log(JSON.stringify(scavengerLocations[0], null, 1));
        setScavengerLocations(scavengerLocations);

    }
});

var geojson_scavengerHunt = L.geoJson(_scavengerLocations, {
    // style: style,
    onEachFeature: addIconToScavenger

})
// .addTo(overworld_map);

//Needed to escape the scope of the jquery
function setScavengerLocations(__scavengerLocations){
    _scavengerLocations = __scavengerLocations;
    // console.log(_scavengerLocations);
}

function addIconToScavenger(feature, layer) {

    
    let myScavengerIcon = L.icon({
        iconUrl: feature.properties.Icon.data.attributes.formats.thumbnail.url,
        iconSize: [50, 50],
        // interactive:true,
        // className: "zoomedInLabel"
        // iconAnchor: [15, 15],
        // popupAnchor: [-3, -76],
        // shadowUrl: 'my-icon-shadow.png',
        // shadowSize: [68, 95],
        // shadowAnchor: [22, 94]
    });

    // console.log(urlParams.getAll("c"));
    if (urlParams.getAll("c").includes(feature.properties.keyParam)){
        
        // let scavMarker = L.marker([feature.geometry.coordinates[0],feature.geometry.coordinates[1]], {
        //     icon: myScavengerIcon,
        //     zIndex:1000,
        //     // title: feature.properties.Title
        // })
        // .addTo(overworld_map);

        layer.setIcon(myScavengerIcon);

        layer.on("click", e=>{
            // console.log("marker clicked");
            openInfoModal(feature.properties.Title, feature.properties.MainText, []);
        })
        .addTo(overworld_map);
        
        // console.log(`Added clue with marker: ${feature.properties.keyParam}`)
    }
    else{
        
        // console.log(`did not add clue with marker: ${feature.properties.keyParam}`)
    }

}