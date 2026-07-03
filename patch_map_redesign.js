const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const oldMapControls = `<div id="mapControlsPanel" class="map-controls-panel">
                    <div class="map-control-group primary-group">
                        <button id="toggleTrackingBtn" type="button" class="primary-btn tracking-btn" onclick="toggleTracking()"><i data-lucide="navigation"></i> Bắt đầu Định vị</button>
                        <button type="button" class="primary-btn camera-btn" onclick="triggerCamera()"><i data-lucide="camera"></i> Chụp ảnh</button>
                    </div>
                    
                    <div class="map-control-group">
                        <input type="text" id="searchAddress" placeholder="Nhập địa chỉ..." onkeypress="if(event.key==='Enter') searchMapAddress()">
                        <button type="button" class="secondary-btn" onclick="searchMapAddress()"><i data-lucide="search"></i></button>
                    </div>

                    <div class="map-control-group">
                        <input type="date" id="historyDate" onchange="loadHistory()">
                        <button type="button" class="secondary-btn" onclick="loadHistory()">Xem lịch sử</button>
                    </div>

                    <div class="map-control-group">
                        <button type="button" class="secondary-btn" onclick="loadOthersLocations()"><i data-lucide="users"></i> Vị trí mọi người</button>
                        <button type="button" class="secondary-btn" onclick="viewPhotos()"><i data-lucide="image"></i> Xem ảnh</button>
                    </div>

                    <input type="file" id="cameraInput" accept="image/*" capture="environment" style="display: none;" onchange="handleCameraUpload(event)">
                </div>`;

const newMapControls = `<div id="mapTopBar" class="map-top-bar">
                    <div class="map-control-group">
                        <input type="text" id="searchAddress" placeholder="Nhập địa chỉ..." onkeypress="if(event.key==='Enter') searchMapAddress()">
                        <button type="button" class="icon-btn-small" onclick="searchMapAddress()"><i data-lucide="search"></i></button>
                    </div>
                    <div class="map-control-group">
                        <input type="date" id="historyDate" onchange="loadHistory()">
                    </div>
                </div>

                <div id="mapRightSidebar" class="map-right-sidebar">
                    <button type="button" class="icon-btn-toggle" onclick="toggleMapSidebar()" id="toggleMapSidebarBtn"><i data-lucide="chevron-right"></i></button>
                    <div class="map-sidebar-content" id="mapSidebarContent">
                        <button id="toggleTrackingBtn" type="button" class="map-icon-btn tracking-btn" onclick="toggleTracking()" title="Bắt đầu Định vị"><i data-lucide="navigation"></i></button>
                        <button type="button" class="map-icon-btn camera-btn" onclick="triggerCamera()" title="Chụp ảnh"><i data-lucide="camera"></i></button>
                        <button type="button" class="map-icon-btn" onclick="loadHistory()" title="Xem lịch sử"><i data-lucide="clock"></i></button>
                        <button type="button" class="map-icon-btn" onclick="loadOthersLocations()" title="Vị trí mọi người"><i data-lucide="users"></i></button>
                        <button type="button" class="map-icon-btn" onclick="viewPhotos()" title="Xem ảnh"><i data-lucide="image"></i></button>
                    </div>
                    <input type="file" id="cameraInput" accept="image/*" capture="environment" style="display: none;" onchange="handleCameraUpload(event)">
                    <input type="file" id="mapMarkerPhotoInput" accept="image/*" style="display: none;" onchange="handleMapMarkerPhotoUpload(event)">
                </div>`;

html = html.replace(oldMapControls, newMapControls);
html = html.replace(/app\.js\?v=\d+/, 'app.js?v=19');
fs.writeFileSync('index.html', html);
fs.writeFileSync('www/index.html', html);

let css = fs.readFileSync('styles.css', 'utf8');

// Replace old map-controls-panel CSS
const cssToRemove = `/* Map Controls Panel */
.map-controls-panel {
    position: absolute;
    top: 10px;
    left: 60px;
    z-index: 1000;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    max-width: calc(100% - 70px);
}

.map-control-group {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    padding: 4px;
    gap: 4px;
}

.map-control-group input {
    border: none;
    outline: none;
    padding: 8px 10px;
    background: transparent;
    font-size: 0.9rem;
    min-width: 140px;
}

.map-control-group input[type="date"] {
    min-width: 120px;
}

.map-control-group button {
    padding: 8px 12px;
    white-space: nowrap;
}

.camera-btn {
    background-color: #10b981 !important;
}

@media (max-width: 900px) {
    .map-controls-panel {
        top: auto;
        bottom: 20px;
        left: 10px;
        right: 10px;
        max-width: none;
        flex-wrap: nowrap;
        overflow-x: auto;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 5px; /* for shadow */
    }
    
    .map-controls-panel::-webkit-scrollbar {
        display: none;
    }
    
    .map-control-group {
        flex: 0 0 auto;
    }
}`;

css = css.replace(cssToRemove, '');

const newCss = `
/* Map Controls Redesign */
.map-top-bar {
    position: absolute;
    top: 10px;
    left: 60px;
    right: 60px;
    z-index: 1000;
    display: flex;
    gap: 8px;
    pointer-events: none;
    flex-wrap: wrap;
}
.map-control-group {
    pointer-events: auto;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    padding: 4px;
    display: flex;
    align-items: center;
}
.map-top-bar input[type="text"], .map-top-bar input[type="date"] {
    border: none;
    outline: none;
    padding: 8px 10px;
    background: transparent;
    font-size: 0.9rem;
}
.icon-btn-small {
    background: transparent;
    border: none;
    color: var(--text);
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.map-right-sidebar {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
}
.map-sidebar-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: transform 0.3s ease, opacity 0.3s ease;
    transform-origin: top right;
}
.map-right-sidebar.collapsed .map-sidebar-content {
    transform: scale(0);
    opacity: 0;
    pointer-events: none;
}
.icon-btn-toggle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #fff;
    border: none;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    color: var(--text);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.3s ease;
}
.map-right-sidebar.collapsed .icon-btn-toggle {
    transform: rotate(180deg);
}
.map-icon-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #fff;
    border: none;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    color: var(--text);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.map-icon-btn.tracking-btn {
    color: var(--primary);
}
.map-icon-btn.tracking-btn.danger-btn {
    color: #ef4444;
}
.map-icon-btn.camera-btn {
    color: #10b981;
}

@media (max-width: 900px) {
    .map-top-bar {
        left: 10px;
        right: 60px;
        flex-direction: column;
    }
}
`;

css += "\n" + newCss;
fs.writeFileSync('styles.css', css);
fs.writeFileSync('www/styles.css', css);

console.log('Layout patched');
