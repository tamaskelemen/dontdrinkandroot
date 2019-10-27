import 'ion-rangeslider/js/ion.rangeSlider.min';
import 'ion-rangeslider/css/ion.rangeSlider.min.css';

import 'google-apis';
import 'google-map';

import '../lib/maps.google.polygon.containsLatLng';

import './toolbar';
import './layer-lines';

var coordinate = new google.maps.LatLng(40, -90);
var polygon = new google.maps.Polygon([], "#000000", 1, 1, "#336699", 0.3);
var isWithinPolygon = polygon.containsLatLng(coordinate);
console.log(isWithinPolygon);