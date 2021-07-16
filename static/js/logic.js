// API source: All earthquakes for the past 7 days
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Get data
d3.json(queryURL).then(function(data) {
    console.log("Data", data.features);

    function getColor(d) {
        return d > 100 ? '#800026' :
               d > 85  ? '#BD0026' :
               d > 70  ? '#E31A1C' :
               d > 55  ? '#FC4E2A' :
               d > 40  ? '#FD8D3C' :
               d > 25  ? '#FEB24C' :
               d > 10  ? '#FED976' :
               d > -5  ? '#FFEDA0' :
                         '#f0f0f0';
    }

    var limitsArray = [100,85,70,55,40,25,10,-5]
    var colorsArray =['#800026','#BD0026','#E31A1C','#FC4E2A','#FD8D3C','#FEB24C','#FED976','#FFEDA0','#f0f0f0']

    function pointToLayer(feature, latlng) {
        var radius = feature.properties.mag
        var geojsonMarkerOptions = {
            radius: radius *2,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>Place: " + feature.properties.place +
          "</h3><hr><p>Time: " + new Date(feature.properties.time) + 
          "</p><p>Depth: " + feature.geometry.coordinates[2] + 
          "</p><p>Magnitude: " + feature.properties.mag + "</p>");
      }

    var geoLayer = L.geoJSON(data.features, {
        pointToLayer: pointToLayer,
        onEachFeature: onEachFeature
    });

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "light-v10",
        accessToken: API_KEY
    });

    var myMap = L.map("map", {
        center: [37.0902, -95.7129],
        zoom: 3,
        layers: [lightmap, geoLayer]
    });


    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = limitsArray;
    var colors = colorsArray;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Earthquake Depth</h1>" +
        "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
    };

    // Adding legend to the map
    legend.addTo(myMap);

});


