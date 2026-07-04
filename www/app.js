const CONFIG = {
    appName: "Vị trí",
    spreadsheetId: "1uFtqcwXB_5WBSoTF6kCnLrgtH52umRBx9engl7oFU8Y",
    serviceAccountEmail: "test-gia-ason@api-test-sheet-161.iam.gserviceaccount.com",
    privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC3NN84hLTkQPZd
Lj7niXZTICq7nHsuTn3J6r2Paq12m70/lYSmrwh1i0EStr9bO19QM8cevGlslwGr
WSVOLJlc6+w1HGPKvRXtA41kYV9MYIvpzIPQtkFE7Hxq71QyBARcv39Lfzze6Ioj
3G8VBvAKFLAnCUr97GHRv+KbCTFxPZupd3PEB+xS5ZUlzdBCEZvDid3iXaaEJJ+l
Td1apAGQHjtnDTLOkiTa8zf7X5ebALwnI9MziOdN8VyprHXGhkachPbKyrG0QwEs
2jtiI6Y5ULsBPjNefoavH8MKU5DEAT9h0fZ7KfsKYVMDuXqmEKBs0D3B4Z6aDZQW
wT2dDRZDAgMBAAECggEAEIuVoSzZVuFhaz1GI9ji0IacjvO50cIq7M8Zrj4/F756
Ew6PIhKENafAb7U4INm2AnzUMO8CqL9Jpxs85qUM3W4JysSByqLUiRW2184amIyb
j7jCXfLBTQn8AbHgrUepl5d/vBmFYMgon/mqjbNiGDb4FZgEQSkie5o6fi/dWp5d
NahbZl+WTOB/znhAfKh/zferHNxldR/ERmwOubZUerkqysWiBigc3ovpLSUof9ur
z3hNPPp0CKQjF40xuQc6FYTHUHMLuMvp78PXuc/mYqQmZ8VOGhU+faGtZ4m+QJly
dF5dS8U5cwKEF+ptuAUiWSahn6INb9yKn3+FcsW0UQKBgQDb8N4eWFvbgpRo/vxo
wBN2u2TWubj6clcrq/1a+VR0njC28Can0ogJHhrFhPxVs5D/rugs3HlbyAXJFptY
V0DZPCwBxGU5P5RbGjXWWEUXjp4ISKQD8WKfVlXNr79TqLdOg2NZBYQAi06Cpo/T
PV9l7LSG2Tj/9WdvD7W2wvrpaQKBgQDVPjpJN6xh7+sHtSU0mjKvrqigpHbuSQ/o
XpUaWSIpJffm5QpFPAOcTT5mHZCyllicJQIrfPSY+sH8n+sF03CUqVkV4Q2UqfOf
pFaLDB4P6SQ8iesZyF4VKFrj/cAvRJmp0e5W/DRnFkoEp+8c+nrru2+Dzm9kb7Uq
0CiltqYAywKBgBtcfrV1to+7Ue0x84KwintV2rifyDRX7yI+tjkQFYKgf1zyyUxN
c6D2vsvdvGqI+TvlrXqPPwW8/4NBrbeyux2LT8o0fYc+sp0WyKXOu2Gv21caelUH
PYam/eultn6Y2Z0J2V0kw4Qx0GWOhQv5cZnDdb3k3iNxixmU8b03ynEpAoGBAKEA
7O0fNe50QRZ+tOq0ihSPYQ55XrqnO3WNBDLynZJH8pbI1CpWF7vJrpVXOUs9rQWo
A61mGR/wJMtiywaJEHWOL48PbzuR3jno0NcHfSMyOoPi9jlvSWncIFQH4TVPLF5F
/Rh8L+ytrZE6YpWUoX6e9KGmGgDRPw5mQGpuL4RlAoGADe9n080SXlsUk4nHVjUz
Efv7EBoBkgOpqb9T1foRfJl46NxmmTOYV3iGIhjwcDskEg284k4iq/gH6EEFyEBc
Vz13jzB1nBgjfezFesVQz7bA/+Wik6HZtxAxVg38BKMt+Q1tYw9wOjbGPqOn++VC
sR2Sh8e3h3Knd6j1tceRIFU=
-----END PRIVATE KEY-----`,
    tokenUrl: "https://oauth2.googleapis.com/token",
    modules: {
        TRANG_CHU: {
            label: "Trang chủ",
            icon: "home",
            headers: [],
            reportOnly: true
        },
        VI_TRI: {
            label: "Định vị",
            icon: "map-pin",
            headers: ["id", "id_nv", "ngay", "ngay_h", "map"]
        },
        ANH_CHUP: {
            label: "Ảnh Chụp",
            icon: "camera",
            headers: ["id", "id_nv", "ngay", "ngay_h", "map", "anh"]
        },
        DSNV: {
            label: "DSNV",
            icon: "users",
            headers: ["id", "ho_ten", "hinh_anh", "gioi_tinh", "ngay_sinh", "quyen", "mk"],
            hidden: true
        }
    }
};

const MODULE_STORAGE_KEY = "kieuDucActiveModule";
const AUTH_STORAGE_KEY = "kieuDucCurrentUser";
const MODULE_ORDER = ["TRANG_CHU", "VI_TRI"];

let accessToken = null;
let tokenExpiry = 0;
let spreadsheetSheets = new Map();
let currentModule = "TRANG_CHU";
let allData = [];
let filteredData = [];
let currentPage = 1;
let rowsPerPage = 150;
let dsSpOptions = [];
let nppOptions = [];
let currentDonHangMdh = "";
let congViecView = "table";
let reportData = null;
let reportSkuPage = 1;
let currentUser = null;
let moduleLoadSeq = 0;
let selectedSheetRows = new Set();

function getModuleConfig(moduleName = currentModule) {
    return CONFIG.modules[moduleName] || CONFIG.modules.TRANG_CHU;
}

function getHeaders(moduleName = currentModule) {
    return getModuleConfig(moduleName).headers;
}

async function getAccessToken() {
    if (accessToken && Date.now() < tokenExpiry - 300000) return accessToken;
    const header = { alg: "RS256", typ: "JWT" };
    const now = Math.floor(Date.now() / 1000);
    const payload = {
        iss: CONFIG.serviceAccountEmail,
        scope: "https://www.googleapis.com/auth/spreadsheets",
        aud: CONFIG.tokenUrl,
        exp: now + 3600,
        iat: now
    };
    const jwt = KJUR.jws.JWS.sign("RS256", JSON.stringify(header), JSON.stringify(payload), CONFIG.privateKey);
    const res = await fetch(CONFIG.tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error_description || data.error || "Không lấy được quyền truy cập Google Sheets.");
    accessToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in * 1000);
    return accessToken;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function escapeJsString(value) {
    return String(value ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/\r/g, "\\r")
        .replace(/\n/g, "\\n");
}

function colName(index) {
    let name = "";
    let num = index + 1;
    while (num > 0) {
        const rem = (num - 1) % 26;
        name = String.fromCharCode(65 + rem) + name;
        num = Math.floor((num - 1) / 26);
    }
    return name;
}

function quoteSheetName(name) {
    return `'${String(name).replace(/'/g, "''")}'`;
}

function showLoading(_message = "Đang tải dữ liệu...") {
    document.body.classList.add("is-busy");
}

function hideLoading() {
    document.body.classList.remove("is-busy");
}

function parseMoney(value) {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    const raw = String(value ?? "").trim();
    if (!raw) return 0;
    const normalized = raw.replace(/\s/g, "").replace(/[^\d,.-]/g, "");
    if (!normalized) return 0;
    if (normalized.includes(",") && normalized.includes(".")) {
        return Number(normalized.lastIndexOf(",") > normalized.lastIndexOf(".")
            ? normalized.replace(/\./g, "").replace(",", ".")
            : normalized.replace(/,/g, "")) || 0;
    }
    if (/^-?\d{1,3}([.,]\d{3})+$/.test(normalized)) return Number(normalized.replace(/[.,]/g, "")) || 0;
    return Number(normalized.replace(",", ".")) || 0;
}

function formatDisplayNumber(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return "";
    return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(parseMoney(raw));
}

function clampCommissionPercent(value) {
    const number = parseMoney(value);
    if (!number) return "";
    return String(Math.min(Math.max(number, 0.001), 100));
}

function isNumericHeader(header) {
    return (getModuleConfig().numericHeaders || []).includes(header);
}

function normalizeRow(row) {
    return getHeaders().map((header, index) => {
        const value = String(row?.[index] ?? "").trim();
        return isNumericHeader(header) && value ? parseMoney(value) : value;
    });
}

function getRowId(row) {
    return String(row?.[0] || "").trim();
}

function generateNextId(extraIds = []) {
    const ids = [...allData.map(getRowId), ...extraIds].filter(Boolean);
    const numericIds = ids.map(id => Number(id)).filter(Number.isFinite);
    if (numericIds.length === ids.length && numericIds.length) return String(Math.max(...numericIds) + 1);
    const now = new Date();
    const stamp = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
        String(now.getHours()).padStart(2, "0"),
        String(now.getMinutes()).padStart(2, "0"),
        String(now.getSeconds()).padStart(2, "0")
    ].join("");
    let candidate = `${currentModule}-${stamp}`;
    let suffix = 1;
    while (ids.includes(candidate)) {
        suffix += 1;
        candidate = `${currentModule}-${stamp}-${suffix}`;
    }
    return candidate;
}

function randomCode(length = 10) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let value = "";
    for (let index = 0; index < length; index += 1) {
        value += chars[Math.floor(Math.random() * chars.length)];
    }
    return value;
}

function getHeaderIndex(header, moduleName = currentModule) {
    return getHeaders(moduleName).indexOf(header);
}

