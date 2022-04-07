var curr_node = 0;
var selected_node = '';
var wayFindingNodes = [];
let coordinates_array = [];
let coordinates_array_draw = [];

var connections_gbl = [];
var activeNode = null;

var nodeExists = false;

const stairsColour = "#ff3333"
const notStairsColour = "#3388ff"
const activeColour = "#26ff4a"

class wfNode{



    name;
    coords;
    connects;
    stairs;
    marker;


    constructor(name, coords){

        let options = {
            fillColor: notStairsColour,
            color: "#fff",
            fillOpacity: 0.7,
            opacity: 0.5
        }

        this.name = name;
        this.coords = coords;
        this.connects = [];
        this.stairs = false;
        this.marker = L.circleMarker(coords, options);
    }

    // get name(){
    //     return this.name;
    // }

    // get coords(){
    //     return this.coords;
    // }

    // get connects(){
    //     return this.connects;
    // }

    // get stairs(){
    //     return this.stairs;
    // }

    // get marker(){
    //     return this.marker;
    // }

    // set stairs(strs){
    //     this.stairs = strs;
    // }

}

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
    // let node = [];
    // node[0] = e.latlng.lat;
    // node[1] = e.latlng.lng;    

    let nodeName = alphaNumeric(curr_node);
    // addNodes(node, nodeName, mymap);
    let node = newNode(nodeName, [e.latlng.lat, e.latlng.lng]);
    addNodeToMap(node, mymap) 
    // addNodesToJSON(node, nodeName, floor);

    console.log("Logging node " + node.name + ": " + node.coords);

    curr_node += 1;

}

function newNode(_name, _coords){

    let _node = new wfNode(_name,_coords)

    // console.log(_node);

    wayFindingNodes.push(_node);

    return _node
}

function addNodeToMap(node, map){
    // Just draw the nodes and add the code 
    // Adding to JSON is handled elsewhere 
    // so that they can be drawn from the JSON on a build

    // console.log(map);
    let _marker = node.marker.addTo(map);

    // var marker = L.marker(node.coords).addTo(map);
    // var myIcon = L.icon({

    //     iconUrl: '../css/images/point.png',
    //     iconSize: [16, 16],
    //     iconAnchor: [8, 8],
    //     popupAnchor: [-3, -76]

    // });

    // marker.setIcon(myIcon);

    // if (urlParams.has('nodeNames')) {
    
    //     marker.on('mouseover',function(ev) {
    //         marker.openPopup();
    //     })
    //     console.log()
    
    // }

    _marker.on('click',function(e){
        // This adds the functions directly to the marker
        // I previously deleted this line thinking it was superfluous
        // It was not

        if (activeNode != null){
            console.log(`${node.name} clicked, ${activeNode.name} is active`);
        }
        else {
            console.log(`${node.name} clicked, no active node`);
        }

        if(window.event.altKey){
            // Default behaviour for adding a node

            printAllNodes();

        }

        else{
            
            if(node == activeNode){
                // console.log(node);

                if(window.event.shiftKey){
                    
                    toggleAccess(node);
                    
                    console.log(`${node.name} clicked, no active node`);
                
                }
                else{

                    setActiveNode(null);

                }

            }
            else if (activeNode != null){
                toggleConnection(node, activeNode);
            }
            else {
                setActiveNode(node);
            }

        }

        
            
    })
}

function printAllNodes(){
    console.print("This function will take all the nodes and all the connections, splice them together and then print them to the console");
}

function toggleConnection(node, ActiveNode) {
    // Function takes in two nodes
    // Checks connections_gbl for an existing connection between the nodes
    // if one exists, delete it
    // if not, compute distance between points and push a connection object
    /* connection = {
                        pointA: node,
                        pointB: node
                        dist: float
                        line: L.polyline
                    } */

    console.log("toggleConnection not yet populated");
}

