// Initialize the map centered on Mexico City
var map = L.map('map').setView([19.4326, -99.1332], 12);


// Add the OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);


// Query for retrieving historical monuments and parks located in Mexico City
var query = `[out:json];
              area["name"="Ciudad de México"]->.cdmx;
              (
                node(area.cdmx)["tourism"="attraction"]["historic"];
                node(area.cdmx)["leisure"="park"];
              );
              out;`;


// Function to fetch data from the Overpass API
fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
        data.elements.forEach(element => {
            var lat = element.lat;
            var lon = element.lon;
            var name = element.tags.name || "Point of Interest";
            var type = element.tags.historic ? "Historical Monument" : "Park";


            // Custom icon for historical monuments and parks
            var iconUrl = element.tags.historic 
                ? 'https://cdn-icons-png.flaticon.com/512/684/684908.png' // Icon for monuments
                : 'https://cdn-icons-png.flaticon.com/512/2331/2331481.png'; // Icon for parks


            var customIcon = L.icon({
                iconUrl: iconUrl,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
            });


            // Add a marker to the map with the type of point of interest
            L.marker([lat, lon], { icon: customIcon })
                .addTo(map)
                .bindPopup(`<b>${name}</b><br>${type}`);
        });

    })
    
    .catch(error => console.error('Error loading data:', error));
