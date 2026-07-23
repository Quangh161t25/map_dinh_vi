const fs = require('fs');
let app = fs.readFileSync('app.js','utf8');

const galleryFunc = `
async function renderGalleryModule() {
    let gallery = document.getElementById("galleryContainer");
    if (!gallery) {
        gallery = document.createElement("div");
        gallery.id = "galleryContainer";
        gallery.className = "gallery-container";
        gallery.style.cssText = "padding: 20px; display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; overflow-y: auto; max-height: calc(100vh - 80px);";
        document.querySelector(".main-content").appendChild(gallery);
    }
    gallery.style.display = "grid";
    gallery.innerHTML = '<div style="text-align:center; grid-column: 1/-1;">Đang tải ảnh...</div>';
    
    try {
        const range = \`\${quoteSheetName("ANH_CHUP")}!A2:F\`;
        const data = await sheetsFetch(\`/values/\${encodeURIComponent(range)}\`);
        const rows = data.values || [];
        
        gallery.innerHTML = "";
        
        if (rows.length === 0) {
            gallery.innerHTML = '<div style="text-align:center; grid-column: 1/-1; color: var(--muted);">Chưa có ảnh nào.</div>';
            return;
        }
        
        let hasPhoto = false;
        // Reverse to show newest first
        [...rows].reverse().forEach(r => {
            const id_nv = r[1] || "Unknown";
            const time = r[3] || "";
            const coordsStr = r[4];
            const imgUrl = r[5];
            
            if (currentUser && currentUser.quyen !== 'admin' && String(id_nv).trim() !== String(currentUser.id || "").trim()) {
                return;
            }
            
            if (imgUrl) {
                hasPhoto = true;
                const card = document.createElement("div");
                card.style.cssText = "background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); display: flex; flex-direction: column;";
                card.innerHTML = \`
                    <img src="\${escapeHtml(imgUrl)}" style="width: 100%; height: 200px; object-fit: cover; cursor: pointer;" onclick="window.open('\${escapeHtml(imgUrl)}', '_blank')">
                    <div style="padding: 12px;">
                        <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">\${escapeHtml(id_nv)}</div>
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 4px;"><i data-lucide="clock" style="width:12px; height:12px; vertical-align: middle;"></i> \${escapeHtml(time)}</div>
                        <div style="font-size: 12px; color: var(--primary);"><i data-lucide="map-pin" style="width:12px; height:12px; vertical-align: middle;"></i> \${escapeHtml(coordsStr || 'Không rõ vị trí')}</div>
                    </div>
                \`;
                gallery.appendChild(card);
            }
        });
        
        if (!hasPhoto) {
            gallery.innerHTML = '<div style="text-align:center; grid-column: 1/-1; color: var(--muted);">Bạn chưa có ảnh nào.</div>';
        }
        
        if(window.lucide) lucide.createIcons();
    } catch(e) {
        gallery.innerHTML = \`<div style="text-align:center; grid-column: 1/-1; color: red;">Lỗi tải ảnh: \${e.message}</div>\`;
    }
}
`;

const fetchDataRegex = /async function fetchData[\s\S]*?if \(currentModule === "TRANG_CHU"\) \{/;

const newFetchDataPrefix = `async function fetchData(seq = moduleLoadSeq) {
    if (document.getElementById("mapContainer")) document.getElementById("mapContainer").style.display = "none";
    if (document.getElementById("homeContainer")) document.getElementById("homeContainer").style.display = "none";
    if (document.getElementById("galleryContainer")) document.getElementById("galleryContainer").style.display = "none";
    if (document.getElementById("tableWrapper")) document.getElementById("tableWrapper").style.display = "block";
    if (document.getElementById("headerActions")) document.getElementById("headerActions").style.display = "flex";
    if (document.getElementById("filterPanel")) document.getElementById("filterPanel").style.display = "flex";

    if (currentModule === "ANH_CHUP") {
        if (document.getElementById("tableWrapper")) document.getElementById("tableWrapper").style.display = "none";
        if (document.getElementById("headerActions")) document.getElementById("headerActions").style.display = "none";
        if (document.getElementById("filterPanel")) document.getElementById("filterPanel").style.display = "none";
        renderGalleryModule();
        hideLoading();
        return;
    }

    if (currentModule === "TRANG_CHU") {`;

if (app.match(fetchDataRegex)) {
    app = app.replace(fetchDataRegex, newFetchDataPrefix);
    app += '\n' + galleryFunc;
    fs.writeFileSync('app.js', app);
    console.log('Successfully added gallery module!');
} else {
    console.log('Regex match failed!');
}
