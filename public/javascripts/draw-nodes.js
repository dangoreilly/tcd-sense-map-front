var curr_node = 0;
var selected_node = '';
var wayFindingNodes = [];
let coordinates_array = [];
let coordinates_array_draw = [];

// Based on method by hanesh
// https://stackoverflow.com/questions/41871519/leaflet-js-quickest-path-with-custom-points



function alphaNumeric(num){

    alphaNums = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    let alphaNum = '';

    if (num > 25) {
        let modulo = num % 26;
        alphaNum = alphaNumeric(((num - modulo)/26)-1) + alphaNums[modulo];
    }
    else {
        alphaNum = alphaNums[num];
    }

    return alphaNum;
}


function drawNode(e, mymap) {
    var node = [];
    node[0] = e.latlng.lat;
    node[1] = e.latlng.lng;
    let nodeName = floor + "_" + alphaNumeric(curr_node);
    addNodes(node, nodeName, mymap);
    addNodesToJSON(node, nodeName, floor);

    console.log("Logging node " + nodeName + ": " + node);

    curr_node += 1;

}

function draw_clicks(mymap, e){

    if (coordinates_array != undefined) {

        try{
            polyline.remove(mymap);
        } catch (error) {
            console.error(error);
            // expected output: ReferenceError: nonExistentFunction is not defined
            // Note - error messages will vary depending on browser
          }

        coordinates_array_draw = [...coordinates_array_draw, [e.latlng["lat"], e.latlng["lng"]]];
        coordinates_array = [...coordinates_array, [e.latlng["lng"], e.latlng["lat"]]];

        let polyline = L.polyline(coordinates_array_draw).addTo(mymap);
        polyline.redraw()

        if (coordinates_array.length == 1){

            let newMarker = new L.marker(e.latlng).addTo(mymap).on('click', function() {    
            
                console.log(JSON.stringify(coordinates_array).replace(/],/g,"],\n"));
                coordinates_array = [];
                coordinates_array_draw = [];
            
            });
            //console.log("newMarker added");
        }
        console.log(JSON.stringify(coordinates_array).replace(/],/g,"],\n"));
    } 
    else {

        coordinates_array_draw = [
            [e.latlng["lat"], e.latlng["lng"]]
        ];

        coordinates_array = [
            [e.latlng["lat"], e.latlng["lng"]]
        ];

    }

    coordinates = [
        [e.latlng["lat"], e.latlng["lng"]]
    ];

}

function drawFromJSON(){

    for (i = 0; i < wayFindingNodes.length; i++){
        addNodes(
            wayFindingNodes[i].id,
            wayFindingNodes[i].coords,
            wayFindingNodes[i].floor,
            wayFindingNodes[i].map,
            wayFindingNodes[i].room
        );
        
    console.log("Logging node " + nodeName + ": " + node);
    curr_node += 1;
    
    }

}

function addNodesToJSON(nodeName, node, floor, map = [], room = false){

    let nodeButJson =  {
        "id": nodeName,
        "coords": node,
        "map": map,
        "floor": floor,
        "room": room
    }

    wayFindingNodes.push(nodeButJson);

}

function addConnection(node, connection){

    node.map.push(connection);

}

function removeConnection(node, connection){

    let spliceIndex = node.map.indexOf(connection);
    node.map.splice(spliceIndex, 1);
    rebuildMap();

}

function rebuildMap(){
    console.log("rebuildMap(): Function not built yet");
}

