// "use strict"
//
// console.log(map);

window.addEventListener('load', () => {
  const geojson = {
    'type': 'FeatureCollection',
    'features': [{
      'type': 'Feature',
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          [0, 0],
        ],
      },
    }],
  };

  var speedFactor = 30; // number of frames per longitude degree
  var animation; // to store and cancel the animation
  var startTime = 0;
  var progress = 0; // progress = timestamp - startTime
  var resetTime = false; // indicator of whether time reset is needed for the animation

  map.on('load', function () {
    map.addLayer({
      'id': 'line-animation',
      'type': 'line',
      'source': {
        'type': 'geojson',
        'data': geojson,
      },
      'layout': {
        'line-cap': 'round',
        'line-join': 'round',
      },
      'paint': {
        'line-color': '#ed6498',
        'line-width': 5,
        'line-opacity': .8,
      },
    });

    startTime = performance.now();

    animateLine();

    document.addEventListener('visibilitychange', function () {
      resetTime = true;
    });

    function animateLine(timestamp) {
      if (resetTime) {
        startTime = performance.now() - progress;
        resetTime = false;
      } else {
        progress = timestamp - startTime;
      }

      if (progress > speedFactor * 360) {
        startTime = timestamp;
        geojson.features[0].geometry.coordinates = [];
      } else {
        var x = progress / speedFactor;
        var y = Math.sin(x * Math.PI / 90) * 40;
        geojson.features[0].geometry.coordinates.push([x, y]);
        map.getSource('line-animation').setData(geojson);
      }

      animation = requestAnimationFrame(animateLine);
    }
  });
});