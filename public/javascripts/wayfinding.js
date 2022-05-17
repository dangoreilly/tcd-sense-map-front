var curr_node = 0;
var selected_node = '';
var wayFindingNodes = [];
// let coordinates_array = [];
// let coordinates_array_draw = [];

var connections_gbl = [];
var activeNode = null;

var nodeExists = false;
var stairs = false;

const stairsColour = "#ff3333"
const deselectColour = "#3388ff"
const activeColour = "#26ff4a"
const defaultColour = "#fff"
const connectionColour = "#00ffff"

const visibleOptions = {
    fillOpacity: 0.7,
    opacity: 0.5
}

class wfNode{



    name;
    coords;
    connects;
    stairs;
    marker;
    crowFlies;
    rabbitJumps;
    


    constructor(name, coords, stairs = false){

        let options = {
            fillColor: deselectColour,
            color: defaultColour,
            // fillOpacity: 0.7,
            // opacity: 0.5,
            fillOpacity:0,
            opacity:0,
            interactive: false
            // draggable: true
        }

        this.name = name;
        this.coords = coords;
        this.connects = [];
        this.stairs = stairs;
        this.marker = L.circleMarker(coords, options).addTo(overworld_map);
       
    }

    // updatePos(_coords){
    //     this.coords = _coords;
    //     this.marker.redraw();
    //     // TODO:
    //     // redraw connections
    // }

    connect(cntcn){
        //Takes in a connection object
        // adds it to the list of connections on the node
        this.connects.push(cntcn);
    }
    
    disconnect(cntcn){
        let i = this.connects.indexOf(cntcn)

        if(i >= 0){
            // Remove the connection from the local array
            this.connects.splice(i,1);
        }
        else{
            console.log(`Tried to remove a connection from ${this.name} (${cntcn.pointA.name}:${cntcn.pointB.name}), but it couldn't be found`);
        }
    }

    delete(){
        let i = wayFindingNodes.indexOf(this);

        if(i >= 0){
            // Remove the node from the global array
            wayFindingNodes.splice(i,1);

            // Then go through and delete every connection it has
            this.printConnections()
            while(this.connects.length > 0) {
                this.connects[0].delete();
            }

            console.log(`Removed node ${this.name}`);
            this.marker.remove();

        }
        else{
            console.log(`Tried to remove ${this.name}, but it couldn't be found`);
        }
    }

    printConnections(){
        console.log("Connections:")
        this.connects.forEach( con =>{
            console.log(con.name)
        })
    }

    connectedTo(){
        // Returns string of all 
        let list = [];

        this.connects.forEach(con =>{
            // Loop through all connections
            // Establish who the second party is for each connection
            // add it to the list
            if (con.pointA.name == this.name){
                list.push(con.pointB.name);
            }
            else list.push(con.pointA.name);

        })

        return list;
    }
    

    json(){
        // Returns all the key details of the node in a JSON string

        let c_l = this.connectedTo()
        let connectslist = "";

        for(i = 0; i < c_l.length; i++){
            connectslist += `'${c_l[i]}'`

            if (i+1 < this.connects.length){
                connectslist += `,
                `
            }
        }

        let jsontxt = 
        `{  
        name: '${this.name}', 
        coords: [${this.coords}], 
        connects: [${connectslist}],
        stairs: ${this.stairs}
        }`;

        return jsontxt;
    }

    findCrowFlies(point){
        this.crowFlies = dist2D(this.coords, point);
        return this.crowFlies;
    }

}

class wfConnection{

    pointA;
    pointB;
    length;
    line;
    name;

    constructor(_pointA, _pointB, display = true){

        // style
        let options = {
            // fillColor: deselectColour,
            color: defaultColour,
            // fillOpacity: 0.7,
            opacity: 0.5,
            interactive: false
            // draggable: true
        }

        // The key details
        this.pointA = _pointA;
        this.pointB = _pointB;
        this.length = dist2D(_pointA.coords, _pointB.coords);
        this.name = _pointA.name + ":" + _pointB.name //Mostly for debugging

        // Draw it on the map so we can see what we're doing
        // if (display){
            this.line = L.polyline([_pointA.coords, _pointB.coords], options);
        // }

        // Connect both ends to the nodes
        // It has to be connected on both sides so that we can crawl in both directions
        _pointA.connect(this);
        _pointB.connect(this);

        //Once all the details are set, add it to the global array
        connections_gbl.push(this);


    }


