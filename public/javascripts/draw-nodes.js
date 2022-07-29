// var curr_node = 0;
// var selected_node = '';
// var wayFindingNodes = [];
// // let coordinates_array = [];
// // let coordinates_array_draw = [];

// var connections_gbl = [];
// var activeNode = null;

// var nodeExists = false;

// const stairsColour = "#ff3333"
// const deselectColour = "#3388ff"
// const activeColour = "#26ff4a"
// const defaultColour = "#fff"
// const connectionColour = "#00ffff"

// class wfNode{



//     name;
//     coords;
//     connects;
//     stairs;
//     marker;


//     constructor(name, coords){

//         let options = {
//             fillColor: deselectColour,
//             color: defaultColour,
//             fillOpacity: 0.7,
//             opacity: 0.5,
//             // draggable: true
//         }

//         this.name = name;
//         this.coords = coords;
//         this.connects = [];
//         this.stairs = false;
//         this.marker = L.circleMarker(coords, options);
       
//     }

//     // updatePos(_coords){
//     //     this.coords = _coords;
//     //     this.marker.redraw();
//     //     // TODO:
//     //     // redraw connections
//     // }

//     connect(cntcn){
//         this.connects.push(cntcn);
//     }
    
//     disconnect(cntcn){
//         let i = this.connects.indexOf(cntcn)

//         if(i >= 0){
//             // Remove the connection from the local array
//             this.connects.splice(i,1);
//         }
//         else{
//             console.log(`Tried to remove a connection from ${this.name} (${cntcn.pointA.name}:${cntcn.pointB.name}), but it couldn't be found`);
//         }
//     }

//     delete(){
//         let i = wayFindingNodes.indexOf(this);

//         if(i >= 0){
//             // Remove the node from the global array
//             wayFindingNodes.splice(i,1);

//             // Then go through and delete every connection it has
//             this.printConnections()
//             while(this.connects.length > 0) {
//                 this.connects[0].delete();
//             }

//             console.log(`Removed node ${this.name}`);
//             this.marker.remove();

//         }
//         else{
//             console.log(`Tried to remove ${this.name}, but it couldn't be found`);
//         }
//     }

//     printConnections(){
//         console.log("Connections:")
//         this.connects.forEach( con =>{
//             console.log(con.name)
//         })
//     }

//     connectedTo(){
//         let list = [];

//         this.connects.forEach(con =>{
//             // Loop through all connections
//             // Establish who the second party is for each connection
//             // add it to the list
//             if (con.pointA.name == this.name){
//                 list.push(con.pointB.name);
//             }
//             else list.push(con.pointA.name);

//         })

//         return list;
//     }
    

//     json(){

//         let c_l = this.connectedTo()
//         let connectslist = "";

//         for(i = 0; i < c_l.length; i++){
//             connectslist += `'${c_l[i]}'`

//             if (i+1 < this.connects.length){
//                 connectslist += `,
//                 `
//             }
//         }

//         let jsontxt = 
//         `{  
//         name: '${this.name}', 
//         coords: [${this.coords}], 
//         connects: [${connectslist}],
//         stairs: ${this.stairs}
//         }`;

//         return jsontxt;
//     }

// }

// class wfConnection{

//     pointA;
//     pointB;
//     length;
//     line;
//     name;

//     constructor(_pointA, _pointB){

//         // style
//         let options = {
//             // fillColor: deselectColour,
//             color: defaultColour,
//             // fillOpacity: 0.7,
//             opacity: 0.5,
//             interactive: false
//             // draggable: true
//         }

//         // The key details
//         this.pointA = _pointA;
//         this.pointB = _pointB;
//         this.length = dist2D(_pointA.coords, _pointB.coords);
//         this.name = _pointA.name + ":" + _pointB.name //Mostly for debugging

//         // Draw it on the map so we can see what we're doing
//         this.line = L.polyline([_pointA.coords, _pointB.coords], options);

//         // Connect both ends to the nodes
//         // It has to be connected on both sides so that we can crawl in both directions
//         _pointA.connect(this);
//         _pointB.connect(this);