async function sheetsFetch(path, options = {}) {
    const token = await getAccessToken();
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.spreadsheetId}${path}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${token}`,
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            ...(options.headers || {})
        }
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error?.message || "Lỗi Google Sheets API.");
    return data;
}

async function loadSpreadsheetSheets() {
    const data = await sheetsFetch("?fields=sheets.properties");
    spreadsheetSheets = new Map((data.sheets || []).map(sheet => [
        sheet.properties.title,
        {
            sheetId: sheet.properties.sheetId,
            title: sheet.properties.title
        }
    ]));
}

async function batchUpdate(requests) {
    return sheetsFetch(":batchUpdate", {
        method: "POST",
        body: JSON.stringify({ requests })
    });
}

async function ensureModuleSheet(moduleName = currentModule) {
    if (!spreadsheetSheets.size) await loadSpreadsheetSheets();
    if (!spreadsheetSheets.has(moduleName)) {
        await batchUpdate([{ addSheet: { properties: { title: moduleName } } }]);
        await loadSpreadsheetSheets();
    }
    await ensureModuleHeaders(moduleName);
}

async function ensureModuleHeaders(moduleName = currentModule) {
    const expectedHeaders = getHeaders(moduleName);
    const range = `${quoteSheetName(moduleName)}!A1:${colName(expectedHeaders.length - 1)}1`;
    const data = await sheetsFetch(`/values/${encodeURIComponent(range)}`);
    const currentHeaders = data.values?.[0] || [];
    const needsHeader = expectedHeaders.some((header, index) => String(currentHeaders[index] || "").trim() !== header);
    if (!needsHeader) return;
    if (currentHeaders.some(header => String(header || "").trim())) {
        const currentEndCol = colName(Math.max(currentHeaders.length, expectedHeaders.length) - 1);
        const oldDataRange = `${quoteSheetName(moduleName)}!A2:${currentEndCol}`;
        const oldData = await sheetsFetch(`/values/${encodeURIComponent(oldDataRange)}`);
        const oldHeaders = currentHeaders.map(header => String(header || "").trim());
        const remappedRows = (oldData.values || []).map(row => expectedHeaders.map(header => {
            const oldIndex = oldHeaders.indexOf(header);
            return oldIndex >= 0 ? row[oldIndex] ?? "" : "";
        }));
        await sheetsFetch(`/values/${encodeURIComponent(`${quoteSheetName(moduleName)}!A1:${currentEndCol}`)}:clear`, {
            method: "POST",
            body: JSON.stringify({})
        });
        await sheetsFetch(`/values/${encodeURIComponent(`${quoteSheetName(moduleName)}!A1`)}?valueInputOption=RAW`, {
            method: "PUT",
            body: JSON.stringify({ values: [expectedHeaders, ...remappedRows] })
        });
        return;
    }
    await sheetsFetch(`/values/${encodeURIComponent(range)}?valueInputOption=RAW`, {
        method: "PUT",
        body: JSON.stringify({ values: [expectedHeaders] })
    });
}

async function loadDsSpOptions() {
    await ensureModuleSheet("DS_SP");
    const headers = getHeaders("DS_SP");
    const idIndex = headers.indexOf("id");
    const tenIndex = headers.indexOf("ten_sp");
    const giaIndex = headers.indexOf("gia_ban");
    const range = `${quoteSheetName("DS_SP")}!A2:${colName(headers.length - 1)}`;
    const data = await sheetsFetch(`/values/${encodeURIComponent(range)}`);
    dsSpOptions = (data.values || [])
        .map(row => ({
            id: String(row[idIndex] || "").trim(),
            ten: String(row[tenIndex] || "").trim(),
            gia: String(row[giaIndex] || "").trim()
        }))
        .filter(item => item.id);
    return dsSpOptions;
}

function getDsSpById(idSp) {
    const key = String(idSp || "").trim().toLowerCase();
    return dsSpOptions.find(item => item.id.toLowerCase() === key) || null;
}

async function loadNppOptions() {
    await ensureModuleSheet("NPP");
    const headers = getHeaders("NPP");
    const idIndex = headers.indexOf("id");
    const tenIndex = headers.indexOf("ten");
    const hoaHongIndex = headers.indexOf("hoa_hong");
    const range = `${quoteSheetName("NPP")}!A2:${colName(headers.length - 1)}`;
    const data = await sheetsFetch(`/values/${encodeURIComponent(range)}`);
    nppOptions = (data.values || [])
        .map(row => ({
            id: String(row[idIndex] || "").trim(),
            ten: String(row[tenIndex] || "").trim(),
            hoaHong: String(row[hoaHongIndex] || "").trim()
        }))
        .filter(item => item.id);
    return nppOptions;
}

function getNppById(id) {
    const key = String(id || "").trim().toLowerCase();
    return nppOptions.find(item => item.id.toLowerCase() === key) || null;
}

function getNppDisplayName(id) {
    const npp = getNppById(id);
    return npp?.ten || String(id || "");
}

function getNppCommissionRate(id) {
    const percent = parseMoney(getNppById(id)?.hoaHong || 0);
    return Math.min(Math.max(percent, 0), 100) / 100;
}

async function loadModuleRows(moduleName) {
    await ensureModuleSheet(moduleName);
    const headers = getHeaders(moduleName);
    if (!headers.length) return [];
    const range = `${quoteSheetName(moduleName)}!A2:${colName(headers.length - 1)}`;
    const data = await sheetsFetch(`/values/${encodeURIComponent(range)}`);
    return (data.values || []).map((row, index) => {
        const normalized = headers.map((_, cellIndex) => String(row[cellIndex] ?? ""));
        normalized._sheetRow = index + 2;
        return normalized;
    });
}

async function buildBaoCaoData() {
    const [donHangRows, nppRows] = await Promise.all([
        loadModuleRows("DON_HANG"),
        loadModuleRows("NPP")
    ]);
    const donHangHeaders = getHeaders("DON_HANG");
    const nppHeaders = getHeaders("NPP");
    const nppNameById = new Map(nppRows.map(row => [
        String(row[nppHeaders.indexOf("id")] || "").trim(),
        String(row[nppHeaders.indexOf("ten")] || "").trim()
    ]));
    const nppCommissionById = new Map(nppRows.map(row => [
        String(row[nppHeaders.indexOf("id")] || "").trim(),
        String(row[nppHeaders.indexOf("hoa_hong")] || "").trim()
    ]));
    const nppIndex = donHangHeaders.indexOf("npp");
    const ngayIndex = donHangHeaders.indexOf("ngay");
    const mdhIndex = donHangHeaders.indexOf("mdh");
    const idSpIndex = donHangHeaders.indexOf("id_sp");
    const tenIndex = donHangHeaders.indexOf("ten");
    const slgIndex = donHangHeaders.indexOf("slg");
    const filterDateFrom = document.getElementById("reportDateFrom")?.value || "";
    const filterDateTo = document.getElementById("reportDateTo")?.value || "";
    const filterNpp = String(document.getElementById("reportNpp")?.value || "").trim().toLowerCase();
    const filterIdSp = String(document.getElementById("reportIdSp")?.value || "").trim().toLowerCase();
    const fromTime = filterDateFrom ? new Date(`${filterDateFrom}T00:00:00`).getTime() : 0;
    const toTime = filterDateTo ? new Date(`${filterDateTo}T23:59:59`).getTime() : 0;
    const skuSet = new Set();
    const nppSales = new Map();
    const skuSales = new Map();
    const dateSales = new Map();
    let totalSales = 0;
    let totalQuantity = 0;
    let totalCommission = 0;

    donHangRows.forEach(row => {
        const npp = String(row[nppIndex] || "").trim() || "Không có NPP";
        const ngay = String(row[ngayIndex] || "").trim();
        const mdh = String(row[mdhIndex] || "").trim();
        const idSp = String(row[idSpIndex] || "").trim();
        const productName = String(row[tenIndex] || "").trim();
        const rowTime = getDateTime(ngay);
        if (fromTime && rowTime < fromTime) return;
        if (toTime && rowTime > toTime) return;
        if (filterNpp && npp.toLowerCase() !== filterNpp) return;
        if (filterIdSp && idSp.toLowerCase() !== filterIdSp) return;
        const quantity = parseMoney(row[slgIndex]);
        const sales = getDonHangItemSales(row, donHangHeaders);
        totalSales += sales;
        totalQuantity += quantity;
        if (idSp) skuSet.add(idSp);
        if (!nppSales.has(npp)) {
            nppSales.set(npp, {
                npp,
                nppName: nppNameById.get(npp) || "",
                hoaHong: nppCommissionById.get(npp) || "",
                sales: 0,
                commission: 0,
                quantity: 0,
                orders: new Set(),
                sku: new Map()
            });
        }
        const entry = nppSales.get(npp);
        entry.sales += sales;
        const commission = sales * (parseMoney(entry.hoaHong) / 100);
        entry.commission += commission;
        totalCommission += commission;
        entry.quantity += quantity;
        if (mdh) entry.orders.add(mdh);
        if (idSp) {
            if (!entry.sku.has(idSp)) {
                entry.sku.set(idSp, { idSp, productName, quantity: 0, sales: 0 });
            }
            const sku = entry.sku.get(idSp);
            sku.quantity += quantity;
            sku.sales += sales;
        }
        if (idSp) {
            if (!skuSales.has(idSp)) {
                skuSales.set(idSp, { idSp, productName, quantity: 0, sales: 0 });
            }
            const skuEntry = skuSales.get(idSp);
            skuEntry.quantity += quantity;
            skuEntry.sales += sales;
            if (!skuEntry.productName && productName) skuEntry.productName = productName;
        }
        if (ngay) {
            if (!dateSales.has(ngay)) dateSales.set(ngay, { ngay, quantity: 0, sales: 0, commission: 0, orders: new Set() });
            const dateEntry = dateSales.get(ngay);
            dateEntry.quantity += quantity;
            dateEntry.sales += sales;
            dateEntry.commission += commission;
            if (mdh) dateEntry.orders.add(mdh);
        }
    });

    const nppRowsReport = [...nppSales.values()]
        .map(entry => ({
            ...entry,
            orderCount: entry.orders.size,
            bestSku: [...entry.sku.values()].sort((a, b) => b.quantity - a.quantity || b.sales - a.sales)[0] || null
        }))
        .sort((a, b) => b.sales - a.sales);

    return {
        totalSales,
        totalQuantity,
        totalCommission,
        totalSku: skuSet.size,
        bestNpp: nppRowsReport[0] || null,
        nppRows: nppRowsReport,
        skuRows: [...skuSales.values()].sort((a, b) => b.sales - a.sales),
        dateRows: [...dateSales.values()]
            .map(entry => ({ ...entry, orderCount: entry.orders.size }))
            .sort((a, b) => getDateTime(b.ngay) - getDateTime(a.ngay))
    };
}

function renderTabs() {
    const tabs = document.getElementById("tabs");
    tabs.innerHTML = MODULE_ORDER
        .filter(moduleName => CONFIG.modules[moduleName] && !CONFIG.modules[moduleName].hidden)
        .map(moduleName => {
            const config = CONFIG.modules[moduleName];
            return `
        <button type="button" class="tab ${moduleName === currentModule ? "active" : ""}" onclick="switchModule('${escapeJsString(moduleName)}')">
            <i data-lucide="${escapeHtml(config.icon)}" style="width:18px;"></i>
            <span>${escapeHtml(config.label)}</span>
        </button>
    `;
        }).join("");
    lucide.createIcons();
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('active');
}

function updateModuleTitle() {
    const sheetName = document.getElementById("sheetName");
    if (sheetName) sheetName.innerText = getModuleConfig().label.toUpperCase();
    const mobileTitle = document.getElementById("mobilePageTitle");
    if (mobileTitle) mobileTitle.innerText = getModuleConfig().label;
}

function updateModuleActions() {
    const uploadBtn = document.getElementById("uploadBtn");
    const addBtn = document.getElementById("addBtn");
    const searchContainer = document.querySelector(".search-container");
    const isReport = getModuleConfig().reportOnly;
    if (uploadBtn) uploadBtn.style.display = currentModule === "CONG_VIEC" || isReport ? "none" : "flex";
    if (addBtn) addBtn.style.display = isReport ? "none" : "flex";
    if (searchContainer) searchContainer.style.display = isReport ? "none" : "block";
    updateBulkDeleteButton();
}

function canBulkSelectRows() {
    return !getModuleConfig().reportOnly && !(currentModule === "CONG_VIEC" && congViecView === "kanban");
}

function clearSelectedRows() {
    selectedSheetRows.clear();
    updateBulkDeleteButton();
    const selectAll = document.getElementById("selectAllRows");
    if (selectAll) {
        selectAll.checked = false;
        selectAll.indeterminate = false;
    }
}

function updateBulkDeleteButton() {
    const btn = document.getElementById("bulkDeleteBtn");
    if (!btn) return;
    const show = canBulkSelectRows() && selectedSheetRows.size > 0;
    btn.style.display = show ? "flex" : "none";
    if (show) {
        btn.innerHTML = `<i data-lucide="trash-2" style="width:18px;"></i> Xóa đã chọn (${selectedSheetRows.size})`;
        lucide.createIcons();
    }
}

function syncSelectAllCheckbox() {
    const selectAll = document.getElementById("selectAllRows");
    if (!selectAll) return;
    const selectableRows = filteredData.map(row => Number(row._sheetRow)).filter(Boolean);
    const checkedCount = selectableRows.filter(rowNum => selectedSheetRows.has(rowNum)).length;
    selectAll.checked = selectableRows.length > 0 && checkedCount === selectableRows.length;
    selectAll.indeterminate = checkedCount > 0 && checkedCount < selectableRows.length;
}

function toggleRowSelection(sheetRow, checked) {
    const rowNum = Number(sheetRow);
    if (!rowNum) return;
    if (checked) selectedSheetRows.add(rowNum);
    else selectedSheetRows.delete(rowNum);
    syncSelectAllCheckbox();
    updateBulkDeleteButton();
}

function toggleMultipleRowSelection(sheetRows, checked) {
    String(sheetRows || "")
        .split(",")
        .map(value => Number(value))
        .filter(Boolean)
        .forEach(rowNum => {
            if (checked) selectedSheetRows.add(rowNum);
            else selectedSheetRows.delete(rowNum);
        });
    syncSelectAllCheckbox();
    updateBulkDeleteButton();
}

function toggleSelectAllRows(checkbox) {
    const selectableRows = filteredData.map(row => Number(row._sheetRow)).filter(Boolean);
    selectableRows.forEach(rowNum => {
        if (checkbox.checked) selectedSheetRows.add(rowNum);
        else selectedSheetRows.delete(rowNum);
    });
    document.querySelectorAll(".row-select-checkbox").forEach(item => {
        const rowNum = Number(item.dataset.sheetRow);
        item.checked = checkbox.checked;
    });
    checkbox.indeterminate = false;
    updateBulkDeleteButton();
}

async function switchModule(moduleName) {
    currentModule = CONFIG.modules[moduleName] && !CONFIG.modules[moduleName].hidden ? moduleName : "BAO_CAO";
    moduleLoadSeq += 1;
    const seq = moduleLoadSeq;
    try { sessionStorage.setItem(MODULE_STORAGE_KEY, currentModule); } catch (_) { }
    document.getElementById("searchInput").value = "";
    clearSelectedRows();
    updateModuleTitle();
    renderTabs();
    updateModuleActions();
    renderFilterPanel();
    allData = [];
    filteredData = [];
    reportData = null;
    currentPage = 1;
    renderHeaders();
    renderTable();
    requestAnimationFrame(() => {
        if (seq === moduleLoadSeq) fetchData(seq);
    });
}

async function fetchData(seq = moduleLoadSeq) {
    if (document.getElementById("mapContainer")) {
        document.getElementById("mapContainer").style.display = "none";
    }
    const homeContainer = document.getElementById("homeContainer");
    if (homeContainer) homeContainer.style.display = "none";
    if (document.getElementById("tableWrapper")) document.getElementById("tableWrapper").style.display = "block";
    if (document.getElementById("headerActions")) document.getElementById("headerActions").style.display = "flex";
    if (document.getElementById("filterPanel")) document.getElementById("filterPanel").style.display = "flex";

    if (currentModule === "TRANG_CHU") {
        if (document.getElementById("tableWrapper")) document.getElementById("tableWrapper").style.display = "none";
        if (document.getElementById("headerActions")) document.getElementById("headerActions").style.display = "none";
        if (document.getElementById("filterPanel")) document.getElementById("filterPanel").style.display = "none";
        if (homeContainer) {
            homeContainer.style.display = "flex";
            renderTrangChuModule();
        }
        hideLoading();
        return;
    }

    if (currentModule === "VI_TRI") {
        if (document.getElementById("tableWrapper")) document.getElementById("tableWrapper").style.display = "none";
        if (document.getElementById("headerActions")) document.getElementById("headerActions").style.display = "none";
        if (document.getElementById("filterPanel")) document.getElementById("filterPanel").style.display = "none";
        renderMapModule();
        hideLoading();
        return;
    }
    if (getModuleConfig().reportOnly) {
        showLoading("Đang tải báo cáo...");
        try {
            reportData = await buildBaoCaoData();
            if (seq !== moduleLoadSeq) return;
            filteredData = [];
            allData = [];
            currentPage = 1;
            reportSkuPage = 1;
            clearSelectedRows();
            renderHeaders();
            renderTable();
        } catch (err) {
            console.error(err);
            alert("Không thể tải báo cáo: " + err.message);
        } finally {
            hideLoading();
        }
        return;
    }

    const headers = getHeaders();
    showLoading(`Đang tải dữ liệu ${currentModule}...`);
    try {
        if (currentModule === "DON_HANG" || currentModule === "CONG_NO") await loadNppOptions();
        if (seq !== moduleLoadSeq) return;
        await ensureModuleSheet(currentModule);
        if (seq !== moduleLoadSeq) return;
        const range = `${quoteSheetName(currentModule)}!A2:${colName(headers.length - 1)}`;
        const data = await sheetsFetch(`/values/${encodeURIComponent(range)}`);
        if (seq !== moduleLoadSeq) return;
        const rows = data.values || [];
        allData = rows.map((row, index) => {
            const normalized = headers.map((_, cellIndex) => String(row[cellIndex] ?? ""));
            normalized._sheetRow = index + 2;
            return normalized;
        });
        filteredData = [...allData];
        applyCurrentFilters();
        currentPage = 1;
        clearSelectedRows();
        renderHeaders();
        renderTable();
    } catch (err) {
        console.error(err);
        alert("Không thể tải dữ liệu: " + err.message);
    } finally {
        hideLoading();
    }
}

async function renderFilterPanel() {
    const panel = document.getElementById("filterPanel");
    if (getModuleConfig().reportOnly) {
        panel.innerHTML = `
            <label><span>Từ ngày</span><input id="reportDateFrom" type="date" onchange="fetchData()"></label>
            <label><span>Tới ngày</span><input id="reportDateTo" type="date" onchange="fetchData()"></label>
            ${renderQuickDateButtons("report")}
            <label><span>NPP</span><select id="reportNpp" onchange="fetchData()">
                <option value="">Tất cả NPP</option>
                ${nppOptions.map(item => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.id)}${item.ten ? ` - ${escapeHtml(item.ten)}` : ""}</option>`).join("")}
            </select></label>
            <label><span>ID_SP</span><input id="reportIdSp" type="text" placeholder="Lọc ID_SP..." oninput="fetchData()"></label>
        `;
        if (!nppOptions.length) {
            loadNppOptions().then(() => {
                if (currentModule === "BAO_CAO") renderFilterPanel();
            }).catch(console.error);
        }
        return;
    }
    if (currentModule === "DON_HANG") {
        panel.innerHTML = `
            <label><span>Từ ngày</span><input id="filterDateFrom" type="date" onchange="filterTable()"></label>
            <label><span>Tới ngày</span><input id="filterDateTo" type="date" onchange="filterTable()"></label>
            ${renderQuickDateButtons("table")}
            <label><span>NPP</span><select id="filterNpp" onchange="filterTable()">
                <option value="">Tất cả NPP</option>
                ${nppOptions.map(item => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.id)}${item.ten ? ` - ${escapeHtml(item.ten)}` : ""}</option>`).join("")}
            </select></label>
            <label><span>MDH</span><input id="filterMdh" type="text" placeholder="Lọc MDH..." oninput="filterTable()"></label>
            <div id="donHangTotalBox" class="filter-summary-box">
                <span>Tổng tiền</span>
                <strong>0</strong>
            </div>
        `;
        if (!nppOptions.length) {
            loadNppOptions().then(() => {
                if (currentModule === "DON_HANG") renderFilterPanel();
            }).catch(console.error);
        }
        return;
    }
    if (currentModule === "CONG_NO") {
        const statusOptions = getModuleConfig("CONG_NO").statusOptions || [];
        panel.innerHTML = `
            <label><span>Từ ngày</span><input id="filterDateFrom" type="date" onchange="filterTable()"></label>
            <label><span>Tới ngày</span><input id="filterDateTo" type="date" onchange="filterTable()"></label>
            ${renderQuickDateButtons("table")}
            <label><span>NPP</span><select id="filterNpp" onchange="filterTable()">
                <option value="">Tất cả NPP</option>
                ${nppOptions.map(item => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.id)}${item.ten ? ` - ${escapeHtml(item.ten)}` : ""}</option>`).join("")}
            </select></label>
            <label><span>Trường</span><select id="filterTruong" onchange="filterTable()">
                <option value="">Tất cả</option>
                ${statusOptions.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("")}
            </select></label>
            <div id="congNoTotalBox" class="filter-summary-box">
                <span>Công nợ còn lại</span>
                <strong>0</strong>
            </div>
        `;
        if (!nppOptions.length) {
            loadNppOptions().then(() => {
                if (currentModule === "CONG_NO") renderFilterPanel();
            }).catch(console.error);
        }
        return;
    }
    if (currentModule === "CONG_VIEC") {
        const statusOptions = getModuleConfig("CONG_VIEC").statusOptions || [];
        panel.innerHTML = `
            <label><span>Từ ngày</span><input id="filterDateFrom" type="date" onchange="filterTable()"></label>
            <label><span>Tới ngày</span><input id="filterDateTo" type="date" onchange="filterTable()"></label>
            ${renderQuickDateButtons("table")}
            <label><span>Tình trạng</span><select id="filterTinhTrang" onchange="filterTable()">
                <option value="">Tất cả tình trạng</option>
                ${statusOptions.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("")}
            </select></label>
            <label><span>Trạng thái</span><input id="filterTrangThai" type="text" placeholder="Lọc trạng thái..." oninput="filterTable()"></label>
            <button type="button" class="view-toggle-btn" onclick="toggleCongViecView()">
                <i data-lucide="${congViecView === "kanban" ? "table-2" : "columns-3"}" style="width:16px;"></i>
                ${congViecView === "kanban" ? "Xem bảng" : "Xem kanban"}
            </button>
        `;
        lucide.createIcons();
        return;
    }
    panel.innerHTML = "";
}