    delete(){

        console.log(`Attempting to remove connection ${this.name}`)
        let i = connections_gbl.indexOf(this);

        if(i >= 0){
            // Remove from global array
            connections_gbl.splice(i,1);

            // Remove from both local arrays
            this.pointA.disconnect(this);
            this.pointB.disconnect(this);
            console.log(`Removed connection ${this.name}`);
            this.line.remove();
        }
        else{
            console.log(`Tried to remove connection ${this.name}, but it couldn't be found`);
        }
    }

    json(){
        let jsontxt = 
        `{  name: '${this.name}', 
        pointA: '${this.pointA.name}', 
        pointB: '${this.pointB.name}'
        }`;

        return jsontxt
    }
    

}


var wayfind = L.control({position:"topright"});

wayfind.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'wayfind'); // create a div with a class "info"
    // this.update();
    // this._div.innerHTML = `<p onclick='listenForStart()'>Start: <span id='start_coords'>?</span>
    // </p><p onclick='listenForEnd()'>End: <span id='end_coords'>?</span></p>
    // <input type="checkbox" id="stairs" name="stairs" value="stairs" onclick='toggleStairs()'>
    // <label for="stairs">Include Stairs</label></br>`+
    // `
    //  <button type="button" class="btn btn-primary" onclick="makeRoute()">Make Route</button>`;
    // this.update();

    
    this._div.innerHTML = `<div class="btn-group" role="group" aria-label="Start Coordinates">
    <button type="button" class="btn btn-outline-primary" onclick='listenForStart()'>Start</button>
    <button type="button" class="btn btn-outline-primary" disabled>?</button>
    </div> </br>
    <div class="btn-group" role="group" aria-label="End Coordinates">
    <button type="button" class="btn btn-outline-primary" onclick='listenForEnd()'>End</button>
    <button type="button" class="btn btn-outline-primary" disabled>?</button>
    </div></br>
    <input type="checkbox" id="stairs" name="stairs" value="stairs" onclick='toggleStairs()'>
    <label for="stairs">Include Stairs</label></br>
    <button type="button" class="btn btn-primary" onclick="makeRoute()">Make Route</button>`;
    

    return this._div;
};

wayfind.update = function () {

    let end_coords_text = `?`;
    let start_coords_text = `?`;

    // Nicely format the coords so that 18 decimal places don't print to the GUI
    if (wayfind_start != null){
        let start_coords_y = Math.round(wayfind_start.coords[0] * 100) / 100;
        let start_coords_x = Math.round(wayfind_start.coords[1] * 100) / 100;

        start_coords_text = `${start_coords_x}, ${start_coords_y}`;
    }

    
    if (wayfind_end != null){
        let end_coords_y = Math.round(wayfind_end.coords[0] * 100) / 100;
        let end_coords_x = Math.round(wayfind_end.coords[1] * 100) / 100;

        end_coords_text = `${end_coords_x}, ${end_coords_y}`;
    }

    

    let stairs_check = stairs ? "checked" : "";
    

    if (startListenFlag){
        start_coords_text = "--,--";
    }
    if (endListenFlag){
        end_coords_text = "--,--";
    }

    // let start_coords_text = start_coords_x != null ? `${start_coords_x}, ${start_coords_y}` : "?";
    // let end_coords_text = start_coords_y != null ? `${end_coords_x}, ${end_coords_y}` : "?";
    // let stairs_check = stairs ? "checked" : "";
    // this._div.innerHTML = `<p onclick='listenForStart()'>Start: <span id='start_coords'>${start_coords_text}</span></p>
    // <p onclick='listenForEnd()'>End: <span id='end_coords'>${end_coords_text}</span></p>
    // <input type="checkbox" id="stairs" name="stairs" value="stairs" onclick='toggleStairs()' ${stairs_check}>
    // <label for="stairs">Include Stairs</label> </br>` +
    // `<button type="button" class="btn btn-primary" onclick="makeRoute()">Make Route</button>`;

    this._div.innerHTML = `<div class="btn-group" role="group" aria-label="Start Coordinates">
    <button type="button" class="btn btn-outline-primary" onclick='listenForStart()'>Start</button>
    <button type="button" class="btn btn-outline-primary" disabled>${start_coords_text}</button>
    </div> </br>
    <div class="btn-group" role="group" aria-label="End Coordinates">
    <button type="button" class="btn btn-outline-primary" onclick='listenForEnd()'>End</button>
    <button type="button" class="btn btn-outline-primary" disabled>${end_coords_text}</button>
    </div></br>
    <input type="checkbox" id="stairs" name="stairs" value="stairs" onclick='toggleStairs()' ${stairs_check}>
    <label for="stairs">Include Stairs</label></br>
    <button type="button" class="btn btn-primary" onclick="makeRoute()">Make Route</button>`;
};

