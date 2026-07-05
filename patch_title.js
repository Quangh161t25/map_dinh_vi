const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(/<title>kiều đức<\/title>/ig, '<title>Vị trí</title>');
indexHtml = indexHtml.replace(/content="kiều đức"/ig, 'content="Vị trí"');
fs.writeFileSync('index.html', indexHtml);

let manifest = fs.readFileSync('manifest.webmanifest', 'utf8');
manifest = manifest.replace(/"name":\s*"kiều đức"/ig, '"name": "Vị trí"');
manifest = manifest.replace(/"short_name":\s*"kiều đức"/ig, '"short_name": "Vị trí"');
manifest = manifest.replace(/"description":\s*"Ứng dụng quản lý kiều đức"/ig, '"description": "Ứng dụng quản lý Vị trí"');
fs.writeFileSync('manifest.webmanifest', manifest);

let appJs = fs.readFileSync('app.js', 'utf8');
appJs = appJs.replace(/Kiều Đức App/ig, 'Vị trí App');
fs.writeFileSync('app.js', appJs);

fs.copyFileSync('index.html', 'www/index.html');
fs.copyFileSync('manifest.webmanifest', 'www/manifest.webmanifest');
fs.copyFileSync('app.js', 'www/app.js');

console.log('Renamed to Vị trí');