async function toggleCongViecView() {
    congViecView = congViecView === "kanban" ? "table" : "kanban";
    try { sessionStorage.setItem("kieuDucCongViecView", congViecView); } catch (_) { }
    clearSelectedRows();
    await renderFilterPanel();
    renderHeaders();
    renderTable();
}

function getDateTime(value) {
    const raw = String(value || "").trim();
    if (!raw) return 0;
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return new Date(`${raw}T00:00:00`).getTime();
    const match = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (match) return new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1])).getTime();
    const date = new Date(raw);
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function sortFilteredDataByNgayDesc() {
    if (!["DON_HANG", "CONG_NO", "CONG_VIEC"].includes(currentModule)) return;
    const ngayIndex = getHeaderIndex("ngay", currentModule);
    if (ngayIndex < 0) return;
    filteredData.sort((a, b) => getDateTime(b[ngayIndex]) - getDateTime(a[ngayIndex]) || Number(b._sheetRow || 0) - Number(a._sheetRow || 0));
}

function getDonHangSummaryRows(rows = filteredData) {
    const headers = getHeaders("DON_HANG");
    const ngayIndex = headers.indexOf("ngay");
    const mdhIndex = headers.indexOf("mdh");
    const nppIndex = headers.indexOf("npp");
    const groups = new Map();
    rows.forEach(row => {
        const mdh = String(row[mdhIndex] || "").trim();
        const key = mdh || `__row_${row._sheetRow}`;
        if (!groups.has(key)) {
            groups.set(key, {
                ngay: String(row[ngayIndex] || "").trim(),
                mdh,
                npp: String(row[nppIndex] || "").trim(),
                tong_tien: 0,
                sheetRows: []
            });
        }
        const entry = groups.get(key);
        entry.tong_tien += getDonHangItemSales(row, headers);
        entry.sheetRows.push(Number(row._sheetRow));
        if (getDateTime(row[ngayIndex]) > getDateTime(entry.ngay)) entry.ngay = String(row[ngayIndex] || "").trim();
        if (!entry.npp && row[nppIndex]) entry.npp = String(row[nppIndex] || "").trim();
    });
    return [...groups.values()].sort((a, b) => getDateTime(b.ngay) - getDateTime(a.ngay));
}

function getCurrentDisplayRowCount() {
    if (currentModule === "DON_HANG") return getDonHangSummaryRows().length;
    return filteredData.length;
}

function getCongNoBalanceMap(rows = allData) {
    const headers = getHeaders("CONG_NO");
    const ngayIndex = headers.indexOf("ngay");
    const nppIndex = headers.indexOf("npp");
    const truongIndex = headers.indexOf("truong");
    const soTienIndex = headers.indexOf("so_tien");
    const balances = new Map();
    const result = new Map();
    [...rows]
        .sort((a, b) => getDateTime(a[ngayIndex]) - getDateTime(b[ngayIndex]) || Number(a._sheetRow || 0) - Number(b._sheetRow || 0))
        .forEach(row => {
            const npp = String(row[nppIndex] || "").trim();
            const key = npp || "__NO_NPP__";
            const type = String(row[truongIndex] || "").trim().toUpperCase();
            const amount = parseMoney(row[soTienIndex]);
            const nextBalance = (balances.get(key) || 0) + (type === "THU" ? -amount : amount);
            balances.set(key, nextBalance);
            if (row._sheetRow) result.set(Number(row._sheetRow), nextBalance);
        });
    return result;
}

function getCongNoTotal(rows = filteredData) {
    const headers = getHeaders("CONG_NO");
    const truongIndex = headers.indexOf("truong");
    const soTienIndex = headers.indexOf("so_tien");
    return rows.reduce((sum, row) => {
        const type = String(row[truongIndex] || "").trim().toUpperCase();
        const amount = parseMoney(row[soTienIndex]);
        return sum + (type === "THU" ? -amount : amount);
    }, 0);
}

function updateCongNoTotalBox() {
    const box = document.getElementById("congNoTotalBox");
    if (!box) return;
    const valueEl = box.querySelector("strong");
    if (valueEl) valueEl.innerText = formatDisplayNumber(getCongNoTotal());
}

function getDonHangItemSales(row, headers = getHeaders("DON_HANG")) {
    const thanhTienIndex = headers.indexOf("thanh_tien");
    const tienHangIndex = headers.indexOf("tien_hang");
    const tienChietKhauIndex = headers.indexOf("tien_chiet_khau");
    if (tienHangIndex >= 0 && row[tienHangIndex] !== undefined && row[tienHangIndex] !== "") {
        return parseMoney(row[tienHangIndex]);
    }
    return parseMoney(row[thanhTienIndex]) - parseMoney(row[tienChietKhauIndex]);
}

function getDonHangTotal(rows = filteredData) {
    const headers = getHeaders("DON_HANG");
    return rows.reduce((sum, row) => sum + getDonHangItemSales(row, headers), 0);
}

function updateDonHangTotalBox() {
    const box = document.getElementById("donHangTotalBox");
    if (!box) return;
    const valueEl = box.querySelector("strong");
    if (valueEl) valueEl.innerText = formatDisplayNumber(getDonHangTotal());
}

function formatDateInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getQuickDateRange(type) {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const end = new Date(start);
    if (type === "yesterday") {
        start.setDate(start.getDate() - 1);
        end.setDate(end.getDate() - 1);
    }
    if (type === "week") {
        const day = start.getDay() || 7;
        start.setDate(start.getDate() - day + 1);
        end.setTime(start.getTime());
        end.setDate(end.getDate() + 6);
    }
    if (type === "month") {
        start.setDate(1);
        end.setTime(start.getTime());
        end.setMonth(end.getMonth() + 1, 0);
    }
    return { from: formatDateInput(start), to: formatDateInput(end) };
}

function renderQuickDateButtons(scope) {
    return `
        <div class="quick-date-buttons" aria-label="Lọc nhanh theo ngày">
            <button type="button" onclick="applyQuickDateFilter('${scope}', 'today')">Hôm nay</button>
            <button type="button" onclick="applyQuickDateFilter('${scope}', 'yesterday')">Hôm qua</button>
            <button type="button" onclick="applyQuickDateFilter('${scope}', 'week')">Tuần này</button>
            <button type="button" onclick="applyQuickDateFilter('${scope}', 'month')">Tháng này</button>
        </div>
    `;
}

function applyQuickDateFilter(scope, type) {
    const range = getQuickDateRange(type);
    const fromInput = document.getElementById(scope === "report" ? "reportDateFrom" : "filterDateFrom");
    const toInput = document.getElementById(scope === "report" ? "reportDateTo" : "filterDateTo");
    if (fromInput) fromInput.value = range.from;
    if (toInput) toInput.value = range.to;
    if (scope === "report") fetchData();
    else filterTable();
}

function formatChartDateLabel(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
        const [year, month, day] = raw.split("-");
        return `${day}/${month}`;
    }
    const match = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (match) return `${match[1].padStart(2, "0")}/${match[2].padStart(2, "0")}`;
    return raw.length > 8 ? raw.slice(0, 8) : raw;
}

function applyCurrentFilters() {
    const term = document.getElementById("searchInput")?.value.trim().toLowerCase() || "";
    const dateFrom = document.getElementById("filterDateFrom")?.value || "";
    const dateTo = document.getElementById("filterDateTo")?.value || "";
    const fromTime = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : 0;
    const toTime = dateTo ? new Date(`${dateTo}T23:59:59`).getTime() : 0;

    filteredData = allData.filter(row => {
        const matchesSearch = !term || row.some(cell => String(cell).toLowerCase().includes(term));
        if (!matchesSearch) return false;

        if (currentModule === "DON_HANG") {
            const ngayIndex = getHeaderIndex("ngay", "DON_HANG");
            const nppIndex = getHeaderIndex("npp", "DON_HANG");
            const mdhIndex = getHeaderIndex("mdh", "DON_HANG");
            const npp = (document.getElementById("filterNpp")?.value || "").toLowerCase();
            const mdh = (document.getElementById("filterMdh")?.value || "").toLowerCase();
            const rowTime = getDateTime(row[ngayIndex]);
            return (!fromTime || rowTime >= fromTime)
                && (!toTime || rowTime <= toTime)
                && (!npp || String(row[nppIndex] || "").toLowerCase() === npp)
                && (!mdh || String(row[mdhIndex] || "").toLowerCase().includes(mdh));
        }

        if (currentModule === "CONG_NO") {
            const ngayIndex = getHeaderIndex("ngay", "CONG_NO");
            const nppIndex = getHeaderIndex("npp", "CONG_NO");
            const truongIndex = getHeaderIndex("truong", "CONG_NO");
            const npp = (document.getElementById("filterNpp")?.value || "").toLowerCase();
            const truong = (document.getElementById("filterTruong")?.value || "").toLowerCase();
            const rowTime = getDateTime(row[ngayIndex]);
            return (!fromTime || rowTime >= fromTime)
                && (!toTime || rowTime <= toTime)
                && (!npp || String(row[nppIndex] || "").toLowerCase() === npp)
                && (!truong || String(row[truongIndex] || "").toLowerCase() === truong);
        }

        if (currentModule === "CONG_VIEC") {
            const ngayIndex = getHeaderIndex("ngay", "CONG_VIEC");
            const tinhTrangIndex = getHeaderIndex("tinh_trang", "CONG_VIEC");
            const trangThaiIndex = getHeaderIndex("trang_thai", "CONG_VIEC");
            const tinhTrang = (document.getElementById("filterTinhTrang")?.value || "").toLowerCase();
            const trangThai = (document.getElementById("filterTrangThai")?.value || "").toLowerCase();
            const rowTime = getDateTime(row[ngayIndex]);
            return (!fromTime || rowTime >= fromTime)
                && (!toTime || rowTime <= toTime)
                && (!tinhTrang || String(row[tinhTrangIndex] || "").toLowerCase() === tinhTrang)
                && (!trangThai || String(row[trangThaiIndex] || "").toLowerCase().includes(trangThai));
        }

        return true;
    });
    sortFilteredDataByNgayDesc();
}

