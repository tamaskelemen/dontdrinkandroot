// "use strict"
//
// console.log(map);

const data = [
  [{ x: 52.099878, y: 9.994248 }, { x: 49.789746, y: 9.524684 }, { x: 49.055821, y: 19.224688 }],
  [{ x: 51.727729, y: 20.667571 }, { x: 49.457914, y: 13.458649 }, { x: 48.501431, y: 5.243380 }],
];

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

    var counter = 0;

    animateLine();

    document.addEventListener('visibilitychange', function () {
      resetTime = true;
    });

    function animateLine(timestamp) {
      console.log(counter);
      if (counter++ === data.length) {
        geojson.features[0].geometry.coordinates = [];
        counter = 0;
      }
      // if (resetTime) {
      //   startTime = performance.now() - progress;
      //   resetTime = false;
      // } else {
      //   progress = timestamp - startTime;
      // }

      // if (progress > speedFactor * 360) {
      //   startTime = timestamp;
      //   geojson.features[0].geometry.coordinates = [];
      // } else {
      // var x = progress / speedFactor;
      // var y = Math.sin(x * Math.PI / 90) * 40;
      // geojson.features[0].geometry.coordinates.push([x, y]);
      for (let i = 0; i < 2; i++) {
        const { x, y } = data[i][counter];
        geojson.features[0].geometry.coordinates.push([y, x]);
      }
      map.getSource('line-animation').setData(geojson);
      // }

      setTimeout(() => {
        animation = requestAnimationFrame(animateLine);
      }, 1000);
    }
  });
});