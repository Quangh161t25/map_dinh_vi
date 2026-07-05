const fs = require('fs');
let app = fs.readFileSync('app.js','utf8');
app += `

// Lắng nghe sự kiện mở app từ Widget
if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
    window.Capacitor.Plugins.App.addListener('appUrlOpen', data => {
        if (data.url && data.url.includes('kieuducapp://camera')) {
            console.log('App opened from widget! Launching camera...');
            // Chờ UI load xong 1 chút rồi mở camera
            setTimeout(() => {
                if (typeof handleCameraUpload === 'function') {
                    handleCameraUpload();
                } else {
                    const btn = document.getElementById('cameraBtn');
                    if (btn) btn.click();
                }
            }, 500);
        }
    });
}
`;
fs.writeFileSync('app.js', app);
console.log('Appended to app.js');
