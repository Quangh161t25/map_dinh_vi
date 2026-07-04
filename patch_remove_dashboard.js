const fs = require('fs');

let app = fs.readFileSync('app.js', 'utf8');

// Find the start of renderBaoCao
const searchRegex = /function renderBaoCao\(\) \{([\s\S]*?)(?=function changeReportSkuPage)/;

if (searchRegex.test(app)) {
    const emptyFunction = `function renderBaoCao() {
    document.getElementById("reportView")?.remove();
}

`;
    app = app.replace(searchRegex, emptyFunction);
    
    fs.writeFileSync('app.js', app);
    fs.writeFileSync('www/app.js', app);
    console.log("Successfully removed dashboard rendering logic.");
} else {
    console.log("Could not find renderBaoCao with the specified regex.");
}