wayfind.update();

function listenForStart(){
    startListenFlag = true;
    endListenFlag = false;
}
function listenForEnd(){
    startListenFlag = false;
    endListenFlag = true;
}
function toggleStairs(){
    stairs = !stairs;
    console.log(`Stairs = ${stairs}`);
    // findWay(overworld_map, [wayfind_start, wayfind_end], route);
}

function makeRoute(){
    findWay(overworld_map, [wayfind_start, wayfind_end], route)
};

function findWay(map, points, route){

    let start = points[0];
    let end = points[1];

    // let start = {
    //     ll: points[0],

    //     x: points[0].lat,
    //     y: points[0].lng
    // }
    // let end = {
    //     ll: points[1],

    //     x: points[1].lat,
    //     y: points[1].lng
    // }

    // let startMarker = new L.marker(e.latlng).addTo(mymap)
    // var startMarker = new L.marker(start.ll).addTo(map);
    // var endMarker = new L.marker(end.ll).addTo(map);
    
    // var startIcon = L.icon({
    //     iconUrl: './stylesheets/images/point.png',
    //     iconSize: [16, 16],
    //     iconAnchor: [8, 8]
    //     // popupAnchor: [-3, -76]
    // });
    // var endIcon = L.icon({
    //     iconUrl: './stylesheets/images/point_c.png',
    //     iconSize: [16, 16],
    //     iconAnchor: [8, 8],
    //     opacity: 1
    //     // popupAnchor: [-3, -76]
    // });

    // startMarker.setIcon(startIcon);
    // endMarker.setIcon(endIcon);

    let nodePath = shortestPath(start, end, stairs);
    let pointPath = nodes_to_latlng(nodePath);


    // let route = L.polyline([start.ll,end.ll], {color: 'red'}).addTo(map);
    route.setLatLngs(pointPath);
    route.setStyle({opacity:1});
    route.redraw();
}

//Function to take in array of node objects and return array of latlngs for drawing
function nodes_to_latlng(arr){

    let return_arr = [];

    for (i = 0; i < arr.length; i++){
        return_arr.push(arr[i].coords);
    }

    return return_arr;

}

function loadNodes(nodes, map){

    console.log(`Loading ${nodes.length} nodes`)

    for(let i = 0; i < nodes.length; i++){

        let _name = nodes[i].name;
        let _coords = nodes[i].coords;
        let _connects = nodes[i].connects;
        let _stairs = nodes[i].stairs;
        let _display = false;
        // if (urlParams.has('drawNodes')) _display = true;

        let newNode = new wfNode(_name,_coords,_stairs);

        wayFindingNodes.push(newNode);
        // console.log(`Adding node ${newNode.name}`)
    }

    for(let i = 0; i < wayFindingNodes.length; i++){
        
        if (urlParams.has('drawNodes')){
            // Normally when we load nodes, they should just be hidden
            addNodeToMap(wayFindingNodes[i], map)
            wayFindingNodes[i].marker.setStyle(visibleOptions);
            wayFindingNodes[i].marker.setStyle({interactive:true});
        }

        for(let j = 0; j < nodes[i].connects.length; j++){

            // console.log(`Connecting ${wayFindingNodes[i].name} to ${wayFindingNodes[i].connects[j]}`)

            let otherSide = findNodeByName(nodes[i].connects[j])

            if (findConnection(wayFindingNodes[i], otherSide) == null){
                
                let con = new wfConnection(wayFindingNodes[i], otherSide);
                
                if (urlParams.has('drawNodes')){
                    // Normally when we load connections, they should just be hidden
                    con.line.addTo(map);
                }
            }

        }

    }

}