function addNodes(polyNodes,num,mymap){
    // Just draw the nodes and add the code 
    // Adding to JSON is handled elsewhere 
    // so that they can be drawn from the JSON on a build

    var marker = L.marker([polyNodes[0], polyNodes[1]]).bindPopup(num).addTo(mymap);
    var myIcon = L.icon({

        iconUrl: '../css/images/point.png',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [-3, -76]

    });

    marker.setIcon(myIcon);

    if (urlParams.has('nodeNames')) {
    
        marker.on('mouseover',function(ev) {
            marker.openPopup();
        })
        console.log()
    
    }

    marker.on('click',function(e){
        // This adds the functions directly to the marker
        // I previously deleted this line thinking it was superfluous
        // It was not

        if(window.event.ctrlKey){
            // Selects the node for webbing

            if (selected_node == ''){

                curr_ctrl_pt = [polyNodes[0], polyNodes[1]];
                var oldText = document.getElementById('nodes').innerHTML;
                document.getElementById('nodes').innerHTML = oldText + num + ':{';

                var myIcon_2 = L.icon({

                    iconUrl: '../css/images/point_c.png',
                    iconSize: [16, 16],
                    iconAnchor: [8, 8],
                    popupAnchor: [-3, -76]

                });

                this.setIcon(myIcon_2); // custom marker to show that the node has been declared. This is just for your own reference
                selected_node = num;
            }
            else if (selected_node == num){

                this.setIcon(myIcon);
                
                var oldText = document.getElementById('nodes').innerHTML;
                document.getElementById('nodes').innerHTML = oldText + '},';

                selected_node = '';
            }
        }

        else if(window.event.altKey && window.event.ctrlKey){
            // Key for connecting to a Room - it should be prohibitively expensive to go via a room
            // And if a room has two doors, it should cost the same to enter from either direction

            var oldText = document.getElementById('nodes').innerHTML;
            document.getElementById('nodes').innerHTML = oldText + num + ':1000,';

            let polypoints = [];
            L.polyline([polyNodes,curr_ctrl_pt], {color: 'yellow'}).addTo(mymap);

        }
        else if(window.event.altKey && window.event.shiftKey){
            // Behaviour for a non-accessible path
            // 'inaccessible' will be browser flag to increase path based on user choice

            var oldText = document.getElementById('nodes').innerHTML;
            document.getElementById('nodes').innerHTML = oldText + num + ':' + getDistanceFromLatLonInM(polyNodes[0], polyNodes[1],curr_ctrl_pt[0],curr_ctrl_pt[1]) + '+inaccessible,';

            let polypoints = [];
            L.polyline([polyNodes,curr_ctrl_pt], {color: 'red'}).addTo(mymap);
        }
        else if(window.event.altKey){
            // Default behaviour for adding a node

            var oldText = document.getElementById('nodes').innerHTML;
            document.getElementById('nodes').innerHTML = oldText + num + ':' + getDistanceFromLatLonInM(polyNodes[0], polyNodes[1],curr_ctrl_pt[0],curr_ctrl_pt[1]) + ',';

            let polypoints = [];
            L.polyline([polyNodes,curr_ctrl_pt], {color: 'green'}).addTo(mymap);
        }

        else if(window.event.shiftKey){
            // Print nodes
            
            let nodeArray_temp = document.getElementById('nodes').innerHTML.split(',},');

            let nodeId = '';
            let nodeMap = '';
            let split_temp = '';

            nodeArray_temp.forEach(element => {

                element += '}';
                console.log(element);

                split_temp = element.split(':');
                
                nodeId = split_temp[0];
                nodeMap = split_temp[1];

                let nodeButJson =  {
                    "id": nodeId,
                    "coords": nodeCoords,
                    "map": nodeConnections,
                    "floor": nodeFloor
                }

                printJsonToTextArea("nodes-json", nodeId, curr_ctrl_pt, nodeMap, floor);

            });
            
        }
    })
}

function printJsonToTextArea(textAreaId, nodeId, nodeCoords, nodeConnections, nodeFloor){




    document.getElementById(textAreaId).innerHTML += JSON.stringify(nodeButJson) + "<br>";

}

function getDistanceFromLatLonInM(lat1,lon1,lat2,lon2) {
 
    let run = lat1 - lat2;
    let rise = lon1 - lon2;

    return (Math.sqrt(run*run + rise*rise)).toFixed(1);
}