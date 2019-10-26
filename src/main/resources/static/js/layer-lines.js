window.onload = function () {

  const applyButton = document.getElementById('apply-button');

  let animalsWays = [];
  const heatmap = new HeatmapOverlay(map,
    {
      'radius': 15,
      'maxOpacity': 1,
      latField: 'lat',
      lngField: 'lng',
      valueField: 'count',
    },
  );

  applyButton.addEventListener('click', function () {
    const linesIsActive = $('#lines').hasClass('active');
    const heatmapIsActive = $('#heatmap').hasClass('active');
    const territoryIsActive = $('#territory').hasClass('active');

    applyButton.classList.add('loading');

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
    let testData = { data: [] };

    if (isActive) {
      testData = {
        max: 8,
        data: Object.keys(heatmapData).reduce((accumulator, key) => [...accumulator, ...heatmapData[key]], []),
      };
    }

    heatmap.setData(testData);
  }

  function addTerritoryToMap(territoryData) {
    console.log('csinald meg');
  }
};
