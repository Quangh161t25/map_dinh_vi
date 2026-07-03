const fs = require('fs');

let app = fs.readFileSync('app.js', 'utf8');

// 1. Fix the contextmenu on mapInstance
const targetInit = "mapInstance = L.map('map').setView([21.028511, 105.804817], 13);";
const replacementInit = `mapInstance = L.map('map').setView([21.028511, 105.804817], 13);
        
        let customMarker = null;
        let customMarkerLocation = null;
        
        mapInstance.on('contextmenu', function(e) {
            if (customMarker) {
                mapInstance.removeLayer(customMarker);
            }
            customMarkerLocation = e.latlng;
            
            const popupContent = \`
                <div style="text-align: center; font-family: 'Inter', sans-serif;">
                    <p style="margin: 0 0 10px 0; font-weight: bold; font-size: 14px;">Đã đánh dấu vị trí</p>
                    <button onclick="triggerMapMarkerPhotoUpload()" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 4px; margin: 0 auto;"><i data-lucide="camera" style="width:14px;height:14px;margin-bottom:-3px;"></i> Tải / Chụp ảnh</button>
                </div>
            \`;
            
            customMarker = L.marker(e.latlng).addTo(mapInstance)
                .bindPopup(popupContent)
                .openPopup();
            
            if (window.lucide) lucide.createIcons();
        });
        
        window.customMarkerRef = () => customMarker;
        window.customMarkerLoc = () => customMarkerLocation;`;

if (app.includes(targetInit) && !app.includes("mapInstance.on('contextmenu'")) {
    app = app.replace(targetInit, replacementInit);
}

// 2. Auto-refresh real-time tracking
if (!app.includes('setInterval(refreshOthersLocations')) {
    app += `
async function refreshOthersLocations() {
    // Only refresh if the user is currently viewing other people's locations
    if (!mapInstance || !otherUserMarkers || otherUserMarkers.length === 0) return;
    
    try {
        const rangeStr = \`\${quoteSheetName("VI_TRI")}!A2:E\`;
        const data = await sheetsFetch(\`/values/\${encodeURIComponent(rangeStr)}\`);
        const rows = data.values || [];
        const myId = currentUser?.id || currentUser?.ho_ten || "Unknown";
        
        const latestLocations = {};
        for (const r of rows) {
            const id_nv = r[1];
            const datetimeStr = r[3];
            const coordsStr = r[4];
            
            if (id_nv && id_nv !== myId && coordsStr) {
                const coords = coordsStr.split(',');
                if (coords.length === 2) {
                    latestLocations[id_nv] = {
                        lat: parseFloat(coords[0]),
                        lng: parseFloat(coords[1]),
                        time: datetimeStr
                    };
                }
            }
        }
        
        // Clear old markers
        for (const marker of otherUserMarkers) {
            mapInstance.removeLayer(marker);
        }
        otherUserMarkers = [];
        
        // Add new markers
        const keys = Object.keys(latestLocations);
        for (const id_nv of keys) {
            const loc = latestLocations[id_nv];
            const iconHtml = \`<div style="background:#ef4444;color:#fff;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-weight:bold;border:2px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,0.3);font-size:12px;overflow:hidden;">\${id_nv.substring(0,2).toUpperCase()}</div>\`;
            
            const customIcon = L.divIcon({
                html: iconHtml,
                className: 'custom-leaflet-icon',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(mapInstance);
            marker.bindPopup(\`<b>\${id_nv}</b><br>Cập nhật: \${loc.time}\`);
            otherUserMarkers.push(marker);
        }
    } catch (e) {
        console.error("Auto-refresh location failed", e);
    }
}

// Run every 30 seconds
setInterval(refreshOthersLocations, 30000);
`;
}

fs.writeFileSync('app.js', app);
fs.writeFileSync('www/app.js', app);

// Bust cache
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/app\.js\?v=\d+/, 'app.js?v=20');
fs.writeFileSync('index.html', html);
fs.writeFileSync('www/index.html', html);

let sw = fs.readFileSync('sw.js', 'utf8');
sw = sw.replace(/kieu-duc-app-v\d+/, 'kieu-duc-app-v48');
fs.writeFileSync('sw.js', sw);
fs.writeFileSync('www/sw.js', sw);

console.log('Missing features patched');
