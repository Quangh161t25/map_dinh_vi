const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

if (!html.includes('id="danhBaContainer"')) {
    html = html.replace('<div id="homeContainer" class="home-container" style="display: none; padding: 20px;"></div>', '<div id="homeContainer" class="home-container" style="display: none; padding: 20px;"></div>\n            <div id="danhBaContainer" class="danh-ba-container" style="display: none; padding: 20px;"></div>');
    fs.writeFileSync('index.html', html);
    console.log('Added danhBaContainer');
} else {
    console.log('danhBaContainer already exists');
}