function renderHeaders() {
    const head = document.getElementById("tableHead");
    if (getModuleConfig().reportOnly || !canBulkSelectRows()) {
        head.innerHTML = "";
        return;
    }
    const headers = currentModule === "DON_HANG" ? ["ngay", "mdh", "npp", "tong_tien"] : getHeaders().filter(header => header !== "id");
    head.innerHTML = `<tr>
        <th class="select-col">
            <input id="selectAllRows" type="checkbox" onchange="toggleSelectAllRows(this)" onclick="event.stopPropagation()" title="Chọn tất cả dòng đang lọc">
        </th>
        ${headers.map(header => `<th>${escapeHtml(header.toUpperCase())}</th>`).join("")}
    </tr>`;
    syncSelectAllCheckbox();
}

function renderTable() {
    if (getModuleConfig().reportOnly) {
        document.getElementById("tableWrapper").style.display = "none";
        document.getElementById("kanbanBoard").style.display = "none";
        renderBaoCao();
        renderPagination();
        return;
    }
    document.getElementById("reportView")?.remove();
    const showKanban = currentModule === "CONG_VIEC" && congViecView === "kanban";
    document.getElementById("tableWrapper").style.display = showKanban ? "none" : "block";
    document.getElementById("kanbanBoard").style.display = showKanban ? "grid" : "none";
    if (showKanban) {
        renderCongViecKanban();
        renderPagination();
        return;
    }

    const tbody = document.getElementById("tableBody");
    const storageHeaders = getHeaders();
    if (currentModule === "DON_HANG") {
        const headers = ["ngay", "mdh", "npp", "tong_tien"];
        const start = (currentPage - 1) * rowsPerPage;
        const pageData = getDonHangSummaryRows().slice(start, start + rowsPerPage);
        tbody.innerHTML = pageData.map(row => {
            const sheetRows = row.sheetRows.join(",");
            const allChecked = row.sheetRows.length > 0 && row.sheetRows.every(sheetRow => selectedSheetRows.has(sheetRow));
            const cells = [
                row.ngay,
                row.mdh,
                getNppDisplayName(row.npp),
                formatDisplayNumber(row.tong_tien)
            ].map(value => `<td>${escapeHtml(value)}</td>`).join("");
            const selectCell = `<td class="select-col">
                <input class="row-select-checkbox" type="checkbox" data-sheet-row="${escapeHtml(sheetRows)}" ${allChecked ? "checked" : ""} onclick="event.stopPropagation()" onchange="toggleMultipleRowSelection('${escapeJsString(sheetRows)}', this.checked)">
            </td>`;
            return `<tr ondblclick="openDonHangForm('${escapeJsString(row.mdh || "")}')">${selectCell}${cells}</tr>`;
        }).join("");
        if (!pageData.length) {
            tbody.innerHTML = `<tr><td colspan="${headers.length + 1}">Chưa có dữ liệu.</td></tr>`;
        }
        syncSelectAllCheckbox();
        updateDonHangTotalBox();
        renderPagination();
        return;
    }
    const headers = currentModule === "DON_HANG" ? [...storageHeaders, "tien_hoa_hong"] : storageHeaders.filter(header => header !== "id");
    const mdhIndex = storageHeaders.indexOf("mdh");
    const nppIndex = storageHeaders.indexOf("npp");
    const start = (currentPage - 1) * rowsPerPage;
    const pageData = filteredData.slice(start, start + rowsPerPage);
    const congNoBalanceMap = currentModule === "CONG_NO" ? getCongNoBalanceMap() : null;
    tbody.innerHTML = pageData.map((row, rowIndex) => {
        const cells = headers.map((header, index) => {
            const sourceIndex = storageHeaders.indexOf(header);
            let value = header === "tien_hoa_hong"
                ? getDonHangItemSales(row, storageHeaders) * getNppCommissionRate(row[nppIndex])
                : row[sourceIndex] || "";
            if (currentModule === "CONG_NO" && header === "cong_no_con_lai") {
                value = congNoBalanceMap?.get(Number(row._sheetRow)) ?? "";
            }
            if ((currentModule === "DON_HANG" || currentModule === "CONG_NO") && header === "npp") {
                value = getNppDisplayName(row[nppIndex]);
            }
            const text = String(value).trim();
            if (text.startsWith("http://") || text.startsWith("https://")) {
                return `<td><a href="${escapeHtml(text)}" target="_blank">Link</a></td>`;
            }
            const displayValue = isNumericHeader(header) || header === "tien_hoa_hong" ? formatDisplayNumber(value) : value;
            return `<td>${escapeHtml(displayValue)}</td>`;
        }).join("");
        const sheetRow = Number(row._sheetRow);
        const selectCell = `<td class="select-col">
            <input class="row-select-checkbox" type="checkbox" data-sheet-row="${sheetRow}" ${selectedSheetRows.has(sheetRow) ? "checked" : ""} onclick="event.stopPropagation()" onchange="toggleRowSelection(${sheetRow}, this.checked)">
        </td>`;
        const action = currentModule === "DON_HANG"
            ? `openDonHangForm('${escapeJsString(row[mdhIndex] || "")}')`
            : `openRecordForm(${start + rowIndex})`;
        return `<tr ondblclick="${action}">${selectCell}${cells}</tr>`;
    }).join("");
    if (!pageData.length) {
        tbody.innerHTML = `<tr><td colspan="${headers.length + 1}">Chưa có dữ liệu.</td></tr>`;
    }
    syncSelectAllCheckbox();
    if (currentModule === "CONG_NO") updateCongNoTotalBox();
    renderPagination();
}

function getSalesCommissionBreakdown(totalSales) {
    const sales = parseMoney(totalSales);
    const firstTarget = 468000000;
    const secondTarget = 780000000;
    if (sales < firstTarget) {
        return {
            rows: [
                { label: "Dưới 468.000.000", rate: "0%", amount: 0 },
                { label: "Từ 468tr đến dưới 780tr", rate: "0.5%", amount: 0 },
                { label: "Bằng 780tr", rate: "1%", amount: 0 },
                { label: "Trên 780tr", rate: "1% của 780tr + 1.5% phần vượt", amount: 0 }
            ],
            total: 0
        };
    }
    if (sales < secondTarget) {
        const amount = sales * 0.005;
        return {
            rows: [
                { label: "Dưới 468.000.000", rate: "0%", amount: 0 },
                { label: "Từ 468tr đến dưới 780tr", rate: "0.5%", amount },
                { label: "Bằng 780tr", rate: "1%", amount: 0 },
                { label: "Trên 780tr", rate: "1% của 780tr + 1.5% phần vượt", amount: 0 }
            ],
            total: amount
        };
    }
    const baseAmount = secondTarget * 0.01;
    const overAmount = Math.max(sales - secondTarget, 0) * 0.015;
    return {
        rows: [
            { label: "Dưới 468.000.000", rate: "0%", amount: 0 },
            { label: "Từ 468tr đến dưới 780tr", rate: "0.5%", amount: 0 },
            { label: "Bằng 780tr", rate: "1%", amount: baseAmount },
            { label: "Trên 780tr", rate: "1% của 780tr + 1.5% phần vượt", amount: overAmount }
        ],
        total: baseAmount + overAmount
    };
}

function renderBaoCao() {
    document.getElementById("reportView")?.remove();
}

function changeReportSkuPage(delta) {
    const totalRows = reportData?.skuRows?.length || 0;
    const totalPages = Math.max(Math.ceil(totalRows / 10), 1);
    reportSkuPage = Math.min(Math.max(reportSkuPage + delta, 1), totalPages);
    renderBaoCao();
}