//         //Once all the details are set, add it to the global array
//         connections_gbl.push(this);


//     }


//     delete(){

//         console.log(`Attempting to remove connection ${this.name}`)
//         let i = connections_gbl.indexOf(this);

//         if(i >= 0){
//             // Remove from global array
//             connections_gbl.splice(i,1);

//             // Remove from both local arrays
//             this.pointA.disconnect(this);
//             this.pointB.disconnect(this);
//             console.log(`Removed connection ${this.name}`);
//             this.line.remove();
//         }
//         else{
//             console.log(`Tried to remove connection ${this.name}, but it couldn't be found`);
//         }
//     }

//     json(){
//         let jsontxt = 
//         `{  name: '${this.name}', 
//         pointA: '${this.pointA.name}', 
//         pointB: '${this.pointB.name}'
//         }`;

//         return jsontxt
//     }
    

// }

// function findGlobalConnectionIndex(connection){

//     let i = 0;
//     let n = -1;

//     for(i = 0; i < connections_gbl.length; i++)
// }

// Inspired by method by hanesh
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

function Numeric_from_alphaNumeric(alpha){

    alphaNums = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    let alphaNum = 0;

    let j = 1;

    for (i = alpha.length-1; i>=0; i--){
        let pre_an = alphaNum;
        alphaNum += Math.pow((alphaNums.indexOf(alpha[i])+1),j);
        console.log(`The value of ${alpha[i]} is ${alphaNums.indexOf(alpha[i])+1}, i(${i})`)
        console.log(`The magnitude of ${alpha[i]} is ${j}`)
        console.log(`${pre_an} += ${j}*${alpha.indexOf(alpha[i])+1} is ${alphaNum}`)
        j++;
    }

    return alphaNum;
}

let SETUP_FLAG = false;


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

function drawNode(e, mymap) {
    // let node = [];
    // node[0] = e.latlng.lat;
    // node[1] = e.latlng.lng;    

    if (true){
        
        let nodeNum = 0;

        for (node_i = 0; node_i < wayFindingNodes.length; node_i++){
            nodeNum = Numeric_from_alphaNumeric(wayFindingNodes[node_i].name);
            console.log(`CurrNode(${curr_node}), nodeNume(${nodeNum}), i(${node_i})\n`);
            if(curr_node < nodeNum){
                curr_node = nodeNum;
            }
        }
        // curr_node = Numeric_from_alphaNumeric(wayFindingNodes[lastNode].name);
        console.log(`Highest node is ${curr_node}`);
        SETUP_FLAG = !SETUP_FLAG;
    }

    let nodeName = alphaNumeric(wayFindingNodes.length);
    // addNodes(node, nodeName, mymap);
    let node = newNode(nodeName, [e.latlng.lat, e.latlng.lng]);
    addNodeToMap(node, mymap) 
    // addNodesToJSON(node, nodeName, floor);

    console.log("Logging node " + node.name + ": " + node.coords + "(" + Numeric_from_alphaNumeric(node.name) + ")");

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
    let _marker = node.marker.setStyle(visibleOptions);//.addTo(map);
    node.marker.setStyle({interactive: true});
    updateColour(node);

    // Dragging doesn't seem to work.
    // I can't find any reports online of this bug
    // and I'm using a CDN distro of leaflet now
    // So I hardly broke it myself.
    // Event just doesn't seen to be firing at all
    // I suspect compatibility issues between 'click'
    // and 'drag'

    // _marker.on('drag', function(e){
    //     console.log("Marker being dragged");
    //     node.updatePos(e.latlng);
    // })

    // _marker.on('dragstart', function(e){
    //     console.log("start of drag");
    //     node.updatePos(e.latlng);
    // })

    _marker.on('click',function(e){
        // This adds the functions directly to the marker
        // I previously deleted this line thinking it was superfluous
        // It was not

        // if (activeNode != null){
        //     console.log(`${node.name} clicked, ${activeNode.name} is active`);
        // }
        // else {
        //     console.log(`${node.name} clicked, no active node`);
        // }

        if(window.event.altKey && window.event.shiftKey){
            //Dump all nodes and connections to console

            printAllNodes();

        }
        else if (window.event.altKey){
            // Delete the node and all its connections
            // Make sure to check if it's active and unset it if it is.

            if(node == activeNode){
                setActiveNode(null);
            }

            node.delete();

            // Weird place for this note but the graph could be generated on the fly for the stairs thing to avoid dangling edges
            
        }

        else if (window.event.shiftKey){
            // Rotate between access states

            toggleAccess(node);
            
        }

        else{
            
            if(node == activeNode){
                // If you click on the selected node without holding a control key
                // just deselect it

                setActiveNode(null);

            }
            else if (activeNode != null){
                toggleConnection(node, activeNode, map);
            }
            else {
                setActiveNode(node);
            }

        }

        
            
    })
}

