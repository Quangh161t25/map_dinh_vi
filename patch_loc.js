const fs = require('fs');
let app = fs.readFileSync('app.js','utf8');

const loadOthersRegex = /async function loadOthersLocations\(\) \{[\s\S]*?otherUserMarkers\.push\(marker\);\s*\}/;

const newLoadOthers = `async function loadOthersLocations() {
    if (!mapInstance) return;
    
    const btn = document.getElementById('btnLoadOthers');
    if (otherUserMarkers && otherUserMarkers.length > 0) {
        for (const marker of otherUserMarkers) {
            mapInstance.removeLayer(marker);
        }
        otherUserMarkers = [];
        if (btn) btn.classList.remove('active-icon');
        return;
    }
    showLoading(currentUser && currentUser.quyen === 'admin' ? "Đang tải vị trí mọi người..." : "Đang tải vị trí bạn bè...");
    try {
        let friendIds = [];
        if (currentUser && currentUser.quyen !== 'admin') {
            const banbeRows = await loadModuleRows("BAN_BE");
            const myFriends = banbeRows.filter(r => r[3] === "accepted" && (r[1] === currentUser.id || r[2] === currentUser.id));
            friendIds = myFriends.map(r => r[1] === currentUser.id ? r[2] : r[1]);
        }
    
        const rangeStr = \`\${quoteSheetName("VI_TRI")}!A2:E\`;
        const data = await sheetsFetch(\`/values/\${encodeURIComponent(rangeStr)}\`);
        const rows = data.values || [];
        const myId = currentUser?.id || currentUser?.ho_ten || "Unknown";
        
        // Group by id_nv to get latest location for each user
        const latestLocations = {};
        
        for (const r of rows) {
            // [id, id_nv, ngay, ngay_h, map]
            const id_nv = r[1];
            const datetimeStr = r[3];
            const coordsStr = r[4];
            
            // Lọc: Admin xem hết. User thường chỉ xem những ai trong friendIds
            let canView = false;
            if (currentUser && currentUser.quyen === 'admin') {
                canView = true;
            } else {
                canView = friendIds.includes(id_nv);
            }
            
            if (id_nv && id_nv !== myId && coordsStr && canView) {
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
            const marker = L.marker([loc.lat, loc.lng]).addTo(mapInstance)
                .bindTooltip(\`<b>\${id_nv}</b><br>Cập nhật: \${loc.time}\`, { permanent: true, direction: "top", opacity: 0.8 });
            otherUserMarkers.push(marker);
        }`;

app = app.replace(loadOthersRegex, newLoadOthers);

// Patch renderMapModule
const renderMapRegex = /\/\/ Hide 'Vị trí mọi người' button if not admin[\s\S]*?if \(!mapInstance\)/;
const newRenderMap = `// Show 'Vị trí mọi người' button for all (admins see all, users see friends)
    const btnOthers = document.getElementById('btnLoadOthers');
    if (btnOthers) {
        btnOthers.style.display = 'flex';
        // Đổi title của nút nếu không phải admin
        if (currentUser && currentUser.quyen !== 'admin') {
            btnOthers.title = "Vị trí bạn bè";
        }
    }
    
    if (!mapInstance)`;

app = app.replace(renderMapRegex, newRenderMap);

fs.writeFileSync('app.js', app);
console.log('Patched location friends logic!');
