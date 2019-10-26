"use strict";

window.addEventListener('load', () => {

  map.on('click', function () {

    geojson.features[0].geometry.coordinates = [];

    jQuery.get("http://localhost:8080/movement", function (data, status) {
        console.log(data);
        data.forEach(item => {
          geojson.features[0].geometry.coordinates.push(item);
        });
        map.getSource('line-animation').setData(geojson);
    });
  });
});
