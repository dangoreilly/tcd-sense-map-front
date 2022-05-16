polyg.on("click", function (e){

    // openInfoModal(feature.properties.Name, modal_content, [modal_info_button, modal_physical_access_button, modal_map_button]);
    console.log("Polyg clicked")

});



function draw_clicks(mymap, e){

    coordinates_array = [...coordinates_array, [e.latlng["lat"], e.latlng["lng"]]];

    polyg.setLatLngs(coordinates_array);
    polyg.setStyle({opacity:1});
    polyg.redraw();

    // if (coordinates_array != undefined) {

    //     try{
    //         polyline.remove(mymap);
    //     } catch (error) {
    //         console.error(error);
    //         // expected output: ReferenceError: nonExistentFunction is not defined
    //         // Note - error messages will vary depending on browser
    //       }

    //     coordinates_array_draw = [...coordinates_array_draw, [e.latlng["lat"], e.latlng["lng"]]];
    //     coordinates_array = [...coordinates_array, [e.latlng["lng"], e.latlng["lat"]]];

    //     let polyline = L.polyline(coordinates_array_draw).addTo(mymap);
    //     polyline.redraw()

    //     if (coordinates_array.length == 1){

    //         let newMarker = new L.marker(e.latlng).addTo(mymap).on('click', function() {    
            
    //             console.log(JSON.stringify(coordinates_array).replace(/],/g,"],\n"));
    //             coordinates_array = [];
    //             coordinates_array_draw = [];
            
    //         });
    //         //console.log("newMarker added");
    //     }
    //     console.log(JSON.stringify(coordinates_array).replace(/],/g,"],\n"));
    // } 
    // else {

    //     coordinates_array_draw = [
    //         [e.latlng["lat"], e.latlng["lng"]]
    //     ];

    //     coordinates_array = [
    //         [e.latlng["lat"], e.latlng["lng"]]
    //     ];

    // }

    // coordinates = [
    //     [e.latlng["lat"], e.latlng["lng"]]
    // ];

}

function jsonCoords(coordArr){



}