function printAllNodes(){
    // Take all the nodes and their connections
    // Put them into a file
    // Have user download the file

    //Prepare the nodes for download by renumbering them all in case there were deletions
    //Might break things? We'll find out
    for (let i = 0; i < wayFindingNodes.length; i++){
        wayFindingNodes[i].name = alphaNumeric(i);
    }

    // Add all nodes to holding string
    let holdString = "["

    for (let i = 0; i < wayFindingNodes.length; i++){
        holdString += `${wayFindingNodes[i].json()},
        `;
        // console.log(holdString)
    }

    holdString += "]";

    // console.log("all nodes printed")
    
    // Now throw that hold string into a json file and let the user download it
    // In future we'll just post directly to the server but I don't understnad
    // user authentication yet (18/04)

    // console.log(holdString)
    download("nodes.txt", holdString);

    // console.log("This function will take all the nodes and all the connections, splice them together and then print them to the console");



}

//Download handling
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
// document.getElementById("btn")
//     .addEventListener("click", function () {
//         let text = document.getElementById("text").value;
//         let filename = "output.txt";
//         download(filename, text);
//     }, false);

function toggleConnection(node, ActiveNode, map) {
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

    //Check for the connection

    let con = findConnection(node, ActiveNode);

    // console.log(`con = ${con}`)

    if ( con != null ){
        //Connection exists; delete it
        con.delete()

    }
    else{
        //Conection doesn't exist; create it
        addConnection(node, activeNode, map);
    }


    // console.log("toggleConnection not yet populated");
}

function addConnection(node1, node2, map){

    let newConnection = new wfConnection(node1,node2);

    newConnection.line.addTo(map);

}

function findConnection(node1, node2){
    // If a connection between node1 and node2 exists
    // return that node

    // console.log(`Looking for a connection ${node1.name}:${node2.name}`)

    // connections_gbl.forEach(con => {

    for (i = 0; i < node1.connects.length; i++){

        let con = node1.connects[i];

        // console.log(`Checking ${con.name}`)
        
        //Connections are bidirectional, check both ways
        if ((con.pointA.name == node1.name && con.pointB.name == node2.name) || (con.pointA.name == node2.name && con.pointB.name == node1.name)){
            // console.log(`connection found between ${node1.name}:${node2.name}`)
            return con;
        }
    }

    // If every connection is checked and none match,
    // what can ya do
    
    // console.log(`no connection found between ${node1.name}:${node2.name}`)
    return null;

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
        node.marker.setStyle({color: defaultColour});
        console.log(`updateColour(${node.name}):notStairsColour`);
    }
    else{
        node.marker.setStyle({color: stairsColour});
        console.log(`updateColour(${node.name}):stairsColour`);
    }

    // node.redraw();
}

function setActiveNode(node){

    if (activeNode != null){
        activeNode.marker.setStyle({fillColor: deselectColour});
    }

    activeNode = node;

    if (activeNode != null){
        node.marker.setStyle({fillColor: activeColour});
        console.log(`Active Node Set: ${activeNode.name}`)
        activeNode.printConnections();
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