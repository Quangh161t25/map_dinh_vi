const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

if (!app.includes('let autoStartedTracking = false;')) {
    const searchString = 'function renderMapModule() {\n    document.getElementById("tableWrapper").style.display = "none";';
    const replaceString = `let autoStartedTracking = false;

function renderMapModule() {
    if (!autoStartedTracking) {
        // Delay slightly to ensure map is fully rendered and UI is ready
        setTimeout(() => {
            if (!trackingWatchId) {
                toggleTracking();
            }
        }, 1000);
        autoStartedTracking = true;
    }
    document.getElementById("tableWrapper").style.display = "none";`;

    app = app.replace(searchString, replaceString);
    fs.writeFileSync('app.js', app);
    fs.writeFileSync('www/app.js', app);
    console.log('Patched renderMapModule');
}
