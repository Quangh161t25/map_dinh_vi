const fs = require('fs');

let app = fs.readFileSync('app.js', 'utf8');

// 1. Hide btnLoadOthers in renderMapModule
const renderMapSearch = `document.getElementById("mapContainer").style.display = "block";`;
const renderMapReplace = `document.getElementById("mapContainer").style.display = "block";
    
    // Hide 'Vị trí mọi người' button if not admin
    const btnOthers = document.getElementById('btnLoadOthers');
    if (btnOthers) {
        if (currentUser && currentUser.quyen !== 'admin') {
            btnOthers.style.display = 'none';
        } else {
            btnOthers.style.display = 'flex';
        }
    }`;

if (app.includes(renderMapSearch)) {
    app = app.replace(renderMapSearch, renderMapReplace);
}

// 2. Remove alert from loadOthersLocations and add class toggling
const othersSearch = `async function loadOthersLocations() {
    if (!mapInstance) return;
    
    // Phân quyền: Chỉ admin mới được xem vị trí mọi người
    if (currentUser && currentUser.quyen !== 'admin') {
        alert("Bạn chỉ có quyền xem vị trí của mình.");
        return;
    }
    
    if (otherUserMarkers && otherUserMarkers.length > 0) {
        for (const marker of otherUserMarkers) {
            mapInstance.removeLayer(marker);
        }
        otherUserMarkers = [];
        return;
    }`;
const othersReplace = `async function loadOthersLocations() {
    if (!mapInstance) return;
    
    // Phân quyền: Chỉ admin mới được xem vị trí mọi người
    if (currentUser && currentUser.quyen !== 'admin') {
        // Just return silently, the button is hidden anyway
        return;
    }
    
    const btn = document.getElementById('btnLoadOthers');
    if (otherUserMarkers && otherUserMarkers.length > 0) {
        for (const marker of otherUserMarkers) {
            mapInstance.removeLayer(marker);
        }
        otherUserMarkers = [];
        if (btn) btn.classList.remove('active-icon');
        return;
    }`;

if (app.includes(othersSearch)) {
    app = app.replace(othersSearch, othersReplace);
}

// Ensure the button gets colored when locations are loaded
const othersEndSearch = `        for (const id_nv of keys) {
            const loc = latestLocations[id_nv];
            const marker = L.marker([loc.lat, loc.lng]).addTo(mapInstance)
                .bindTooltip(\`<b>\${id_nv}</b><br>Cập nhật: \${loc.time}\`, { permanent: true, direction: "top", opacity: 0.8 });
            otherUserMarkers.push(marker);
        }
        
        hideLoading();`;
const othersEndReplace = `        for (const id_nv of keys) {
            const loc = latestLocations[id_nv];
            const marker = L.marker([loc.lat, loc.lng]).addTo(mapInstance)
                .bindTooltip(\`<b>\${id_nv}</b><br>Cập nhật: \${loc.time}\`, { permanent: true, direction: "top", opacity: 0.8 });
            otherUserMarkers.push(marker);
        }
        
        hideLoading();
        if (btn) btn.classList.add('active-icon');`;

if (app.includes(othersEndSearch)) {
    app = app.replace(othersEndSearch, othersEndReplace);
}

// 3. Class toggling for loadHistory
const historySearchOff = `        if (historyPolyline && window._lastHistoryDate === formattedDate) {
            mapInstance.removeLayer(historyPolyline);
            historyPolyline = null;
            window._lastHistoryDate = null;
            hideLoading();
            return; // Đã xoá lịch sử (Toggle off)
        }`;
const historyReplaceOff = `        const btn = document.getElementById('btnLoadHistory');
        if (historyPolyline && window._lastHistoryDate === formattedDate) {
            mapInstance.removeLayer(historyPolyline);
            historyPolyline = null;
            window._lastHistoryDate = null;
            hideLoading();
            if (btn) btn.classList.remove('active-icon');
            return; // Đã xoá lịch sử (Toggle off)
        }`;

if (app.includes(historySearchOff)) {
    app = app.replace(historySearchOff, historyReplaceOff);
}

const historySearchOn = `        if (historyPoints.length > 0) {
            historyPolyline = L.polyline(historyPoints, {color: 'red', weight: 4}).addTo(mapInstance);
            mapInstance.fitBounds(historyPolyline.getBounds());
            window._lastHistoryDate = formattedDate;`;
const historyReplaceOn = `        if (historyPoints.length > 0) {
            historyPolyline = L.polyline(historyPoints, {color: 'red', weight: 4}).addTo(mapInstance);
            mapInstance.fitBounds(historyPolyline.getBounds());
            window._lastHistoryDate = formattedDate;
            if (btn) btn.classList.add('active-icon');`;

if (app.includes(historySearchOn)) {
    app = app.replace(historySearchOn, historyReplaceOn);
}

// 4. Class toggling for viewPhotos
const photosSearchOff = `async function viewPhotos() {
    if (!mapInstance) return;
    if (photoMarkers && photoMarkers.length > 0) {
        for (const marker of photoMarkers) {
            mapInstance.removeLayer(marker);
        }
        photoMarkers = [];
        return;
    }`;
const photosReplaceOff = `async function viewPhotos() {
    if (!mapInstance) return;
    const btn = document.getElementById('btnViewPhotos');
    if (photoMarkers && photoMarkers.length > 0) {
        for (const marker of photoMarkers) {
            mapInstance.removeLayer(marker);
        }
        photoMarkers = [];
        if (btn) btn.classList.remove('active-icon');
        return;
    }`;

if (app.includes(photosSearchOff)) {
    app = app.replace(photosSearchOff, photosReplaceOff);
}

const photosSearchOn = `            mapInstance.fitBounds(bounds);
        }
    } catch (err) {`;
const photosReplaceOn = `            mapInstance.fitBounds(bounds);
        }
        if (btn) btn.classList.add('active-icon');
    } catch (err) {`;

if (app.includes(photosSearchOn)) {
    app = app.replace(photosSearchOn, photosReplaceOn);
}

fs.writeFileSync('app.js', app);
fs.writeFileSync('www/app.js', app);
console.log("Patched buttons toggling");
