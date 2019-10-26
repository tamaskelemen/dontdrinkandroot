window.onload = function () {
  const sendButton = document.getElementById('send');

  sendButton.addEventListener('click', function () {

    fetch('http://localhost:8080//animal-path/stork/device/2019-10-26')
      .then(res => res.json())
      .then(json => {
          console.log(json);
          var flightPath = new google.maps.Polyline({
              path: json,
              geodesic: true,
              strokeColor: '#FF0000',
              strokeOpacity: 1.0,
              strokeWeight: 2,
          });

          flightPath.setMap(map);
      })
      .catch(console.error);

        var heatmapData = [
            new google.maps.LatLng(37.782, -122.447),
            new google.maps.LatLng(37.782, -122.445),
            new google.maps.LatLng(37.782, -122.443),
            new google.maps.LatLng(37.782, -122.441),
            new google.maps.LatLng(37.782, -122.439),
            new google.maps.LatLng(37.782, -122.437),
            new google.maps.LatLng(37.782, -122.435),
            new google.maps.LatLng(37.785, -122.447),
            new google.maps.LatLng(37.785, -122.445),
            new google.maps.LatLng(37.785, -122.443),
            new google.maps.LatLng(37.785, -122.441),
            new google.maps.LatLng(37.785, -122.439),
            new google.maps.LatLng(37.785, -122.437),
            new google.maps.LatLng(37.785, -122.435)
        ];

        var sanFrancisco = new google.maps.LatLng(37.774546, -122.433523);

        map = new google.maps.Map(document.getElementById('map'), {
            center: sanFrancisco,
            zoom: 13,
            mapTypeId: 'satellite'
        });

        var heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatmapData
        });
        heatmap.setMap(map);

    var flightPlanCoordinates = [
      { lat: 37.772, lng: -122.214 },
      { lat: 21.291, lng: -157.821 },
      { lat: -18.142, lng: 178.431 },
      { lat: -27.467, lng: 153.027 },
    ];
    var flightPath = new google.maps.Polyline({
      path: flightPlanCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });

  flightPath.setMap(map);
    flightPath.setMap(map);

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
};
