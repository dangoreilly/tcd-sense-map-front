
var wayfind = L.control({position:"topright"});

wayfind.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'wayfind'); // create a div with a class "info"
    // this.update();
    this._div.innerHTML = `<p onclick='listenForStart()'>Start: <span id='start_coords'>?</span></p><p onclick='listenForEnd()'>End: <span id='end_coords'>?</span></p>`
    
    

    return this._div;
};

wayfind.update = function () {
    this._div.innerHTML = `<p onclick='listenForStart()'>Start: <span id='start_coords'>${wayfind_start}</span></p><p onclick='listenForEnd()'>End: <span id='end_coords'>${wayfind_end}</span></p>`
};


function listenForStart(){
    startListenFlag = true;
    endListenFlag = false;
}
function listenForEnd(){
    startListenFlag = false;
    endListenFlag = true;
}

function findWay(map, points, route){

    let start = {
        ll: points[0],

        x: points[0].lat,
        y: points[0].lng
    }
    let end = {
        ll: points[1],

        x: points[1].lat,
        y: points[1].lng
    }

    // let startMarker = new L.marker(e.latlng).addTo(mymap)
    var startMarker = new L.marker(start.ll).addTo(map);
    var endMarker = new L.marker(end.ll).addTo(map);
    
    var startIcon = L.icon({
        iconUrl: './stylesheets/images/point.png',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
        // popupAnchor: [-3, -76]
    });
    var endIcon = L.icon({
        iconUrl: './stylesheets/images/point_c.png',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        opacity: 1
        // popupAnchor: [-3, -76]
    });

    startMarker.setIcon(startIcon);
    endMarker.setIcon(endIcon);


    // let route = L.polyline([start.ll,end.ll], {color: 'red'}).addTo(map);
    route.setLatLngs([start.ll, [start.x*1.2, start.y*1.2], [end.x*1.2, end.y*1.2], end.ll]);
    route.setStyle({opacity:1});
    route.redraw();
}


wayfind.addTo(overworld_map)