function drawDailySalesChart(rows) {
    const canvas = document.getElementById("commissionLineChart");
    if (!canvas) return;
    const containerWidth = canvas.parentElement?.clientWidth || 640;
    const cssWidth = Math.max(containerWidth, 420);
    const cssHeight = 300;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    const padding = { top: 46, right: 70, bottom: 52, left: 70 };
    const plotWidth = cssWidth - padding.left - padding.right;
    const plotHeight = cssHeight - padding.top - padding.bottom;
    const salesAxisMax = Math.max(...rows.map(row => row.sales || 0), 1) * 1.1;
    const formatAxis = value => new Intl.NumberFormat("vi-VN", {
        notation: value >= 1000000 ? "compact" : "standard",
        maximumFractionDigits: 1
    }).format(value);

    ctx.font = "600 11px Inter, sans-serif";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "#e2e8f0";
    ctx.fillStyle = "#64748b";
    ctx.lineWidth = 1;
    for (let step = 0; step <= 5; step += 1) {
        const y = padding.top + (plotHeight / 5) * step;
        const salesValue = salesAxisMax * (1 - step / 5);
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(cssWidth - padding.right, y);
        ctx.stroke();
        ctx.textAlign = "right";
        ctx.fillStyle = "#164e63";
        ctx.fillText(formatAxis(salesValue), padding.left - 9, y);
    }

    const categoryWidth = plotWidth / Math.max(rows.length, 1);
    const xFor = index => padding.left + categoryWidth * (index + 0.5);
    const salesYFor = value => padding.top + plotHeight - ((Number(value) || 0) / salesAxisMax) * plotHeight;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    rows.forEach((row, index) => {
        const x = xFor(index);
        const label = formatChartDateLabel(row.ngay);
        const maxLabelWidth = Math.max(categoryWidth - 12, 44);
        let compactLabel = label;
        while (compactLabel.length > 3 && ctx.measureText(`${compactLabel}...`).width > maxLabelWidth) {
            compactLabel = compactLabel.slice(0, -1);
        }
        if (compactLabel !== label) compactLabel += "...";
        ctx.fillStyle = "#64748b";
        ctx.fillText(compactLabel, x, padding.top + plotHeight + 12);
    });
    ctx.restore();

    ctx.strokeStyle = "#4285f4";
    ctx.fillStyle = "#4285f4";
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    rows.forEach((row, index) => {
        const x = xFor(index);
        const y = salesYFor(row.sales);
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();
    rows.forEach((row, index) => {
        ctx.beginPath();
        ctx.arc(xFor(index), salesYFor(row.sales), 4, 0, Math.PI * 2);
        ctx.fill();
    });

    const legendY = 20;
    ctx.strokeStyle = "#4285f4";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(padding.left, legendY);
    ctx.lineTo(padding.left + 24, legendY);
    ctx.stroke();
    ctx.fillStyle = "#475569";
    ctx.textAlign = "left";
    ctx.fillText("Tổng tiền", padding.left + 31, legendY);
}

function renderCongViecKanban() {
    const board = document.getElementById("kanbanBoard");
    const headers = getHeaders("CONG_VIEC");
    const statusIndex = headers.indexOf("tinh_trang");
    const titleIndex = headers.indexOf("cong_viec");
    const dateIndex = headers.indexOf("ngay");
    const contentIndex = headers.indexOf("noi_dung");
    const noteIndex = headers.indexOf("ghi_chu");
    const stateIndex = headers.indexOf("trang_thai");
    const statuses = getModuleConfig("CONG_VIEC").statusOptions || [];
    board.innerHTML = statuses.map(status => {
        const cards = filteredData.filter(row => String(row[statusIndex] || "").trim().toLowerCase() === status.toLowerCase());
        return `
            <section class="kanban-column">
                <header>
                    <span>${escapeHtml(status)}</span>
                    <strong>${cards.length}</strong>
                </header>
                <div class="kanban-cards" data-kanban-status="${escapeHtml(status)}" ondragover="allowKanbanDrop(event)" ondragleave="clearKanbanDrop(event)" ondrop="dropCongViecCard(event)">
                    ${cards.map(row => {
            const rowIndex = filteredData.indexOf(row);
            return `
                            <article class="kanban-card" draggable="true" data-sheet-row="${row._sheetRow}" ondragstart="dragCongViecCard(event)" ondragend="endCongViecDrag(event)" ondblclick="openRecordForm(${rowIndex})">
                                <h3>${escapeHtml(row[titleIndex] || "Không tên")}</h3>
                                <p>${escapeHtml(row[contentIndex] || "")}</p>
                                <div class="kanban-meta">
                                    <span>${escapeHtml(row[dateIndex] || "")}</span>
                                    <span>${escapeHtml(row[stateIndex] || "")}</span>
                                </div>
                                ${row[noteIndex] ? `<small>${escapeHtml(row[noteIndex])}</small>` : ""}
                            </article>
                        `;
        }).join("") || `<div class="kanban-empty">Không có việc</div>`}
                </div>
            </section>
        `;
    }).join("");
}

function renderPagination() {
    if (getModuleConfig().reportOnly) {
        document.getElementById("pagination").innerHTML = "";
        return;
    }
    const totalRows = getCurrentDisplayRowCount();
    if (currentModule === "CONG_VIEC" && congViecView === "kanban") {
        document.getElementById("pagination").innerHTML = "";
        return;
    }
    const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
    const pagination = document.getElementById("pagination");
    if (totalRows <= rowsPerPage) {
        pagination.innerHTML = "";
        return;
    }
    pagination.innerHTML = `
        <button class="pagination-btn" onclick="changePage(-1)" ${currentPage === 1 ? "disabled" : ""}>
            <i data-lucide="chevron-left" style="width:16px;"></i> Trước
        </button>
        <div class="page-info">Trang ${currentPage} / ${totalPages} (${totalRows} dòng)</div>
        <button class="pagination-btn" onclick="changePage(1)" ${currentPage === totalPages ? "disabled" : ""}>
            Tiếp <i data-lucide="chevron-right" style="width:16px;"></i>
        </button>
    `;
    lucide.createIcons();
}

function changePage(delta) {
    const totalRows = getCurrentDisplayRowCount();
    const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
    currentPage = Math.min(Math.max(currentPage + delta, 1), totalPages);
    renderTable();
    document.querySelector(".table-wrapper")?.scrollTo({ top: 0 });
}

function filterTable() {
    clearSelectedRows();
    applyCurrentFilters();
    currentPage = 1;
    renderTable();
}

function dragCongViecCard(event) {
    const card = event.currentTarget;
    card.classList.add("dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", card.dataset.sheetRow || "");
}

function endCongViecDrag(event) {
    event.currentTarget.classList.remove("dragging");
    document.querySelectorAll(".kanban-cards.drag-over").forEach(item => item.classList.remove("drag-over"));
}

function allowKanbanDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.add("drag-over");
    event.dataTransfer.dropEffect = "move";
}

function clearKanbanDrop(event) {
    event.currentTarget.classList.remove("drag-over");
}

async function dropCongViecCard(event) {
    event.preventDefault();
    const target = event.currentTarget;
    target.classList.remove("drag-over");
    const sheetRow = Number(event.dataTransfer.getData("text/plain"));
    const nextStatus = String(target.dataset.kanbanStatus || "").trim();
    if (!sheetRow || !nextStatus) return;

    const row = allData.find(item => item._sheetRow === sheetRow);
    if (!row) return;
    const statusIndex = getHeaderIndex("tinh_trang", "CONG_VIEC");
    if (String(row[statusIndex] || "").trim().toLowerCase() === nextStatus.toLowerCase()) return;

    const updatedRow = [...row];
    updatedRow[statusIndex] = nextStatus;
    showLoading("Đang cập nhật tình trạng công việc...");
    try {
        await writeRecordRow(updatedRow, sheetRow);
        row[statusIndex] = nextStatus;
        applyCurrentFilters();
        renderTable();
    } catch (err) {
        console.error(err);
        alert("Không cập nhật được tình trạng công việc: " + err.message);
    } finally {
        hideLoading();
    }
}

async function writeRecordRow(row, sheetRow) {
    const headers = getHeaders();
    const endCol = colName(headers.length - 1);
    const range = `${quoteSheetName(currentModule)}!A${sheetRow}:${endCol}${sheetRow}`;
    await sheetsFetch(`/values/${encodeURIComponent(range)}?valueInputOption=RAW`, {
        method: "PUT",
        body: JSON.stringify({ values: [normalizeRow(row)] })
    });
}

async function updateDonHangProductId(oldId, newId) {
    const fromId = String(oldId || "").trim();
    const toId = String(newId || "").trim();
    if (!fromId || !toId || fromId === toId) return 0;
    const headers = getHeaders("DON_HANG");
    const idSpIndex = headers.indexOf("id_sp");
    if (idSpIndex < 0) return 0;
    const rows = await loadModuleRows("DON_HANG");
    const col = colName(idSpIndex);
    const updates = rows
        .filter(row => String(row[idSpIndex] || "").trim() === fromId)
        .map(row => ({
            range: `${quoteSheetName("DON_HANG")}!${col}${row._sheetRow}`,
            values: [[toId]]
        }));
    if (!updates.length) return 0;
    await sheetsFetch("/values:batchUpdate?valueInputOption=RAW", {
        method: "POST",
        body: JSON.stringify({ data: updates })
    });
    return updates.length;
}

async function appendRecordRows(rows) {
    const range = `${quoteSheetName(currentModule)}!A2`;
    await sheetsFetch(`/values/${encodeURIComponent(range)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
        method: "POST",
        body: JSON.stringify({ values: rows.map(normalizeRow) })
    });
}

async function deleteRecordRow(sheetRow) {
    const sheet = spreadsheetSheets.get(currentModule);
    if (!sheet) throw new Error(`Không tìm thấy sheet ${currentModule}.`);
    const rowNum = Number(sheetRow);
    if (!rowNum || rowNum < 2) throw new Error("Không xác định được dòng cần xóa.");
    await batchUpdate([{
        deleteDimension: {
            range: {
                sheetId: sheet.sheetId,
                dimension: "ROWS",
                startIndex: rowNum - 1,
                endIndex: rowNum
            }
        }
    }]);
}

async function deleteRecordRows(sheetRows) {
    const sheet = spreadsheetSheets.get(currentModule);
    if (!sheet) throw new Error(`Không tìm thấy sheet ${currentModule}.`);
    const rows = [...new Set(sheetRows.map(Number).filter(row => row >= 2))].sort((a, b) => b - a);
    if (!rows.length) return;
    await batchUpdate(rows.map(rowNum => ({
        deleteDimension: {
            range: {
                sheetId: sheet.sheetId,
                dimension: "ROWS",
                startIndex: rowNum - 1,
                endIndex: rowNum
            }
        }
    })));
}

async function deleteSelectedRows() {
    if (!canBulkSelectRows() || !selectedSheetRows.size) return;
    const rows = [...selectedSheetRows];
    if (!confirm(`Xóa ${rows.length} dòng đã chọn khỏi module ${getModuleConfig().label}?`)) return;
    showLoading("Đang xóa dữ liệu...");
    try {
        await deleteRecordRows(rows);
        clearSelectedRows();
        await fetchData();
    } catch (err) {
        console.error(err);
        alert("Không xóa được dữ liệu: " + err.message);
    } finally {
        hideLoading();
    }
}

function renderDonHangForm(rows = []) {
    const headers = getHeaders("DON_HANG");
    const ngayIndex = headers.indexOf("ngay");
    const mdhIndex = headers.indexOf("mdh");
    const nppIndex = headers.indexOf("npp");
    const today = new Date().toISOString().slice(0, 10);
    const ngay = rows[0]?.[ngayIndex] || today;
    const mdh = rows[0]?.[mdhIndex] || randomCode(10);
    const npp = rows[0]?.[nppIndex] || "";
    currentDonHangMdh = rows.length ? mdh : "";
    const itemRows = rows.length ? rows : [[generateNextId(), ngay, mdh, npp, "", "", "", "", ""]];
    const productOptions = dsSpOptions
        .map(item => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.ten)}</option>`)
        .join("");
    const nppSelectOptions = nppOptions
        .map(item => `<option value="${escapeHtml(item.id)}" ${item.id === npp ? "selected" : ""}>${escapeHtml(item.id)}${item.ten ? ` - ${escapeHtml(item.ten)}` : ""}</option>`)
        .join("");

    document.getElementById("formFields").innerHTML = `
        <section class="order-common-fields">
            <label>
                <span>NGÀY</span>
                <input id="donHangNgay" type="date" value="${escapeHtml(ngay)}">
            </label>
            <label>
                <span>MDH</span>
                <div class="inline-field">
                    <input id="donHangMdh" type="text" value="${escapeHtml(mdh)}">
                    <button type="button" class="secondary-btn compact-btn" onclick="generateQuickMdh()">Tạo MDH</button>
                </div>
            </label>
            <label>
                <span>NPP</span>
                <select id="donHangNpp">
                    <option value=""></option>
                    ${nppSelectOptions}
                </select>
            </label>
        </section>
        <datalist id="dsSpOptions">${productOptions}</datalist>
        <section class="order-items-panel">
            <div class="order-items-head">
                <h3>Sản phẩm</h3>
                <button type="button" class="secondary-btn compact-btn" onclick="addDonHangItem()">Thêm sản phẩm</button>
            </div>
            <div class="order-items-wrapper">
                <table class="order-items-table">
                    <thead>
                        <tr>
                            <th>ID_SP</th>
                            <th>TÊN</th>
                            <th>ĐƠN GIÁ</th>
                            <th>SLG</th>
                            <th>THÀNH TIỀN</th>
                            <th>CHIẾT KHẤU (%)</th>
                            <th>TIỀN CK</th>
                            <th>TIỀN HÀNG</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id="donHangItemsBody"></tbody>
                </table>
            </div>
            <div class="order-total">Tổng tiền: <strong id="donHangTotal">0</strong></div>
        </section>
    `;
    document.getElementById("donHangItemsBody").innerHTML = itemRows.map((row, index) => renderDonHangItemRow(row, index)).join("");
    recalculateDonHangItems();
}

function renderDonHangItemRow(row, index) {
    const headers = getHeaders("DON_HANG");
    const idIndex = headers.indexOf("id");
    const idSpIndex = headers.indexOf("id_sp");
    const tenIndex = headers.indexOf("ten");
    const donGiaIndex = headers.indexOf("don_gia");
    const slgIndex = headers.indexOf("slg");
    const thanhTienIndex = headers.indexOf("thanh_tien");
    const chietKhauIndex = headers.indexOf("chiet_khau");
    const tienChietKhauIndex = headers.indexOf("tien_chiet_khau");
    const tienHangIndex = headers.indexOf("tien_hang");
    return `
        <tr data-order-item="${index}">
            <td>
                <input type="hidden" data-order-field="id" value="${escapeHtml(row[idIndex] || generateNextId())}">
                <input data-order-field="id_sp" type="text" list="dsSpOptions" value="${escapeHtml(row[idSpIndex] || "")}" oninput="updateDonHangProduct(this)">
            </td>
            <td><input data-order-field="ten" type="text" value="${escapeHtml(row[tenIndex] || "")}" readonly></td>
            <td><input data-order-field="don_gia" type="text" value="${escapeHtml(formatDisplayNumber(row[donGiaIndex]) || "")}" readonly></td>
            <td><input data-order-field="slg" type="text" value="${escapeHtml(row[slgIndex] || "")}" oninput="recalculateDonHangItems(this)"></td>
            <td><input data-order-field="thanh_tien" type="text" value="${escapeHtml(formatDisplayNumber(row[thanhTienIndex]) || "")}" readonly></td>
            <td><input data-order-field="chiet_khau" type="text" value="${escapeHtml(row[chietKhauIndex] || "")}" oninput="recalculateDonHangItems(this)" placeholder="%"></td>
            <td><input data-order-field="tien_chiet_khau" type="text" value="${escapeHtml(formatDisplayNumber(row[tienChietKhauIndex]) || "")}" oninput="recalculateDonHangItems(this)" onblur="this.value = formatDisplayNumber(this.value) || ''"></td>
            <td><input data-order-field="tien_hang" type="text" value="${escapeHtml(formatDisplayNumber(row[tienHangIndex]) || "")}" readonly></td>
            <td><button type="button" class="icon-btn" onclick="removeDonHangItem(this)" title="Xóa sản phẩm"><i data-lucide="trash-2" style="width:16px;"></i></button></td>
        </tr>
    `;
}

async function openDonHangForm(mdh = null) {
    await Promise.all([loadDsSpOptions(), loadNppOptions()]);
    const mdhIndex = getHeaderIndex("mdh", "DON_HANG");
    const rows = mdh ? allData.filter(row => String(row[mdhIndex] || "").trim() === mdh) : [];
    document.getElementById("editingSheetRow").value = rows.map(row => row._sheetRow).join(",");
    document.getElementById("productModalTitle").innerText = rows.length ? `Sửa đơn hàng ${mdh}` : "Thêm mới Đơn hàng";
    document.getElementById("deleteBtn").style.display = rows.length ? "inline-flex" : "none";
    renderDonHangForm(rows);
    document.getElementById("productModal").classList.add("active");
    document.getElementById("donHangMdh")?.focus();
    lucide.createIcons();
}

function generateQuickMdh() {
    const input = document.getElementById("donHangMdh");
    if (input) input.value = randomCode(10);
}

function addDonHangItem() {
    const body = document.getElementById("donHangItemsBody");
    const index = body.querySelectorAll("tr").length;
    body.insertAdjacentHTML("beforeend", renderDonHangItemRow([], index));
    lucide.createIcons();
}

function removeDonHangItem(button) {
    const row = button.closest("tr");
    if (row && document.querySelectorAll("#donHangItemsBody tr").length > 1) row.remove();
    recalculateDonHangItems();
}

function updateDonHangProduct(input) {
    const product = getDsSpById(input.value);
    const row = input.closest("tr");
    if (!row) return;
    row.querySelector('[data-order-field="ten"]').value = product?.ten || "";
    row.querySelector('[data-order-field="don_gia"]').value = product?.gia ? formatDisplayNumber(product.gia) : "";
    recalculateDonHangItems();
}

function recalculateDonHangItems(triggerInput = null) {
    let total = 0;
    document.querySelectorAll("#donHangItemsBody tr").forEach(row => {
        const donGiaInput = row.querySelector('[data-order-field="don_gia"]');
        const slgInput = row.querySelector('[data-order-field="slg"]');
        const thanhTienInput = row.querySelector('[data-order-field="thanh_tien"]');
        const chietKhauInput = row.querySelector('[data-order-field="chiet_khau"]');
        const tienChietKhauInput = row.querySelector('[data-order-field="tien_chiet_khau"]');
        const tienHangInput = row.querySelector('[data-order-field="tien_hang"]');
        
        const lineThanhTien = Math.round(parseMoney(donGiaInput?.value) * parseMoney(slgInput?.value) * 100) / 100;
        if (thanhTienInput) thanhTienInput.value = formatDisplayNumber(lineThanhTien) || "";
        
        let chietKhauPercent = parseMoney(chietKhauInput?.value);
        let tienChietKhau = parseMoney(tienChietKhauInput?.value);
        
        if (triggerInput && triggerInput === chietKhauInput) {
            if (chietKhauInput.value.trim() === "") {
                tienChietKhau = 0;
                if (tienChietKhauInput) tienChietKhauInput.value = "";
            } else {
                tienChietKhau = Math.round(lineThanhTien * (chietKhauPercent / 100) * 100) / 100;
                if (tienChietKhauInput) tienChietKhauInput.value = formatDisplayNumber(tienChietKhau) || "0";
            }
        } else if (triggerInput && triggerInput === tienChietKhauInput) {
            if (tienChietKhauInput.value.trim() === "") {
                chietKhauPercent = 0;
                if (chietKhauInput) chietKhauInput.value = "";
            } else {
                chietKhauPercent = lineThanhTien ? Math.round((tienChietKhau / lineThanhTien) * 100 * 100) / 100 : 0;
                if (chietKhauInput) chietKhauInput.value = chietKhauPercent || 0;
            }
        } else {
            if (chietKhauInput && chietKhauInput.value.trim() !== "") {
                tienChietKhau = Math.round(lineThanhTien * (chietKhauPercent / 100) * 100) / 100;
                if (tienChietKhauInput) tienChietKhauInput.value = formatDisplayNumber(tienChietKhau) || "0";
            } else if (tienChietKhauInput && tienChietKhauInput.value.trim() !== "") {
                chietKhauPercent = lineThanhTien ? Math.round((tienChietKhau / lineThanhTien) * 100 * 100) / 100 : 0;
                if (chietKhauInput) chietKhauInput.value = chietKhauPercent || 0;
                if (tienChietKhauInput) tienChietKhauInput.value = formatDisplayNumber(tienChietKhau) || "0";
            } else {
                tienChietKhau = 0;
            }
        }
        
        const lineTienHang = Math.round((lineThanhTien - tienChietKhau) * 100) / 100;
        if (tienHangInput) tienHangInput.value = formatDisplayNumber(lineTienHang) || "";
        total += lineTienHang || 0;
    });
    const totalEl = document.getElementById("donHangTotal");
    if (totalEl) totalEl.innerText = formatDisplayNumber(total);
}

function renderOptionButtons(fieldId, value, options) {
    return `
        <div class="option-buttons" data-option-field="${escapeHtml(fieldId)}">
            <input id="${escapeHtml(fieldId)}" type="hidden" value="${escapeHtml(value)}">
            ${options.map(option => `<button type="button" class="${String(value).toLowerCase() === option.toLowerCase() ? "active" : ""}" onclick="setOptionButtonValue(this, '${escapeJsString(option)}')">${escapeHtml(option)}</button>`).join("")}
        </div>
    `;
}

function setOptionButtonValue(button, value) {
    const group = button.closest(".option-buttons");
    if (!group) return;
    const input = group.querySelector("input");
    if (input) input.value = value;
    group.querySelectorAll("button").forEach(item => item.classList.toggle("active", item === button));
}

function renderFormFields(row = null) {
    const container = document.getElementById("formFields");
    const textareaHeaders = getModuleConfig().textareaHeaders || [];
    const statusOptions = getModuleConfig().statusOptions || [];
    container.innerHTML = getHeaders().map((header, index) => {
        const rawValue = row?.[index] ?? (header === "id" ? generateNextId() : (header === "ngay" ? new Date().toISOString().slice(0, 10) : ""));
        const value = escapeHtml(rawValue);
        if (header === "id") {
            const readonly = row && currentModule !== "DS_SP" ? "readonly" : "";
            return `<label><span>${escapeHtml(header.toUpperCase())}</span><input id="formField_${index}" type="text" value="${value}" ${readonly}></label>`;
        }
        if ((currentModule === "CONG_VIEC" && header === "tinh_trang") || (currentModule === "CONG_NO" && header === "truong")) {
            const optionValue = currentModule === "CONG_NO" && !rawValue ? "THU" : rawValue;
            return `<label class="wide-field"><span>${escapeHtml(header.toUpperCase())}</span>${renderOptionButtons(`formField_${index}`, optionValue, statusOptions)}</label>`;
        }
        if (currentModule === "CONG_NO" && header === "npp") {
            return `<label><span>NPP</span><select id="formField_${index}">
                <option value=""></option>
                ${nppOptions.map(item => `<option value="${escapeHtml(item.id)}" ${String(rawValue) === item.id ? "selected" : ""}>${escapeHtml(item.id)}${item.ten ? ` - ${escapeHtml(item.ten)}` : ""}</option>`).join("")}
            </select></label>`;
        }
        if (textareaHeaders.includes(header)) {
            return `<label class="wide-field"><span>${escapeHtml(header.toUpperCase())}</span><textarea id="formField_${index}" rows="4">${value}</textarea></label>`;
        }
        if (currentModule === "NPP" && header === "hoa_hong") {
            return `<label><span>HOA_HONG (%)</span><input id="formField_${index}" type="number" min="0.001" max="100" step="0.001" value="${value}"></label>`;
        }
        if (currentModule === "CONG_NO" && header === "so_tien") {
            return `<label><span>SO_TIEN</span><input id="formField_${index}" type="number" min="0" step="1" value="${value}"></label>`;
        }
        const type = header.includes("ngay") ? "date" : "text";
        const readonly = (currentModule === "DON_HANG" && header === "thanh_tien") || (currentModule === "CONG_NO" && header === "cong_no_con_lai") ? "readonly" : "";
        return `<label><span>${escapeHtml(header.toUpperCase())}</span><input id="formField_${index}" type="${type}" value="${value}" ${readonly}></label>`;
    }).join("");
}

function recalculateDonHangForm() {
    if (currentModule !== "DON_HANG") return;
    const headers = getHeaders();
    const donGiaIndex = headers.indexOf("don_gia");
    const slgIndex = headers.indexOf("slg");
    const thanhTienIndex = headers.indexOf("thanh_tien");
    if (donGiaIndex < 0 || slgIndex < 0 || thanhTienIndex < 0) return;
    const donGia = parseMoney(document.getElementById(`formField_${donGiaIndex}`)?.value);
    const slg = parseMoney(document.getElementById(`formField_${slgIndex}`)?.value);
    const input = document.getElementById(`formField_${thanhTienIndex}`);
    if (input) input.value = donGia && slg ? String(Math.round(donGia * slg * 100) / 100) : "";
}

async function openRecordForm(rowIndex = null) {
    if (currentModule === "DON_HANG") {
        await openDonHangForm(null);
        return;
    }
    if (currentModule === "CONG_NO") await loadNppOptions();
    const row = rowIndex === null ? null : filteredData[rowIndex];
    document.getElementById("editingSheetRow").value = row?._sheetRow || "";
    document.getElementById("productModalTitle").innerText = row
        ? `Sửa ${getModuleConfig().label}`
        : `Thêm mới ${getModuleConfig().label}`;
    document.getElementById("deleteBtn").style.display = row ? "inline-flex" : "none";
    renderFormFields(row);
    document.getElementById("formFields").oninput = recalculateDonHangForm;
    recalculateDonHangForm();
    document.getElementById("productModal").classList.add("active");
    document.getElementById("formField_1")?.focus();
}

function closeProductForm() {
    document.getElementById("productModal").classList.remove("active");
    document.getElementById("formFields").oninput = null;
}

async function saveRecordFromForm(event) {
    event.preventDefault();
    if (currentModule === "DON_HANG") {
        await saveDonHangForm();
        return;
    }
    recalculateDonHangForm();
    let row = getHeaders().map((_, index) => document.getElementById(`formField_${index}`)?.value.trim() || "");
    if (currentModule === "NPP") {
        const commissionIndex = getHeaderIndex("hoa_hong", "NPP");
        if (commissionIndex >= 0 && row[commissionIndex]) {
            row[commissionIndex] = clampCommissionPercent(row[commissionIndex]);
        }
    }
    if (currentModule === "CONG_NO") {
        const balanceIndex = getHeaderIndex("cong_no_con_lai", "CONG_NO");
        if (balanceIndex >= 0) row[balanceIndex] = "";
    }
    if (!row[0]) row[0] = generateNextId();

    const editingSheetRow = Number(document.getElementById("editingSheetRow").value);
    const oldRow = editingSheetRow ? allData.find(item => Number(item._sheetRow) === editingSheetRow) : null;
    const oldDsSpId = currentModule === "DS_SP" ? getRowId(oldRow) : "";
    const existing = allData.find(item => getRowId(item) === row[0] && Number(item._sheetRow) !== editingSheetRow);
    if (existing) {
        alert(`ID "${row[0]}" đã tồn tại trong module ${currentModule}.`);
        return;
    }

    showLoading("Đang lưu dữ liệu...");
    try {
        if (editingSheetRow) {
            await writeRecordRow(row, editingSheetRow);
        } else {
            await appendRecordRows([row]);
        }
        if (currentModule === "DS_SP" && editingSheetRow && oldDsSpId && oldDsSpId !== row[0]) {
            await updateDonHangProductId(oldDsSpId, row[0]);
        }
        closeProductForm();
        await fetchData();
        filterTable();
    } catch (err) {
        console.error(err);
        alert("Không lưu được dữ liệu: " + err.message);
    } finally {
        hideLoading();
    }
}

async function saveDonHangForm() {
    recalculateDonHangItems();
    const ngay = String(document.getElementById("donHangNgay")?.value || "").trim();
    const mdh = String(document.getElementById("donHangMdh")?.value || "").trim();
    const npp = String(document.getElementById("donHangNpp")?.value || "").trim();
    if (!ngay) {
        alert("Vui lòng chọn ngày.");
        return;
    }
    if (!mdh) {
        alert("Vui lòng nhập MDH.");
        return;
    }
    if (!npp) {
        alert("Vui lòng chọn NPP.");
        return;
    }

    const rows = [...document.querySelectorAll("#donHangItemsBody tr")].map(item => {
        const id = String(item.querySelector('[data-order-field="id"]')?.value || "").trim() || generateNextId();
        const idSp = String(item.querySelector('[data-order-field="id_sp"]')?.value || "").trim();
        const ten = String(item.querySelector('[data-order-field="ten"]')?.value || "").trim();
        const donGia = String(item.querySelector('[data-order-field="don_gia"]')?.value || "").trim();
        const slg = String(item.querySelector('[data-order-field="slg"]')?.value || "").trim();
        const thanhTien = String(item.querySelector('[data-order-field="thanh_tien"]')?.value || "").trim();
        const chietKhau = String(item.querySelector('[data-order-field="chiet_khau"]')?.value || "").trim();
        const tienChietKhau = String(item.querySelector('[data-order-field="tien_chiet_khau"]')?.value || "").trim();
        const tienHang = String(item.querySelector('[data-order-field="tien_hang"]')?.value || "").trim();
        return [id, ngay, mdh, npp, idSp, ten, donGia, slg, thanhTien, chietKhau, tienChietKhau, tienHang];
    }).filter(row => row[4] && parseMoney(row[7]) > 0);

    if (!rows.length) {
        alert("Vui lòng thêm ít nhất một sản phẩm và nhập số lượng.");
        return;
    }

    const oldRows = document.getElementById("editingSheetRow").value
        .split(",")
        .map(value => Number(value))
        .filter(Boolean);

    showLoading("Đang lưu đơn hàng...");
    try {
        if (oldRows.length) await deleteRecordRows(oldRows);
        await appendRecordRows(rows);
        closeProductForm();
        await fetchData();
        filterTable();
    } catch (err) {
        console.error(err);
        alert("Không lưu được đơn hàng: " + err.message);
    } finally {
        hideLoading();
    }
}

async function deleteCurrentRecord() {
    if (currentModule === "DON_HANG") {
        const sheetRows = document.getElementById("editingSheetRow").value
            .split(",")
            .map(value => Number(value))
            .filter(Boolean);
        if (!sheetRows.length) return;
        if (!confirm(`Xóa đơn hàng ${currentDonHangMdh || ""}?`)) return;
        showLoading("Đang xóa đơn hàng...");
        try {
            await deleteRecordRows(sheetRows);
            closeProductForm();
            await fetchData();
            filterTable();
        } catch (err) {
            console.error(err);
            alert("Không xóa được đơn hàng: " + err.message);
        } finally {
            hideLoading();
        }
        return;
    }
    const sheetRow = Number(document.getElementById("editingSheetRow").value);
    if (!sheetRow) return;
    if (!confirm(`Xóa dòng này khỏi module ${currentModule}?`)) return;
    showLoading("Đang xóa dữ liệu...");
    try {
        await deleteRecordRow(sheetRow);
        closeProductForm();
        await fetchData();
        filterTable();
    } catch (err) {
        console.error(err);
        alert("Không xóa được dữ liệu: " + err.message);
    } finally {
        hideLoading();
    }
}

function readExcelRows(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => {
            try {
                const workbook = XLSX.read(new Uint8Array(event.target.result), { type: "array" });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
                const firstRow = rows[0] || [];
                const currentHeaders = getHeaders().map(header => header.toLowerCase());
                const fileHeaders = firstRow.map(cell => String(cell || "").trim().toLowerCase());
                const hasHeader = currentHeaders.some(header => fileHeaders.includes(header));
                resolve(hasHeader ? rows.slice(1) : rows);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = () => reject(new Error(`Không thể đọc file ${file.name}`));
        reader.readAsArrayBuffer(file);
    });
}

async function handleFileUpload(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    await processFiles(files);
    event.target.value = "";
}

async function processFiles(files) {
    const excelFiles = files.filter(file => /\.(xlsx|xls|csv)$/i.test(file.name));
    if (!excelFiles.length) {
        alert("Vui lòng tải lên file Excel hoặc CSV.");
        return;
    }
    if (!confirm(`Thêm dữ liệu từ ${excelFiles.length} file vào module ${currentModule}?`)) return;

    showLoading("Đang xử lý file và cập nhật Google Sheets...");
    try {
        const rowsFromFiles = await Promise.all(excelFiles.map(readExcelRows));
        const generatedIds = [];
        const rows = rowsFromFiles
            .flat()
            .map(row => getHeaders().map((_, index) => row[index] ?? ""))
            .filter(row => row.some(cell => String(cell || "").trim()))
            .map(row => {
                if (!String(row[0] || "").trim()) {
                    row[0] = generateNextId(generatedIds);
                    generatedIds.push(row[0]);
                }
                return row;
            });
        if (!rows.length) throw new Error("Không có dòng dữ liệu hợp lệ để tải lên.");
        await appendRecordRows(rows);
        await fetchData();
        filterTable();
        alert(`Đã thêm ${rows.length} dòng vào module ${currentModule}.`);
    } catch (err) {
        console.error(err);
        alert("Lỗi khi tải dữ liệu: " + err.message);
    } finally {
        hideLoading();
    }
}

function initModalDismiss() {
    const modalMask = document.getElementById("productModal");
    modalMask.addEventListener("mousedown", event => {
        if (event.target === modalMask) closeProductForm();
    });
    document.addEventListener("mousedown", event => {
        if (!modalMask.classList.contains("active")) return;
        if (event.target.closest(".modal")) return;
        closeProductForm();
    });
}

function getStoredUser() {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (_) {
        return null;
    }
}

function saveStoredUser(user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

function clearStoredUser() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
}

function showLogin() {
    document.getElementById("authScreen").style.display = "grid";
    document.querySelector(".app-shell").style.display = "none";
    hideLoading();
    document.getElementById("loginId")?.focus();
}

function showApp() {
    document.getElementById("authScreen").style.display = "none";
    document.querySelector(".app-shell").style.display = "";
    renderCurrentUser();
}

function renderCurrentUser() {
    const panel = document.getElementById("userPanel");
    if (!panel || !currentUser) return;
    const avatar = currentUser.hinh_anh
        ? `<img src="${escapeHtml(currentUser.hinh_anh)}" alt="">`
        : `<div class="user-avatar-fallback">${escapeHtml(String(currentUser.ho_ten || currentUser.id || "?").slice(0, 1).toUpperCase())}</div>`;
    panel.innerHTML = `
        ${avatar}
        <div class="user-info">
            <strong>${escapeHtml(currentUser.ho_ten || currentUser.id)}</strong>
            <span>${escapeHtml(currentUser.quyen || "")}</span>
        </div>
        <button type="button" class="icon-btn" onclick="logout()" title="Đăng xuất">
            <i data-lucide="log-out" style="width:16px;"></i>
        </button>
    `;
    lucide.createIcons();
}

async function loadNhanVienRows() {
    const rows = await loadModuleRows("DSNV");
    const headers = getHeaders("DSNV");
    return rows.map(row => Object.fromEntries(headers.map((header, index) => [header, String(row[index] || "").trim()])));
}

async function handleLogin(event) {
    event.preventDefault();
    const id = String(document.getElementById("loginId").value || "").trim();
    const mk = String(document.getElementById("loginPassword").value || "").trim();
    const remember = document.getElementById("rememberLogin")?.checked ?? true;
    const errorEl = document.getElementById("loginError");
    if (errorEl) errorEl.innerText = "";
    if (!id || !mk) {
        if (errorEl) errorEl.innerText = "Vui lòng nhập tên đăng nhập và mật khẩu.";
        return;
    }

    showLoading("Đang đăng nhập...");
    try {
        const users = await loadNhanVienRows();
        const user = users.find(item => item.id === id && item.mk === mk);
        if (!user) {
            if (errorEl) errorEl.innerText = "Sai tên đăng nhập hoặc mật khẩu.";
            return;
        }
        currentUser = {
            id: user.id,
            ho_ten: user.ho_ten,
            hinh_anh: user.hinh_anh,
            gioi_tinh: user.gioi_tinh,
            ngay_sinh: user.ngay_sinh,
            quyen: user.quyen
        };
        if (remember) saveStoredUser(currentUser);
        showApp();
        await startApp();
    } catch (err) {
        console.error(err);
        if (errorEl) errorEl.innerText = "Không đăng nhập được: " + err.message;
    } finally {
        hideLoading();
    }
}

function logout() {
    currentUser = null;
    clearStoredUser();
    showLogin();
}

async function startApp() {
    document.title = CONFIG.appName;
    document.getElementById("pageTitle").innerText = CONFIG.appName;
    
    try {
        const saved = sessionStorage.getItem(MODULE_STORAGE_KEY);
        if (CONFIG.modules[saved] && !CONFIG.modules[saved].hidden) currentModule = saved;
        const savedCongViecView = sessionStorage.getItem("kieuDucCongViecView");
        if (["table", "kanban"].includes(savedCongViecView)) congViecView = savedCongViecView;
    } catch (_) { }
    updateModuleTitle();
    renderTabs();
    updateModuleActions();
    lucide.createIcons();
    await renderFilterPanel();
    await fetchData();
}

async function init() {
    initModalDismiss();
    currentUser = getStoredUser();
    if (currentUser?.id) {
        showApp();
        await startApp();
        return;
    }
    showLogin();
}

init();


// --- MODULE ĐỊNH VỊ ---
let mapInstance = null;
let markerInstance = null;
let historyPolyline = null;
let trackingWatchId = null;
let lastLocation = null;

let autoStartedTracking = false;

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
    document.getElementById("tableWrapper").style.display = "none";
    document.getElementById("kanbanBoard").style.display = "none";
    document.getElementById("headerActions").style.display = "none";
    document.getElementById("filterPanel").style.display = "none";
    document.getElementById("pagination").style.display = "none";
    
    document.getElementById("mapContainer").style.display = "block";
    
    if (!mapInstance) {
        mapInstance = L.map('map').setView([21.028511, 105.804817], 13);
        
        let customMarker = null;
        let customMarkerLocation = null;
        
        mapInstance.on('contextmenu', function(e) {
            if (customMarker) {
                mapInstance.removeLayer(customMarker);
            }
            customMarkerLocation = e.latlng;
            
            const popupContent = `
                <div style="text-align: center; font-family: 'Inter', sans-serif;">
                    <p style="margin: 0 0 10px 0; font-weight: bold; font-size: 14px;">Đã đánh dấu vị trí</p>
                    <button onclick="triggerMapMarkerPhotoUpload()" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 4px; margin: 0 auto;"><i data-lucide="camera" style="width:14px;height:14px;margin-bottom:-3px;"></i> Tải / Chụp ảnh</button>
                </div>
            `;
            
            customMarker = L.marker(e.latlng).addTo(mapInstance)
                .bindPopup(popupContent)
                .openPopup();
            
            if (window.lucide) lucide.createIcons();
        });
        
        window.customMarkerRef = () => customMarker;
        window.customMarkerLoc = () => customMarkerLocation;
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance);
    }
    
    // Set default date to today
    if(!document.getElementById("historyDate").value) {
        const todayStr = new Date().toISOString().split('T')[0];
        document.getElementById("historyDate").value = todayStr;
    }
    
    // Auto load history removed
}

