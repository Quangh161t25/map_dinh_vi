const fs = require('fs');

// --- 1. Patch index.html ---
let html = fs.readFileSync('index.html', 'utf8');
const pwaScript = `    <script type="module">
        import { defineCustomElements } from 'https://unpkg.com/@ionic/pwa-elements@latest/dist/esm/loader.js';
        defineCustomElements(window);
    </script>
</head>`;

if (!html.includes('ionic/pwa-elements')) {
    html = html.replace('</head>', pwaScript);
    fs.writeFileSync('index.html', html);
    console.log("Patched index.html");
}

// --- 2. Patch app.js ---
let app = fs.readFileSync('app.js', 'utf8');

// A function to handle the actual upload logic
const processFileFunc = `
function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

async function processCameraFile(file, isMarkerPhoto = false) {
    if (!file) return;
    
    let captureLocation;
    if (isMarkerPhoto) {
        captureLocation = window.customMarkerLoc ? window.customMarkerLoc() : null;
        if (!captureLocation) {
            alert("Không tìm thấy vị trí đánh dấu!");
            return;
        }
    } else {
        captureLocation = { ...lastLocation };
    }
    
    showLoading("Đang tải ảnh lên máy chủ...");
    try {
        const formData = new FormData();
        formData.append("image", file);
        
        // Upload to ImgBB
        const imgbbResponse = await fetch("https://api.imgbb.com/1/upload?key=1bad1429a242d7040fda3f2cfddb3a25", {
            method: "POST",
            body: formData
        });
        
        const imgbbData = await imgbbResponse.json();
        if (!imgbbData.success) {
            throw new Error("Lỗi từ ImgBB: " + (imgbbData.error ? imgbbData.error.message : "Unknown error"));
        }
        
        const imageUrl = imgbbData.data.url;
        showLoading("Đang lưu dữ liệu...");
        
        const now = new Date();
        const id = 'IMG' + now.getTime();
        const id_nv = currentUser.id || currentUser.ho_ten || "Unknown";
        
        if (isMarkerPhoto) {
            const row = {
                "ID": id,
                "Thời gian": now.toLocaleString("vi-VN"),
                "Vị trí": captureLocation.lat + ", " + captureLocation.lng,
                "Ảnh": imageUrl,
                "Người gửi": id_nv,
                "Ghi chú": "Ảnh đánh dấu thủ công"
            };
            await fetch(CONFIG.apiUrl, {
                method: "POST",
                body: JSON.stringify({ action: "append", sheetName: "ANH_CHUP", data: row })
            });
            hideLoading();
            const m = window.customMarkerRef ? window.customMarkerRef() : null;
            if (m) m.closePopup();
        } else {
            const ngay = formatDateToDDMMYYYY(now);
            const ngay_h = formatDateTimeToDDMMYYYYHHMMSS(now);
            const mapStr = captureLocation.lat + "," + captureLocation.lng;
            
            const row = [id, id_nv, ngay, ngay_h, mapStr, imageUrl];
            const range = \`\${quoteSheetName("ANH_CHUP")}!A2\`;
            await sheetsFetch(\`/values/\${encodeURIComponent(range)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS\`, {
                method: "POST",
                body: JSON.stringify({ values: [row] })
            });
            hideLoading();
            if (photoMarkers.length > 0) {
                viewPhotos();
            }
        }
    } catch (err) {
        hideLoading();
        console.error("Lỗi tải ảnh:", err);
        alert("Không thể tải ảnh: " + err.message);
    }
}
`;

// Replace handleCameraUpload
const cameraUploadSearch = `async function handleCameraUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Save current location right when photo is taken
    const captureLocation = { ...lastLocation };
    
    showLoading("Đang tải ảnh lên máy chủ...");
    try {
        const formData = new FormData();
        formData.append("image", file);
        
        // Upload to ImgBB
        const imgbbResponse = await fetch("https://api.imgbb.com/1/upload?key=1bad1429a242d7040fda3f2cfddb3a25", {
            method: "POST",
            body: formData
        });
        
        const imgbbData = await imgbbResponse.json();
        if (!imgbbData.success) {
            throw new Error("Lỗi từ ImgBB: " + (imgbbData.error ? imgbbData.error.message : "Unknown error"));
        }
        
        const imageUrl = imgbbData.data.url;
        
        // Save to Google Sheets 'ANH_CHUP'
        showLoading("Đang lưu dữ liệu...");
        const now = new Date();
        const id = 'IMG' + now.getTime();
        const id_nv = currentUser.id || currentUser.ho_ten || "Unknown";
        const ngay = formatDateToDDMMYYYY(now);
        const ngay_h = formatDateTimeToDDMMYYYYHHMMSS(now);
        const mapStr = captureLocation.lat + "," + captureLocation.lng;
        
        const row = [id, id_nv, ngay, ngay_h, mapStr, imageUrl];
        const range = \`\${quoteSheetName("ANH_CHUP")}!A2\`;
        await sheetsFetch(\`/values/\${encodeURIComponent(range)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS\`, {
            method: "POST",
            body: JSON.stringify({ values: [row] })
        });
        
        hideLoading();
        
        // Reload photos if they are currently visible
        if (photoMarkers.length > 0) {
            viewPhotos();
        }
        
    } catch (err) {
        hideLoading();
        console.error("Lỗi tải ảnh:", err);
        alert("Không thể tải ảnh: " + err.message);
    } finally {
        event.target.value = ''; // Reset input
    }
}`;

