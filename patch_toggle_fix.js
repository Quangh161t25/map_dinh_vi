const fs = require('fs');

let app = fs.readFileSync('app.js', 'utf8');

// Use regex to replace the function starts reliably
const viewPhotosRegex = /async function viewPhotos\(\)\s*\{\s*if \(!mapInstance\) return;/;
const othersRegex = /async function loadOthersLocations\(\)\s*\{\s*if \(!mapInstance\) return;/;

const viewPhotosToggle = `async function viewPhotos() {
    if (!mapInstance) return;
    if (photoMarkers && photoMarkers.length > 0) {
        for (const marker of photoMarkers) {
            mapInstance.removeLayer(marker);
        }
        photoMarkers = [];
        return;
    }`;

const othersToggle = `async function loadOthersLocations() {
    if (!mapInstance) return;
    if (otherUserMarkers && otherUserMarkers.length > 0) {
        for (const marker of otherUserMarkers) {
            mapInstance.removeLayer(marker);
        }
        otherUserMarkers = [];
        return;
    }`;

app = app.replace(viewPhotosRegex, viewPhotosToggle);
app = app.replace(othersRegex, othersToggle);

fs.writeFileSync('app.js', app);
fs.writeFileSync('www/app.js', app);

console.log('Toggle logic fixed');