function padZero(num) {
    return num < 10 ? '0' + num : num;
}

function formatDateToDDMMYYYY(dateObj) {
    return padZero(dateObj.getDate()) + "/" + padZero(dateObj.getMonth() + 1) + "/" + dateObj.getFullYear();
}

function formatDateTimeToDDMMYYYYHHMMSS(dateObj) {
    return formatDateToDDMMYYYY(dateObj) + " " + padZero(dateObj.getHours()) + ":" + padZero(dateObj.getMinutes()) + ":" + padZero(dateObj.getSeconds());
}

async function appendLocationToSheet(lat, lng) {
    if (!currentUser) {
        console.error("Lỗi: currentUser bị null.");
        return;
    }
    const now = new Date();
    const id = 'LOC' + now.getTime();
    const id_nv = currentUser.id || currentUser.ho_ten || "Unknown";
    const ngay = formatDateToDDMMYYYY(now);
    const ngay_h = formatDateTimeToDDMMYYYYHHMMSS(now);
    const mapStr = lat + "," + lng;
    
    const row = [id, id_nv, ngay, ngay_h, mapStr];
    const range = `${quoteSheetName("VI_TRI")}!A2`;
    await sheetsFetch(`/values/${encodeURIComponent(range)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
        method: "POST",
        body: JSON.stringify({ values: [row] })
    });
}

let trackingIntervalId = null;
let lastSavedLocation = null;

// Hàm tính khoảng cách giữa 2 tọa độ (mét)
function getDistanceInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Bán kính Trái Đất (mét)
    const p1 = lat1 * Math.PI/180;
    const p2 = lat2 * Math.PI/180;
    const dp = (lat2-lat1) * Math.PI/180;
    const dl = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(dp/2) * Math.sin(dp/2) +
            Math.cos(p1) * Math.cos(p2) *
            Math.sin(dl/2) * Math.sin(dl/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Khoảng cách mét
}

function toggleTracking() {
    const btn = document.getElementById("toggleTrackingBtn");
    if (trackingWatchId) {
        if (window.Capacitor && window.Capacitor.Plugins.BackgroundGeolocation && typeof trackingWatchId === 'string') {
            window.Capacitor.Plugins.BackgroundGeolocation.removeWatcher({ id: trackingWatchId });
        } else {
            navigator.geolocation.clearWatch(trackingWatchId);
        }
        trackingWatchId = null;
        if (trackingIntervalId) {
            clearInterval(trackingIntervalId);
            trackingIntervalId = null;
        }
        btn.innerHTML = `<i data-lucide="navigation"></i>`; btn.title = "Bắt đầu Định vị"; if(window.lucide) lucide.createIcons();
        btn.classList.remove("danger-btn");
        btn.classList.add("primary-btn");
        alert("Đã tắt theo dõi vị trí.");
    } else {
        if (!navigator.geolocation) {
            alert("Trình duyệt không hỗ trợ Geolocation.");
            return;
        }
        btn.innerHTML = `<i data-lucide="loader"></i>`; btn.title = "Đang lấy vị trí..."; if(window.lucide) lucide.createIcons();
        btn.classList.remove("primary-btn");
        btn.classList.add("danger-btn");
        
        
        if (window.Capacitor && window.Capacitor.Plugins.BackgroundGeolocation) {
            btn.innerHTML = `<i data-lucide="stop-circle"></i>`; btn.title = "Dừng Định vị"; btn.classList.add("danger-btn"); if(window.lucide) lucide.createIcons();
            startCapacitorBackgroundTracking();
            return;
        }
        
        trackingWatchId = navigator.geolocation.watchPosition((position) => {
            btn.innerHTML = `<i data-lucide="stop-circle"></i>`; btn.title = "Dừng Định vị"; btn.classList.add("danger-btn"); if(window.lucide) lucide.createIcons();
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Update marker
            if (!markerInstance) {
                markerInstance = L.marker([lat, lng]).addTo(mapInstance);
                mapInstance.setView([lat, lng], 16);
            } else {
                markerInstance.setLatLng([lat, lng]);
            }
            
            // Just update lastLocation, the interval will handle saving
            lastLocation = { lat, lng, time: Date.now() };
        }, (err) => {
            alert("Lỗi định vị: " + err.message);
            toggleTracking(); // Stop tracking on error
        }, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
        
        trackingIntervalId = setInterval(async () => {
            if (lastLocation) {
                // Kiểm tra xem đã di chuyển >= 15 mét chưa
                if (lastSavedLocation) {
                    const distance = getDistanceInMeters(lastLocation.lat, lastLocation.lng, lastSavedLocation.lat, lastSavedLocation.lng);
                    if (distance < 15) {
                        console.log("Bỏ qua lưu vì chỉ di chuyển " + Math.round(distance) + "m (dưới 15m).");
                        return; // Chưa đủ 15m, không lưu
                    }
                }
                
                try {
                    await appendLocationToSheet(lastLocation.lat, lastLocation.lng);
                    lastSavedLocation = { lat: lastLocation.lat, lng: lastLocation.lng };
                    console.log("Đã lưu vị trí mới thành công.");
                } catch(e) {
                    console.error("Lỗi lưu vị trí tự động:", e);
                    if (e.message && e.message.includes("Unable to parse range")) {
                        alert("LỖI: Không tìm thấy tab nào tên là 'VI_TRI' trong Google Sheet. Vui lòng tạo tab 'VI_TRI' nhé!");
                        toggleTracking(); // Stop tracking
                    }
                }
            }
        }, 60000); // 60 seconds (1 phút) // 15 seconds
    }
}

// Map Address Search using Nominatim
async function searchMapAddress() {
    const address = document.getElementById("searchAddress").value.trim();
    if (!address) return;
    
    showLoading("Đang tìm địa chỉ...");
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        const data = await response.json();
        hideLoading();
        
        if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            mapInstance.setView([lat, lon], 16);
            
            // Add a temporary marker for the search result
            L.marker([lat, lon]).addTo(mapInstance)
                .bindPopup("Kết quả: " + data[0].display_name)
                .openPopup();
        } else {
            alert("Không tìm thấy địa chỉ này.");
        }
    } catch (err) {
        hideLoading();
        console.error("Lỗi tìm kiếm địa chỉ:", err);
        alert("Lỗi khi tìm kiếm địa chỉ.");
    }
}

// Load Other Users' Locations
let otherUserMarkers = [];
async function loadOthersLocations() {
    if (!mapInstance) return;
    if (otherUserMarkers && otherUserMarkers.length > 0) {
        for (const marker of otherUserMarkers) {
            mapInstance.removeLayer(marker);
        }
        otherUserMarkers = [];
        return;
    }
    showLoading("Đang tải vị trí mọi người...");
    try {
        const rangeStr = `${quoteSheetName("VI_TRI")}!A2:E`;
        const data = await sheetsFetch(`/values/${encodeURIComponent(rangeStr)}`);
        const rows = data.values || [];
        const myId = currentUser?.id || currentUser?.ho_ten || "Unknown";
        
        // Group by id_nv to get latest location for each user
        const latestLocations = {};
        
        // rows are assumed to be appended chronologically, so we just iterate and overwrite
        for (const r of rows) {
            // [id, id_nv, ngay, ngay_h, map]
            const id_nv = r[1];
            const datetimeStr = r[3];
            const coordsStr = r[4];
            
            if (id_nv && id_nv !== myId && coordsStr) {
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
                .bindTooltip(`<b>${id_nv}</b><br>Cập nhật: ${loc.time}`, { permanent: true, direction: "top", opacity: 0.8 });
            otherUserMarkers.push(marker);
        }
        
        hideLoading();
        /* alert removed */
        
    } catch (err) {
        hideLoading();
        console.error("Lỗi tải vị trí mọi người:", err);
        /* alert removed */
    }
}

async function loadHistory() {
    if (!mapInstance) return;
    let dateInput = document.getElementById("historyDate").value;
    
    // Nếu chưa chọn ngày, tự động lấy ngày hôm nay
    if (!dateInput) {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        dateInput = `${yyyy}-${mm}-${dd}`;
        document.getElementById("historyDate").value = dateInput;
    }
    
    // Convert YYYY-MM-DD to DD/MM/YYYY
    const parts = dateInput.split('-');
    if (parts.length !== 3) return;
    const formattedDate = parts[2] + "/" + parts[1] + "/" + parts[0];
    
    showLoading("Đang tải lịch sử...");
    try {
        const rangeStr = `${quoteSheetName("VI_TRI")}!A2:E`;
        const data = await sheetsFetch(`/values/${encodeURIComponent(rangeStr)}`);
        const rows = data.values || [];
        const myIdStr = String(currentUser?.id || currentUser?.ho_ten || "Unknown").trim();
        
        const historyPoints = [];
        for (const r of rows) {
            // [id, id_nv, ngay, ngay_h, map]
            const rId = String(r[1] || "").trim();
            const rNgay = String(r[2] || "").trim();
            
            if (rId === myIdStr && rNgay === formattedDate && r[4]) {
                const coords = r[4].split(',');
                if (coords.length === 2) {
                    historyPoints.push([parseFloat(coords[0]), parseFloat(coords[1])]);
                }
            }
        }
        
        // Check if same date and history is already shown -> toggle off
        if (historyPolyline && window._lastHistoryDate === formattedDate) {
            mapInstance.removeLayer(historyPolyline);
            historyPolyline = null;
            window._lastHistoryDate = null;
            hideLoading();
            return; // Đã xoá lịch sử (Toggle off)
        }

        if (historyPolyline) {
            mapInstance.removeLayer(historyPolyline);
        }
        
        hideLoading();
        if (historyPoints.length > 0) {
            historyPolyline = L.polyline(historyPoints, {color: 'red', weight: 4}).addTo(mapInstance);
            mapInstance.fitBounds(historyPolyline.getBounds());
            window._lastHistoryDate = formattedDate;
            /* alert removed */
        } else {
            /* alert removed */
        }
        
    } catch (err) {
        hideLoading();
        console.error("Lỗi xem lịch sử:", err);
        alert("Lỗi khi tải lịch sử: " + err.message);
    }
}

// --- TÍNH NĂNG CHỤP ẢNH ---
let photoMarkers = [];

function triggerCamera() {
    if (!lastLocation) {
        alert("Chưa có thông tin vị trí! Vui lòng 'Bắt đầu Định vị' và chờ lấy vị trí trước khi chụp ảnh.");
        return;
    }
    document.getElementById('cameraInput').click();
}

async function handleCameraUpload(event) {
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
        const range = `${quoteSheetName("ANH_CHUP")}!A2`;
        await sheetsFetch(`/values/${encodeURIComponent(range)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
            method: "POST",
            body: JSON.stringify({ values: [row] })
        });
        
        hideLoading();
        alert("Lưu ảnh thành công tại vị trí hiện tại!");
        
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
}

