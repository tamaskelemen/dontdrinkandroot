window.onload = function () {

  const applyButton = document.getElementById('apply-button');

  let animalsWays = [];
  let heatmaps = [];
  let territoryMaps = [];

  applyButton.addEventListener('click', function () {
    const linesIsActive = $('#lines').hasClass('active');
    const heatmapIsActive = $('#heatmap').hasClass('active');
    const territoryIsActive = $('#territory').hasClass('active');

    applyButton.classList.add('loading');

    if (window.test.species.includes('Stork')) {
      fetch('http://localhost:8080//stork-data/')
          .then(res => res.json())
          .then(json => {
            addLinesToMap(json, linesIsActive);
            addHeatmapToMap(json, heatmapIsActive);
            addTerritoryToMap(json, territoryIsActive);

              applyButton.classList.remove('loading');
          })
          .catch(console.error);
    }

    fetch('http://localhost:8080//animal-path/stork/device/2013-10-26')
      .then(res => res.json())
      .then(json => {
        addLinesToMap(json, linesIsActive);
        addHeatmapToMap(json, heatmapIsActive);
        addTerritoryToMap(json, territoryIsActive);

        applyButton.classList.remove('loading');
      })
      .catch(console.error);
  });

  function addLinesToMap(linesData, isActive) {
    if (!isActive) {
      for (let i in animalsWays) {
        animalsWays[i].setMap(null);
      }
      return animalsWays = [];
    }
    for (const value in linesData) {
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

  function addHeatmapToMap(heatmapData, isActive) {
    if (!isActive) {
      for (let i in heatmaps) {
        heatmaps[i].setMap(null);
      }
      return heatmaps = [];
    }
    for (const value in heatmapData) {
      const mappedData = heatmapData[value].map(item => new google.maps.LatLng(item.lat, item.lng));
      let heatmap = new google.maps.visualization.HeatmapLayer({
        data: mappedData,
      });
      heatmap.setMap(map);
      heatmaps.push(heatmap);
    }
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
            fillOpacity: 0.35
        });
        territoryMap.setMap(map);
        territoryMaps.push(territoryMap);
        }
    }

};
