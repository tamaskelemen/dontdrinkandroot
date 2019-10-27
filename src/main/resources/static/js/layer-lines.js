import { filterParams } from './toolbar';
import { COLORS } from './color';

window.onload = function () {

  const applyButton = document.getElementById('apply-button');

  let animalsWays = [];
  let territoryMaps = [];

  applyButton.addEventListener('click', function () {
    const species = filterParams.species === [] ? [] : filterParams.species.reduce((a, b) => `${a}+${b}`);

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
        .catch(error => {
          console.error(error);
          applyButton.classList.remove('loading');
        });
    }
    if ((linesIsActive || territoryIsActive)) {
      fetch(`http://localhost:8080/animal-path/${species}/${fromDate}/${toDate}`)
        .then(res => res.json())
        .then(json => {
          // animateLinesToMap(json);
          addLinesToMap(json, linesIsActive);
          !heatmapIsActive && addHeatmapToMap([], false);
          addTerritoryToMap(json, territoryIsActive);

          applyButton.classList.remove('loading');
        })
        .catch(error => {
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
    const color = COLORS[Math.floor((Math.random() * 10) + 1)];
    for (const value in linesData) {
      let animalsWay = new google.maps.Polyline({
        geodesic: true,
        path: linesData[value],
        strokeColor: color,
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

  function animateLinesToMap(linesData, duration = 20) {
    let lines = {};
    Object.keys(linesData).forEach(key => {
      lines[key] = [new google.maps.Polyline({
        geodesic: true,
        path: [],
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
      })];
      lines[key][0].setMap(map);
    });

    let startTime = new Date().getTime();
    let prevProgress = 0;

    function animate() {
      const progress = (new Date().getTime() - startTime) / (duration * 1000);

      if (progress > 1) {
        for (let key in lines) {
          lines[key].forEach(line => line.setMap(null));
          lines[key] = [];
        }
        prevProgress = 0;
        startTime = new Date().getTime();
        return animate();
      }

      for (let key in lines) {
        const path = linesData[key].slice(
          linesData[key].length * prevProgress - 1,
          linesData[key].length * progress,
        );

        const polyline = new google.maps.Polyline({
          geodesic: true,
          path,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2,
        });

        lines[key].push(polyline);
        polyline.setMap(map);

        if (lines[key].length > 5 * duration) {
          lines[key].shift().setMap(null);
        }
      }

      prevProgress = progress;

      setTimeout(() => {
        animate();
      }, 20);
    }

    animate();
  }

  function checkVehicleCoordinateInTerritory() {
    territoryMaps.forEach(item => {
      console.log(item);
    });
  }

};
