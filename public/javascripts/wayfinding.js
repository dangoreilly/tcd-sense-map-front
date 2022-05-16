var curr_node = 0;
var selected_node = '';
var wayFindingNodes = [];
// let coordinates_array = [];
// let coordinates_array_draw = [];

var connections_gbl = [];
var activeNode = null;

var nodeExists = false;

const stairsColour = "#ff3333"
const deselectColour = "#3388ff"
const activeColour = "#26ff4a"
const defaultColour = "#fff"
const connectionColour = "#00ffff"

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
            fillOpacity: 0.7,
            opacity: 0.5,
            // draggable: true
        }

        this.name = name;
        this.coords = coords;
        this.connects = [];
        this.stairs = stairs;
        this.marker = L.circleMarker(coords, options);
       
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
        console.log(`Adding node ${newNode.name}`)
    }

    for(let i = 0; i < wayFindingNodes.length; i++){
        
        if (urlParams.has('drawNodes')){
            // Normally when we load nodes, they should just be hidden
            addNodeToMap(wayFindingNodes[i], map)
        }

        for(let j = 0; j < nodes[i].connects.length; j++){

            console.log(`Connecting ${wayFindingNodes[i].name} to ${wayFindingNodes[i].connects[j]}`)

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


// wayfind.addTo(overworld_map)

//==================================================================
//========DJIKSTRA==================================================
//==================================================================

function shortestPath(start, end, stairs){

    let shortest;

    // First, process all the nodes to figure out the straightline distance
    for (i = 0; i < wayFindingNodes.length; i++){
        wayFindingNodes[i].crowFlies = dist2D(wayFindingNodes[i].coords, end.coords)
    }

    for (i = 0; i < start.connects.length; i++){
        start.connects[i]
    }

}