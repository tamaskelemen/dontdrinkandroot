"use strict"

window.onload = function () {
    mapboxgl.accessToken = 'pk.eyJ1IjoibmVsc25vZHkiLCJhIjoiY2syNmo5cHp3MGJ4NDNyczl5ZjgxZzljZyJ9.hVyim5Txe-nXT1b7C-ucvg';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.50, 40],
        zoom: 3
    });
}

