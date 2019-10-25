"use strict"

let actualCountry = undefined;
let map;

window.onload = function () {
    mapboxgl.accessToken = 'pk.eyJ1IjoibmVsc25vZHkiLCJhIjoiY2syNmo5cHp3MGJ4NDNyczl5ZjgxZzljZyJ9.hVyim5Txe-nXT1b7C-ucvg';

    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.50, 40],
        zoom: 3
    });

    map.on('load', function () {
        map.addSource('states', {
            'type': 'geojson',
            'data': 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson'
        });
        map.addLayer({
            'id': 'states-layer',
            'type': 'fill',
            'source': 'states',
            'paint': {
                "fill-outline-color": "#666",
                "fill-color": "rgba(0,0,0,0.1)"
            }
        });

        map.addLayer({
            'id': 'states-highlited',
            'type': 'fill',
            'source': 'states',
            'paint': {
                "fill-outline-color": "#00b9ff",
                "fill-color": "#00b9ff",
                "fill-opacity": 0.5
            },
            'filter': ["in", "geounit", ""]
        });

        map.addLayer({
            'id': 'states-selected',
            'type': 'fill',
            'source': 'states',
            'paint': {
                "fill-color": "#787878",
                "fill-opacity": 0.5
            },
            'filter': ["in", "geounit", ""]
        });

        map.on('click', function (e) {
            var features = map.queryRenderedFeatures(e.point, { layers: ['states-layer'] });
            var feature = features[0];

            if (!feature || !feature.properties) {
                return;
            }

            if(actualCountry == null){
                actualCountry = feature.properties.geounit;
            }
            map.setFilter('states-highlited', ['in', 'geounit', feature.properties.geounit]);

        });

        map.on('mousemove', function(e){
            var features = map.queryRenderedFeatures(e.point, { layers: ['states-layer'] });
            var feature = features[0];

            if (!feature || !feature.properties) {
                return;
            }

            map.setFilter('states-selected', ['in', 'geounit', feature.properties.geounit]);
        });

    });
}