const cameraUploadReplace = processFileFunc + `
async function handleCameraUpload(event) {
    await processCameraFile(event.target.files[0], false);
    event.target.value = '';
}`;

if (app.includes(cameraUploadSearch)) {
    app = app.replace(cameraUploadSearch, cameraUploadReplace);
}

// Replace handleMapMarkerPhotoUpload
const mapMarkerUploadSearch = `async function handleMapMarkerPhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const loc = window.customMarkerLoc ? window.customMarkerLoc() : null;
    if (!loc) {
        alert("Không tìm thấy vị trí đánh dấu!");
        return;
    }
    
    showLoading("Đang tải ảnh lên máy chủ...");
    try {
        const formData = new FormData();
        formData.append("image", file);
        
        const imgbbResponse = await fetch("https://api.imgbb.com/1/upload?key=1bad1429a242d7040fda3f2cfddb3a25", {
            method: "POST",
            body: formData
        });
        
        const imgbbData = await imgbbResponse.json();
        if (!imgbbData.success) {
            throw new Error("Lỗi từ ImgBB: " + (imgbbData.error ? imgbbData.error.message : "Unknown error"));
        }
        
        const imageUrl = imgbbData.data.url;
        
        showLoading("Đang lưu dữ liệu...");
        const now = new Date();
        const id = 'IMG' + now.getTime();
        const id_nv = currentUser.id || currentUser.ho_ten || "Unknown";
        
        const row = {
            "ID": id,
            "Thời gian": now.toLocaleString("vi-VN"),
            "Vị trí": loc.lat + ", " + loc.lng,
            "Ảnh": imageUrl,
            "Người gửi": id_nv,
            "Ghi chú": "Ảnh đánh dấu thủ công"
        };
        
        await fetch(CONFIG.apiUrl, {
            method: "POST",
            body: JSON.stringify({
                action: "append",
                sheetName: "ANH_CHUP",
                data: row
            })
        });
        
        hideLoading();
        const m = window.customMarkerRef ? window.customMarkerRef() : null;
        if (m) m.closePopup();
        
    } catch (error) {
        console.error(error);
        hideLoading();
        alert("Lỗi xử lý ảnh: " + error.message);
    }
}`;
const mapMarkerUploadReplace = `async function handleMapMarkerPhotoUpload(event) {
    await processCameraFile(event.target.files[0], true);
    event.target.value = '';
}`;

if (app.includes(mapMarkerUploadSearch)) {
    app = app.replace(mapMarkerUploadSearch, mapMarkerUploadReplace);
}

// Replace triggerCamera
const triggerCameraSearch = `function triggerCamera() {
    if (!lastLocation) {
        alert("Chưa có thông tin vị trí! Vui lòng 'Bắt đầu Định vị' và chờ lấy vị trí trước khi chụp ảnh.");
        return;
    }
    document.getElementById('cameraInput').click();
}`;
const triggerCameraReplace = `async function triggerCamera() {
    if (!lastLocation) {
        alert("Chưa có thông tin vị trí! Vui lòng 'Bắt đầu Định vị' và chờ lấy vị trí trước khi chụp ảnh.");
        return;
    }
    
    if (window.Capacitor && window.Capacitor.Plugins.Camera) {
        try {
            const { Camera, CameraResultType, CameraSource } = window.Capacitor.Plugins;
            const image = await Camera.getPhoto({
                quality: 80,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Camera,
                presentationStyle: 'fullscreen'
            });
            const file = dataURLtoFile(image.dataUrl, "photo.jpg");
            await processCameraFile(file, false);
        } catch (e) {
            console.log("Hủy chụp ảnh", e);
        }
    } else {
        document.getElementById('cameraInput').click();
    }
}`;

if (app.includes(triggerCameraSearch)) {
    app = app.replace(triggerCameraSearch, triggerCameraReplace);
}

// Replace triggerMapMarkerPhotoUpload
const triggerMarkerSearch = `function triggerMapMarkerPhotoUpload() {
    document.getElementById('mapMarkerPhotoInput').click();
}`;
const triggerMarkerReplace = `async function triggerMapMarkerPhotoUpload() {
    if (window.Capacitor && window.Capacitor.Plugins.Camera) {
        try {
            const { Camera, CameraResultType, CameraSource } = window.Capacitor.Plugins;
            const image = await Camera.getPhoto({
                quality: 80,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Prompt,
                presentationStyle: 'fullscreen',
                promptLabelHeader: 'Tải / Chụp ảnh',
                promptLabelPhoto: 'Chọn từ thư viện',
                promptLabelPicture: 'Chụp ảnh mới'
            });
            const file = dataURLtoFile(image.dataUrl, "photo.jpg");
            await processCameraFile(file, true);
        } catch (e) {
            console.log("Hủy chụp ảnh", e);
        }
    } else {
        document.getElementById('mapMarkerPhotoInput').click();
    }
}`;

if (app.includes(triggerMarkerSearch)) {
    app = app.replace(triggerMarkerSearch, triggerMarkerReplace);
}

fs.writeFileSync('app.js', app);
fs.writeFileSync('www/app.js', app);
let h = fs.readFileSync('index.html', 'utf8');
fs.writeFileSync('www/index.html', h);
console.log("Patched camera successfully");
