// Leaflet Challenge -- Step 2
//
//      Kate Spitzer
//
//  This script uses Leaflet, Javascript and Mapbox to render a map of
//  earthquake data for the last 30 days.  Points are mapped by placing
//  a circle at the latitude and longitude of the event.  Their size is
//  determined by the magnitude of the earthquake, and the color is
//  determined by the epicenter's depth.  A legend is displayed indicating
//  the color scale for epicenter depth.  A tooltip is displayed when a
//  circle marker is clicked, displaying the location of the earthquake,
//  its magnitude, the epicenter depth, and the date and time of 
//  occurrence.
//
//  This map includes a number of basemap layers which can be chosen by
//  the viewer, as well at checkboxes to toggle the earthquake markers
//  and the tectonic plates on the map.
//
//
//

// function to set color to indicate epicenter depth
function setColor(depth) {
 
    // create color object
    depthColor = [{interval: 10, color: "#3af256"}, {interval: 30, color: "#04bfc2"}, {interval: 50, color: "#266ad1"},
                  {interval: 70, color: "#0437c2"}, {interval: 90,  color: "#a404bd"}, {interval: 1000, color: "#bd040d"}];

    // loop through color object and return
    // first match
    for (var i = 0; i < depthColor.length; i++) {
        if (depth <= depthColor[i].interval) {
            return(depthColor[i].color);
        }
    } 
}



// function to create marker layer
function createMarkers(earthquakeData) {

	eqMarkers = [];

	// loop through the earthquake locations
	for (var i = 0; i < earthquakeData.length; i++) {

		// set location to coordinates provided
		var location = [earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]];

		// push a circle marker into our list, calling setColor using
		// the depth coordinate and using the magnitude for
		// the circle radius.  add a popup to the markers
		eqMarkers.push(L.circle(location, {
			weight: 1,
			color: "black",
			fillColor: setColor(earthquakeData[i].geometry.coordinates[2]),
			fillOpacity: 0.8,
			radius: earthquakeData[i].properties.mag * 40000
			}).bindPopup("<h3>" + earthquakeData[i].properties.place +
			  		"</h3><hr><p><strong>Magnitude:</strong> " + earthquakeData[i].properties.mag + "<br><strong>Depth:</strong> "
					+ earthquakeData[i].geometry.coordinates[2] + " km<br><br>" + new Date(earthquakeData[i].properties.time) + "</p>"));
	}

	// return layer group
	return L.layerGroup(eqMarkers);
}




// function to build our map
function createMap(earthquakeData, plateData) {

	// create earthquake markers and layer groups
	var earthquakes = createMarkers(earthquakeData)
	var plates = L.layerGroup(L.geoJSON());

	// creating a geoJSON layer with the retrieved data
	L.geoJson(plateData, {
		weight: 1.5,
		color: "#ffaa00",
		fillColor: "none"
	}).addTo(plates);


	// define streetmap and darkmap layers
	var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
		attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
		tileSize: 512,
		maxZoom: 18,
		zoomOffset: -1,
		id: "satellite-v9",
		accessToken: API_KEY
	});

	var grayscalemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
		attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
		maxZoom: 18,
		id: "light-v10",
		accessToken: API_KEY
	});

	var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
		attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
		maxZoom: 18,
		id: "dark-v10",
		accessToken: API_KEY
	});

	var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
		attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
		maxZoom: 18,
		id: "outdoors-v11",
		accessToken: API_KEY
	});


	// define a baseMaps object to hold our base layers
	var baseMaps = {
		"Satellite": satellitemap,
		"Grayscale": grayscalemap,
		"Dark": darkmap,
		"Outdoors": outdoormap
	};

	// create overlay object to hold our overlay layer
	var overlayMaps = {
		"Earthquakes": earthquakes,
		"Tectonic Plates": plates
	};

	
	//myLayer.addData(geojsonFeature);

	// create our map, giving it the streetmap and earthquakes layers to display on load
	var myMap = L.map("mapid", {
		center: [
			27.50651684881357, -40.81444808324838
		],
		zoom: 3,
		layers: [satellitemap, earthquakes, plates]
	});


	// create a layer control
	// pass in our baseMaps and overlayMaps
	// add the layer control to the map	
	L.control.layers(baseMaps, overlayMaps, {
		collapsed: false
	}).addTo(myMap);

			


	// set up the legend
	var legend = L.control({ position: "bottomright" });
	legend.onAdd = function() {
		var div = L.DomUtil.create("div", "info legend");
		var depthLimits = [-10, 10, 30, 50, 70, 90];
		div.innerHTML = '<h3>Epicenter Depth</h3>';
		for (var i = 0; i < depthLimits.length; i++) {
			div.innerHTML += '<i style="background:' + setColor(depthLimits[i] + 1) + '"></i> ' + depthLimits[i] + (depthLimits[i + 1] ? ' km &ndash; ' + depthLimits[i + 1] + ' km <br>' : '+ km');
		}
		return div;
	}
	// adding legend to the map
	legend.addTo(myMap);

}


////////////////
// BEGIN MAIN //
////////////////

// define earthquake geoJSON dataset
var earthquakeJSON = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// define tectonic plate geoJSON dataset
var platesJSON = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

// perform a GET request to the query URL
d3.json(earthquakeJSON, function(eqData) {
    console.log(eqData);

    // grabbing our GeoJSON data..
    d3.json(platesJSON, function(plateData) {

		console.log(plateData);

		// create map
		createMap(eqData.features, plateData);

    });
});

