const fs = require('fs');

let app = fs.readFileSync('app.js', 'utf8');

// 1. Patch fetchData
const fetchSearch = `allData = rows.map((row, index) => {
            const normalized = headers.map((_, cellIndex) => String(row[cellIndex] ?? ""));
            normalized._sheetRow = index + 2;
            return normalized;
        });`;
const fetchReplace = `allData = rows.map((row, index) => {
            const normalized = headers.map((_, cellIndex) => String(row[cellIndex] ?? ""));
            normalized._sheetRow = index + 2;
            return normalized;
        });
        
        // Phân quyền: User chỉ xem được dữ liệu của mình trong bảng VI_TRI và ANH_CHUP
        if (currentUser && currentUser.quyen !== 'admin' && (currentModule === 'VI_TRI' || currentModule === 'ANH_CHUP')) {
            const idNvIdx = headers.indexOf('id_nv');
            if (idNvIdx !== -1) {
                allData = allData.filter(row => String(row[idNvIdx] || "").trim() === String(currentUser.id || "").trim());
            }
        }`;

if (app.includes(fetchSearch)) {
    app = app.replace(fetchSearch, fetchReplace);
}

// 2. Patch loadOthersLocations
const othersSearch = `async function loadOthersLocations() {
    if (!mapInstance) return;
    if (otherUserMarkers && otherUserMarkers.length > 0) {`;
const othersReplace = `async function loadOthersLocations() {
    if (!mapInstance) return;
    
    // Phân quyền: Chỉ admin mới được xem vị trí mọi người
    if (currentUser && currentUser.quyen !== 'admin') {
        alert("Bạn chỉ có quyền xem vị trí của mình.");
        return;
    }
    
    if (otherUserMarkers && otherUserMarkers.length > 0) {`;

if (app.includes(othersSearch)) {
    app = app.replace(othersSearch, othersReplace);
}

// 3. Patch viewPhotos
const photosSearch = `            if (coordsStr && imgUrl) {
                const coords = coordsStr.split(',');`;
const photosReplace = `            if (coordsStr && imgUrl) {
                // Phân quyền: User chỉ xem được ảnh của mình trên bản đồ
                if (currentUser && currentUser.quyen !== 'admin') {
                    if (String(id_nv).trim() !== String(currentUser.id || "").trim()) {
                        continue;
                    }
                }
                
                const coords = coordsStr.split(',');`;

if (app.includes(photosSearch)) {
    app = app.replace(photosSearch, photosReplace);
}

fs.writeFileSync('app.js', app);
fs.writeFileSync('www/app.js', app);
console.log('Patch roles successful');
