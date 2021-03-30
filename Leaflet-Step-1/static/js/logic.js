// Store our API endpoint inside queryUrl
var earthquakeJSON = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL
d3.json(earthquakeJSON, function(data) {
	console.log(data);



  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});


function setColor(depth) {
 
  depthColor = [{interval: 10, color: "blue"}, {interval: 30, color: "green"}, {interval: 50, color: "red"}, {interval: 70, color: "purple"}, {interval: 90,  color: "orange"}, {interval: 1000, color: "yellow"}];

  for (var i = 0; i < depthColor.length; i++) {
    if (depth <= depthColor[i].interval) {
      return(depthColor[i].color);
    }
  } 
}

function createFeatures(earthquakeData) {

	eqMarkers = [];

	// Loop through the cities array and create one marker for each city object
	for (var i = 0; i < earthquakeData.length; i++) {

		var location = [earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]];
		eqMarkers.push(L.circle(location, {
			weight: 1,
			color: "black",
			fillColor: setColor(earthquakeData[i].geometry.coordinates[2]),
			fillOpacity: 0.5,
			radius: earthquakeData[i].properties.mag * 10000
		}).bindPopup("<h3>" + earthquakeData[i].properties.place +
      			"</h3><hr><p><strong>Magnitude:</strong> " + earthquakeData[i].properties.mag + "<br><strong>Depth:</strong> "
            + earthquakeData[i].geometry.coordinates[2] + " km<br><br>" + new Date(earthquakeData[i].properties.time) + "</p>"));
  	}

	var earthquakes = L.layerGroup(eqMarkers);

	// Sending our earthquakes layer to the createMap function
	createMap(earthquakes);
}


function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("mapid", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var depthLimits = [-10,10,30,50,70,90];
      div.innerHTML = '<h3>Epicenter Depth</h3>';
      for (var i = 0; i < depthLimits.length; i++) {
        div.innerHTML += '<i style="background:' + setColor(depthLimits[i] + 1) + '"></i> ' + depthLimits[i] + (depthLimits[i + 1] ? ' km &ndash; ' + depthLimits[i + 1] + ' km <br>' : '+ km');
        }
        console.log(div);
        return div;
      }
  // Adding legend to the map
  legend.addTo(myMap);
}