async function viewPhotos() {
    if (!mapInstance) return;
    if (photoMarkers && photoMarkers.length > 0) {
        for (const marker of photoMarkers) {
            mapInstance.removeLayer(marker);
        }
        photoMarkers = [];
        return;
    }
    showLoading("Đang tải danh sách ảnh...");
    try {
        const range = `${quoteSheetName("ANH_CHUP")}!A2:F`;
        const data = await sheetsFetch(`/values/${encodeURIComponent(range)}`);
        const rows = data.values || [];
        
        // Xóa cờ ảnh cũ
        for (const marker of photoMarkers) {
            mapInstance.removeLayer(marker);
        }
        photoMarkers = [];
        
        // Nhóm ảnh theo vị trí
        const locationGroups = {};
        
        for (const r of rows) {
            // [id, id_nv, ngay, ngay_h, map, anh]
            const id_nv = r[1] || "Unknown";
            const time = r[3] || "";
            const coordsStr = r[4];
            const imgUrl = r[5];
            
            if (coordsStr && imgUrl) {
                const coords = coordsStr.split(',');
                if (coords.length === 2) {
                    const lat = parseFloat(coords[0]);
                    const lng = parseFloat(coords[1]);
                    // Làm tròn toạ độ để nhóm các ảnh chụp cùng 1 chỗ (sai số nhỏ)
                    const key = lat.toFixed(4) + "," + lng.toFixed(4);
                    
                    if (!locationGroups[key]) {
                        locationGroups[key] = {
                            lat: lat,
                            lng: lng,
                            photos: []
                        };
                    }
                    locationGroups[key].photos.push({ id_nv, time, url: imgUrl });
                }
            }
        }
        
        // Icon đặc biệt cho ảnh
        const photoIcon = L.divIcon({
            html: '<div style="font-size: 24px;">🖼️</div>',
            className: 'photo-marker',
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24]
        });
        
        let count = 0;
        for (const key in locationGroups) {
            const group = locationGroups[key];
            count += group.photos.length;
            
            // Xây dựng nội dung HTML cho popup hiển thị nhiều ảnh
            let popupHtml = `<div style="max-height: 300px; overflow-y: auto; text-align: center; width: 220px;">`;
            popupHtml += `<h4 style="margin-top:0;">${group.photos.length} ảnh tại đây</h4>`;
            
            for (const p of group.photos) {
                popupHtml += `<div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee;">`;
                popupHtml += `<a href="${p.url}" target="_blank"><img src="${p.url}" style="width: 200px; border-radius: 4px; border: 1px solid #ccc; cursor: zoom-in;" /></a>`;
                popupHtml += `<div style="font-size: 11px; margin-top: 4px;"><b>${p.id_nv}</b> - ${p.time}</div>`;
                popupHtml += `</div>`;
            }
            popupHtml += `</div>`;
            
            const marker = L.marker([group.lat, group.lng], { icon: photoIcon }).addTo(mapInstance)
                .bindPopup(popupHtml, { maxWidth: 250 });
            photoMarkers.push(marker);
        }
        
        hideLoading();
        if (count > 0) {
            /* alert removed */
        } else {
            /* alert removed */
        }
        
    } catch (err) {
        hideLoading();
        console.error("Lỗi xem ảnh:", err);
        alert("Lỗi tải danh sách ảnh: " + err.message);
    }
}

