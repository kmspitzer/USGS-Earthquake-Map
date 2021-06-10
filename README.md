# leaflet-challenge


Kate Spitzer     collaboration with Rick Spitzer


Step 1
------
This functionality reads in a USGS geoJSON file containing earthquake data and displays it on a map, using mapbox, leaflet, and javascript.
The location of each earthquake in the dataset is plotted using its geographical coordinates.  Each marker is a circle whose radius is a
representation of the earthquake magnitude, and is assigned a color indicating the depth of the earthquake's epicenter.

A legend is displayed in the bottom right corner of the map showing the colorscale used for epicenter depth, and the range of values each
represents.


Step 2
------
This functionality reads in a USGS geoJSON file containing earthquake data and displays it on a map, using mapbox, leaflet, and javascript.
The location of each earthquake in the dataset is plotted using its geographical coordinates.  Each marker is a circle whose radius is a
representation of the earthquake magnitude, and is assigned a color indicating the depth of the earthquake's epicenter.  Additionally,
geoJSON data is read and used to overlay tectonic plate boundaries on the map.

A legend is displayed in the bottom right corner of the map showing the colorscale used for epicenter depth, and the range of values each
represents.

A control box is displayed in the top right corner of the map which allows the user to choose the base map on which to display the points
and plates, and to toggle the earthquake markers and tectonic plate boundaries.

inputs:
------
earthquake locations: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson
tectonic plate boundaries: https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json
mapbox API key



To run the map showing tectonic plate boundaries, visit: https://kmspitzer.github.io/leaflet-challenge/Leaflet-Step-2/
To run the map without tectonic plate boundaries, visit: https://kmspitzer.github.io/leaflet-challenge/Leaflet-Step-1/