function toggleAccess(node){
    // Function takes in a node and flips stairs boolean and updates marker colour
    node.stairs= !node.stairs

    updateColour(node);

    node.marker.redraw();
    console.log(`${node.name} toggled to stairs:${node.stairs}`);

}

function updateColour(node) {
    
    // console.log("Updating colour");
    // console.log(node)

    if (!node.stairs){
        node.marker.setStyle({fillColor: notStairsColour});
        console.log(`updateColour(${node.name}):notStairsColour`);
    }
    else{
        node.marker.setStyle({fillColor: stairsColour});
        console.log(`updateColour(${node.name}):stairsColour`);
    }
}

function setActiveNode(node){

    if (activeNode != null){
        updateColour(activeNode);
    }

    activeNode = node;

    if (activeNode != null){
        node.marker.setStyle({fillColor: activeColour});
        console.log(`Active Node Set: ${activeNode.name}`)
    }
    else {
        console.log("Active Node Unset")
    }
}

// function printJsonToTextArea(textAreaId, nodeId, nodeCoords, nodeConnections, nodeFloor){




//     document.getElementById(textAreaId).innerHTML += JSON.stringify(nodeButJson) + "<br>";

// }

// function getDistanceFromLatLonInM(lat1,lon1,lat2,lon2) {
 
//     let run = lat1 - lat2;
//     let rise = lon1 - lon2;

//     return (Math.sqrt(run*run + rise*rise)).toFixed(1);
// }

// function draw_clicks(mymap, e){

//     if (coordinates_array != undefined) {

//         try{
//             polyline.remove(mymap);
//         } catch (error) {
//             console.error(error);
//             // expected output: ReferenceError: nonExistentFunction is not defined
//             // Note - error messages will vary depending on browser
//           }

//         coordinates_array_draw = [...coordinates_array_draw, [e.latlng["lat"], e.latlng["lng"]]];
//         coordinates_array = [...coordinates_array, [e.latlng["lng"], e.latlng["lat"]]];

//         let polyline = L.polyline(coordinates_array_draw).addTo(mymap);
//         polyline.redraw()

//         if (coordinates_array.length == 1){

//             let newMarker = new L.marker(e.latlng).addTo(mymap).on('click', function() {    
            
//                 console.log(JSON.stringify(coordinates_array).replace(/],/g,"],\n"));
//                 coordinates_array = [];
//                 coordinates_array_draw = [];
            
//             });
//             //console.log("newMarker added");
//         }
//         console.log(JSON.stringify(coordinates_array).replace(/],/g,"],\n"));
//     } 
//     else {

//         coordinates_array_draw = [
//             [e.latlng["lat"], e.latlng["lng"]]
//         ];

//         coordinates_array = [
//             [e.latlng["lat"], e.latlng["lng"]]
//         ];

//     }

//     coordinates = [
//         [e.latlng["lat"], e.latlng["lng"]]
//     ];

// }

// function drawFromJSON(){

//     for (i = 0; i < wayFindingNodes.length; i++){
//         addNodes(
//             wayFindingNodes[i].id,
//             wayFindingNodes[i].coords,
//             wayFindingNodes[i].floor,
//             wayFindingNodes[i].map,
//             wayFindingNodes[i].room
//         );
        
//     console.log("Logging node " + nodeName + ": " + node);
//     curr_node += 1;
    
//     }

// }

// function addNodesToJSON(nodeName, node, floor, map = [], room = false){

//     let nodeButJson =  {
//         "id": nodeName,
//         "coords": node,
//         "map": map,
//         "floor": floor,
//         "room": room
//     }

//     wayFindingNodes.push(nodeButJson);

// }

// function addConnection(node, connection){

//     node.map.push(connection);

// }

// function removeConnection(node, connection){

//     let spliceIndex = node.map.indexOf(connection);
//     node.map.splice(spliceIndex, 1);
//     rebuildMap();

// }

// function rebuildMap(){
//     console.log("rebuildMap(): Function not built yet");
// }