function findNodeByName(name){
    // Takes in string _name_ and returns the node that has that name
    // TODO: Add clean handling for if the node doesn't exist
    // If the node doesn't exist and this function has been called, something real bad
    // has already happened

    for(let i = 0; i < wayFindingNodes.length; i++){

        if (wayFindingNodes[i].name == name){
            return wayFindingNodes[i];
        }

    }

}

function findNearestWfNode(latlng){

    let testPoint = [latlng.lat, latlng.lng];
    // console.log(`Test Point at ${testPoint}`);

    let closest_node = null;
    let dist_to_closest;

    for(let i = 0; i < wayFindingNodes.length; i++){

        if (closest_node == null){
            closest_node = wayFindingNodes[i];
            dist_to_closest = dist2D(testPoint, closest_node.coords);
        }

        else{

            let dist_to_i = dist2D(testPoint, wayFindingNodes[i].coords)

            // console.log(`Distance from ${testPoint} to ${wayFindingNodes[i].coords} is ${dist_to_i}`);

            if (dist_to_closest > dist_to_i){
                closest_node = wayFindingNodes[i];
                dist_to_closest = dist_to_i;
            }

        }

    }

    return closest_node

}

function dist2D(_p1, _p2){

    rise = _p1[0] - _p2[0];
    run = _p1[1] - _p2[1];

    return Math.sqrt(rise*rise + run*run);

}


// wayfind.addTo(overworld_map)

//==================================================================
//========DJIKSTRA==================================================
//==================================================================

function shortestPath(start, end, stairs){

    // Third Party Djikstra Implementation
    // Extended to A*
    // First we need to prepare our data for processing:

    //Generate an empty map
    var map = {};

    //Add in all our nodes
    for (i = 0; i < wayFindingNodes.length; i++){

        let node_added = false;

        //Function will have stairs value passed
        //If stairs is false, then only nodes which also have stairs=false should be processed
        if (!stairs){
            if(!wayFindingNodes[i].stairs){
                map[wayFindingNodes[i].name] = {};
                node_added = true;
            }
        }
        else {
            map[wayFindingNodes[i].name] = {};
            node_added = true;
        }

        //Add the connections
        //This may be deleted if the double edge problem breaks it
        //First, check if the node passed the vibe (stair) check
        if(node_added){
            //Loop through all the connections, add them to the hash map

            // wayFindingNodes[i].connectedTo().forEach( e => {
            //     //Find the actual node

            // })
            let otherSide;

            for(j = 0; j < wayFindingNodes[i].connects.length; j++){
                let d_con = wayFindingNodes[i].connects[j];

                if (d_con.pointA.name == wayFindingNodes[i].name) otherSide = d_con.pointB;
                else otherSide = d_con.pointA;

                map[wayFindingNodes[i].name][otherSide.name] = d_con.length + otherSide.findCrowFlies(end.coords);
            }
        }


        // wayFindingNodes[i].crowFlies = dist2D(wayFindingNodes[i].coords, end.coords)
    }

    /* I'm gonna make it like double edges
    //cycle through connections and add to whatever node is first
    //because this implementation does not look double edges

    for (i = 0; i < connections_gbl.length; i++){

        let d_con = connections_gbl[i];

        //because we may have filtered for stairs earlier, we need to make sure the node exists
        if(!d_con.pointA.stairs && !d_con.pointB.stairs){
            // Base connection length plus CrowFlies distance for this route
            map[d_con.pointA.name][d_con.pointB.name] = d_con.length + d_con.pointB.findCrowFlies(end.coords);
        }
    }
    */





    //Print the map for debugging
    for (i = 0; i < wayFindingNodes.length; i++){
        console.log(wayFindingNodes[i].name);
        console.log(map[wayFindingNodes[i].name]);
    }

    // Generating this map every time is much more resource intensive than it needs to be; but is only temporary
    // To properly handle room to room nav, this function will need to be an API call in which case everything can be much more centralised
    var graph = new Graph(map);

    return route_names_to_nodes(graph.findShortestPath(start.name, end.name))

}

//We need to convert the names of the nodes back to the node objects so that we can handle drawing the route
function route_names_to_nodes(arr){

    if (arr == null){
        console.log("No route found");
        return;
    }

    let return_arr = [];

    for (i = 0; i < arr.length; i++){
        return_arr.push(findNodeByName(arr[i]));
    }

    return return_arr;

}