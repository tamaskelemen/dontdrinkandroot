import 'ion-rangeslider/js/ion.rangeSlider.min';
import 'ion-rangeslider/css/ion.rangeSlider.min.css';

import 'google-apis';
import 'google-map';

import '../lib/maps.google.polygon.containsLatLng';

import './toolbar';
import './layer-lines';

window.baseURL = 'http://localhost';

const animalNames = [];
export function getAnimalNames() {
    $('.dropdown.species').append({ name: 'asdf', value: 'asdf'});
    console.log($('.dropdown.species'));

    // fetch('http://localhost:8080/all-animals')
    //     .then(result => result.json())
    //     .then(json => {
    //         $('.dropdown.species');
    //         return animalNames;
    //     });
}

getAnimalNames();


function checkCoordinateIsInPolygon(coordinate, polygon) {
    var isWithinPolygon = polygon.containsLatLng(coordinate);

    if (isWithinPolygon) {
        var marker = new google.maps.Marker({
            position: coordinate,
            map: map,
            title: 'Vehicle coordinate in animal territory!'
        });
    }
}
