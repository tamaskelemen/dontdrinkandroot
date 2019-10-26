window.onload = function () {

    const applyButton = document.getElementById('apply-button');

    applyButton.addEventListener('click', function () {
        const linesIsActive = jQuery('#lines').hasClass('active');
        const heatmapIsActive = jQuery('#heatmap').hasClass('active');
        const territoryIsActive = jQuery('#territory').hasClass('active');

        fetch('http://localhost:8080//animal-path/stork/device/2013-10-26')
          .then(res => res.json())
          .then(json => {
              addLinesToMap(json, linesIsActive);
              addHeatmapToMap(json, heatmapIsActive);
              addTerritoryToMap(json, territoryIsActive);
          })
          .catch(console.error);

          var triangleCoords = [
              {lat: 25.774, lng: -80.190},
              {lat: 18.466, lng: -66.118},
              {lat: 32.321, lng: -64.757},
              {lat: 25.774, lng: -80.190}
          ];

          var bermudaTriangle = new google.maps.Polygon({
              paths: triangleCoords,
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#FF0000',
              fillOpacity: 0.35
          });
          bermudaTriangle.setMap(map);
    });

    function addLinesToMap(linesData, isActive) {
        for (const value in linesData) {
            var animalsWays = new google.maps.Polyline({
                geodesic: true,
                path: linesData[value],
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
            });
            animalsWays.setMap(map);
        }
    }

    function addHeatmapToMap(heatmapData, isActive) {
        for (const value in heatmapData) {
            const mappedData = heatmapData[value].map(item => new google.maps.LatLng(item.lat, item.lng));
            heatmap = new google.maps.visualization.HeatmapLayer({
                data: mappedData
            });
            heatmap.setMap(map);
        }
    }

    function addTerritoryToMap(territoryData) {
        console.log('csinald meg');
    }

};
