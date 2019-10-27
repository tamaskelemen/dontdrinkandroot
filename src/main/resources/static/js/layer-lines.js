import { filterParams } from './toolbar';

window.onload = function () {

  const applyButton = document.getElementById('apply-button');

  let animalsWays = [];
  let territoryMaps = [];

  applyButton.addEventListener('click', function () {
    const species = filterParams.species === [] ? [] : filterParams.species.reduce((a,b) => `${a},${b}`);

    const linesIsActive = $('#lines').hasClass('active');
    const heatmapIsActive = $('#heatmap').hasClass('active');
    const territoryIsActive = $('#territory').hasClass('active');

    const fromDate = filterParams.fromDate;
    const toDate = filterParams.toDate;

    applyButton.classList.add('loading');

    // if (window.test.species.includes('Stork')) {
    //   fetch('http://localhost:8080//stork-data/')
    //     .then(res => res.json())
    //     .then(json => {
    //       addLinesToMap(json, linesIsActive);
    //       addHeatmapToMap(json, heatmapIsActive);
    //       addTerritoryToMap(json, territoryIsActive);
    //
    //       applyButton.classList.remove('loading');
    //     })
    //     .catch(console.error);
    // }

    if (heatmapIsActive) {
      fetch(`http://localhost:8080/heatmap-date-range/${species}/${fromDate}/${toDate}`)
        .then(res => res.json())
        .then(json => {
          !linesIsActive && addLinesToMap({}, false);
          addHeatmapToMap(json, heatmapIsActive);
          !territoryIsActive && addTerritoryToMap({}, false);

          applyButton.classList.remove('loading');
        })
        .catch( error => {
          console.error(error);
          applyButton.classList.remove('loading');
        });
    }
    if ((linesIsActive || territoryIsActive) && species !== []) {
      console.log(fromDate);
      fetch(`http://localhost:8080/animal-path/${species}/${fromDate}/${toDate}`)
        .then(res => res.json())
        .then(json => {
          addLinesToMap(json, linesIsActive);
          !heatmapIsActive && addHeatmapToMap([], false);
          addTerritoryToMap(json, territoryIsActive);

          applyButton.classList.remove('loading');
        })
          .catch( error => {
            console.error(error);
            applyButton.classList.remove('loading');
          });
    }
  });


  function addLinesToMap(linesData, isActive) {
    if (!isActive) {
      for (let i in animalsWays) {
        animalsWays[i].setMap(null);
      }
      return animalsWays = [];
    }
    for (const value in linesData) {
      // let lat = linesData[value].map(item =>  item.lat);
      // let lng = linesData[value].map(item =>  item.lng);
      // let path = bspline(lat, lng);
      let animalsWay = new google.maps.Polyline({
        geodesic: true,
        path: linesData[value],
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });
      animalsWay.setMap(map);
      animalsWays.push(animalsWay);
    }
  }

  function addHeatmapToMap(data, isActive) {
    let testData = { data: [] };

    if (isActive) {
      testData = {
        max: 8,
        data,
      };
    }

    heatmapOverlay.setData(testData);
  }

  function addTerritoryToMap(territoryData, isActive) {
    if (!isActive) {
      for (let i in territoryMaps) {
        territoryMaps[i].setMap(null);
      }
      return territoryMaps = [];
    }
    for (const value in territoryData) {
      const territoryMap = new google.maps.Polygon({
        paths: territoryData[value],
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
      });
      territoryMap.setMap(map);
      territoryMaps.push(territoryMap);
    }
  }

  function bspline(lats, lngs) {
    let i, t, ax, ay, bx, by, cx, cy, dx, dy, lat, lng, points;
    points = [];

    for (i = 2; i < lats.length - 2; i++) {
      for (t = 0; t < 1; t += 0.2) {
        ax = (-lats[i - 2] + 3 * lats[i - 1] - 3 * lats[i] + lats[i + 1]) / 6;
        ay = (-lngs[i - 2] + 3 * lngs[i - 1] - 3 * lngs[i] + lngs[i + 1]) / 6;

        bx = (lats[i - 2] - 2 * lats[i - 1] + lats[i]) / 2;
        by = (lngs[i - 2] - 2 * lngs[i - 1] + lngs[i]) / 2;

        cx = (-lats[i - 2] + lats[i]) / 2;
        cy = (-lngs[i - 2] + lngs[i]) / 2;

        dx = (lats[i - 2] + 4 * lats[i - 1] + lats[i]) / 6;
        dy = (lngs[i - 2] + 4 * lngs[i - 1] + lngs[i]) / 6;

        lat = (ax * Math.pow(t + 0.1, 3)) +
          (bx * Math.pow(t + 0.1, 2)) +
          (cx * (t + 0.1)) + dx;

        lng = (ay * Math.pow(t + 0.1, 3)) +
          (by * Math.pow(t + 0.1, 2)) +
          (cy * (t + 0.1)) + dy;

        points.push(new google.maps.LatLng(lat, lng));
      }
    }
    return points;
  }

};