// Capacitor Background Geolocation Integration
async function startCapacitorBackgroundTracking() {
    if (!window.Capacitor || !window.Capacitor.Plugins.BackgroundGeolocation) return false;
    
    const BackgroundGeolocation = window.Capacitor.Plugins.BackgroundGeolocation;
    
    try {
        await BackgroundGeolocation.addWatcher(
            {
                backgroundMessage: "Ứng dụng đang lấy vị trí ngầm.",
                backgroundTitle: "Kiều Đức App",
                requestPermissions: true,
                stale: false,
                distanceFilter: 15
            },
            function callback(location, error) {
                if (error) {
                    if (error.code === "NOT_AUTHORIZED") {
                        if (window.confirm("Ứng dụng cần quyền vị trí để chạy ngầm. Mở cài đặt?")) {
                            BackgroundGeolocation.openSettings();
                        }
                    }
                    return console.error(error);
                }
                
                // Update marker & location
                const lat = location.latitude;
                const lng = location.longitude;
                
                if (!markerInstance) {
                    markerInstance = L.marker([lat, lng]).addTo(mapInstance);
                    mapInstance.setView([lat, lng], 16);
                } else {
                    markerInstance.setLatLng([lat, lng]);
                }
                
                lastLocation = { lat, lng, time: Date.now() };
                
                // Save to sheet directly
                appendLocationToSheet(lat, lng).catch(console.error);
            }
        ).then(watcher_id => {
            trackingWatchId = watcher_id; // Reuse the watch id variable
            alert("Đã bật định vị chạy ngầm thành công!");
        });
        return true;
    } catch(e) {
        console.error("Lỗi Capacitor:", e);
        return false;
    }
}


function renderTrangChuModule() {
    const container = document.getElementById("homeContainer");
    if (!container) return;
    
    const modules = Object.keys(CONFIG.modules).filter(k => k !== "TRANG_CHU" && !CONFIG.modules[k].hidden);
    
    let html = `
    <div style="width: 100%; max-width: 1200px; margin: 0 auto; padding: 20px;">
        <div style="margin-bottom: 40px; text-align: center;">
            <h2 style="font-size: 28px; color: var(--primary-color); margin-bottom: 10px;">Chào mừng đến với Kiều Đức App</h2>
            <p style="color: #6b7280; font-size: 16px;">Vui lòng chọn một chức năng bên dưới để bắt đầu</p>
        </div>
        <div style="display: flex; gap: 30px; flex-wrap: wrap; justify-content: center; align-items: stretch;">`;
    
    modules.forEach(mod => {
        const conf = CONFIG.modules[mod];
        let desc = "";
        if (mod === "VI_TRI") desc = "Theo dõi vị trí hiện tại và xem lịch sử di chuyển";
        if (mod === "ANH_CHUP") desc = "Xem thư viện ảnh đã chụp tại các địa điểm";
        
        html += `
        <div class="module-card" onclick="switchModule('${mod}')" style="background: linear-gradient(145deg, #ffffff 0%, #f3f4f6 100%); border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); padding: 40px 30px; width: 320px; text-align: center; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid rgba(255,255,255,0.8); position: relative; overflow: hidden;" onmouseover="this.style.transform='translateY(-10px)'; this.style.boxShadow='0 20px 40px rgba(79, 70, 229, 0.15)'; this.style.borderColor='var(--primary-color)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 30px rgba(0,0,0,0.08)'; this.style.borderColor='rgba(255,255,255,0.8)';">
            <div style="width: 80px; height: 80px; background: rgba(79, 70, 229, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 25px auto;">
                <i data-lucide="${conf.icon}" style="width: 40px; height: 40px; color: var(--primary-color);"></i>
            </div>
            <h3 style="margin: 0 0 15px 0; font-size: 24px; color: #1f2937; font-weight: 700;">${conf.label}</h3>
            <p style="margin: 0; color: #6b7280; font-size: 15px; line-height: 1.5;">${desc}</p>
        </div>
        `;
    });
    
    html += `</div></div>`;
    container.innerHTML = html;
    
    if (window.lucide) {
        lucide.createIcons();
    }
}

function toggleSidebar() {
    const shell = document.querySelector('.app-shell');
    const isCollapsed = shell.classList.toggle('sidebar-collapsed');
    localStorage.setItem('sidebar-collapsed', isCollapsed);
    
    const icon = document.getElementById('sidebarToggleIcon');
    if (icon) {
        if (isCollapsed) {
            icon.setAttribute('data-lucide', 'panel-left-open');
        } else {
            icon.setAttribute('data-lucide', 'panel-left-close');
        }
        lucide.createIcons();
    }
    
    // Trigger map resize if map is visible
    setTimeout(() => {
        if (window.map) {
            window.map.invalidateSize();
        }
    }, 300);
}

// Restore sidebar state
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('sidebar-collapsed') === 'true') {
        const shell = document.querySelector('.app-shell');
        if (shell) shell.classList.add('sidebar-collapsed');
        const icon = document.getElementById('sidebarToggleIcon');
        if (icon) icon.setAttribute('data-lucide', 'panel-left-open');
    }
});

function toggleMapSidebar() {
    const sidebar = document.getElementById('mapRightSidebar');
    sidebar.classList.toggle('collapsed');
}

function triggerMapMarkerPhotoUpload() {
    document.getElementById('mapMarkerPhotoInput').click();
}

async function handleMapMarkerPhotoUpload(event) {
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
        alert("Đã lưu ảnh tại vị trí đánh dấu!");
        const m = window.customMarkerRef ? window.customMarkerRef() : null;
        if (m) m.closePopup();
        
    } catch (error) {
        console.error(error);
        hideLoading();
        alert("Lỗi xử lý ảnh: " + error.message);
    }
}

async function refreshOthersLocations() {
    // Only refresh if the user is currently viewing other people's locations
    if (!mapInstance || !otherUserMarkers || otherUserMarkers.length === 0) return;
    
    try {
        const rangeStr = `${quoteSheetName("VI_TRI")}!A2:E`;
        const data = await sheetsFetch(`/values/${encodeURIComponent(rangeStr)}`);
        const rows = data.values || [];
        const myId = currentUser?.id || currentUser?.ho_ten || "Unknown";
        
        const latestLocations = {};
        for (const r of rows) {
            const id_nv = r[1];
            const datetimeStr = r[3];
            const coordsStr = r[4];
            
            if (id_nv && id_nv !== myId && coordsStr) {
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
            const iconHtml = `<div style="background:#ef4444;color:#fff;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-weight:bold;border:2px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,0.3);font-size:12px;overflow:hidden;">${id_nv.substring(0,2).toUpperCase()}</div>`;
            
            const customIcon = L.divIcon({
                html: iconHtml,
                className: 'custom-leaflet-icon',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(mapInstance);
            marker.bindPopup(`<b>${id_nv}</b><br>Cập nhật: ${loc.time}`);
            otherUserMarkers.push(marker);
        }
    } catch (e) {
        console.error("Auto-refresh location failed", e);
    }
}

// Run every 30 seconds
setInterval(refreshOthersLocations, 30000);
