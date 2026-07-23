const fs = require('fs');
let app = fs.readFileSync('app.js','utf8');

const danhBaFunc = `
async function renderDanhBaModule() {
    let container = document.getElementById("danhBaContainer");
    if (!container) return;
    
    container.style.display = "block";
    container.innerHTML = \`
        <div style="max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px;">
            <div class="login-card" style="margin:0; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <h2 style="margin-bottom: 15px; font-size: 18px; color: var(--primary);">Tìm kiếm bạn bè</h2>
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="searchFriendInput" placeholder="Nhập Số điện thoại hoặc Email..." style="flex:1; padding: 10px; border-radius: 8px; border: 1px solid #ddd;">
                    <button class="primary-btn" onclick="searchFriends()" style="width: auto; padding: 0 20px;"><i data-lucide="search" style="width:18px;"></i> Tìm</button>
                </div>
                <div id="searchFriendResult" style="margin-top: 15px;"></div>
            </div>
            
            <div class="login-card" style="margin:0; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <h2 style="margin-bottom: 15px; font-size: 18px; color: var(--primary);">Lời mời kết bạn</h2>
                <div id="friendRequestsList">Đang tải...</div>
            </div>
            
            <div class="login-card" style="margin:0; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <h2 style="margin-bottom: 15px; font-size: 18px; color: var(--primary);">Danh sách bạn bè</h2>
                <div id="friendsList">Đang tải...</div>
            </div>
        </div>
    \`;
    
    if (window.lucide) lucide.createIcons();
    await loadFriendsData();
}

async function searchFriends() {
    const q = document.getElementById("searchFriendInput").value.trim().toLowerCase();
    const res = document.getElementById("searchFriendResult");
    if (!q) {
        res.innerHTML = "<span style='color:red;'>Vui lòng nhập từ khóa tìm kiếm.</span>";
        return;
    }
    
    showLoading("Đang tìm kiếm...");
    try {
        const users = await loadModuleRows("DSNV");
        const matches = users.filter(u => {
            const id = String(u[0] || "").toLowerCase();
            const sdt = String(u[8] || "").toLowerCase();
            const email = String(u[9] || "").toLowerCase();
            return (id === q || sdt === q || email === q) && id !== currentUser.id.toLowerCase();
        });
        
        if (matches.length === 0) {
            res.innerHTML = "<span style='color:var(--muted);'>Không tìm thấy người dùng nào khớp.</span>";
        } else {
            // Check current status in BAN_BE
            const banbeRows = await loadModuleRows("BAN_BE");
            let html = '<div style="display: flex; flex-direction: column; gap: 10px;">';
            
            for (const u of matches) {
                const uid = u[0];
                const name = u[1] || uid;
                
                // Find relationship
                const rel = banbeRows.find(r => 
                    (r[1] === currentUser.id && r[2] === uid) || 
                    (r[1] === uid && r[2] === currentUser.id)
                );
                
                let actionHtml = \`<button class="primary-btn" onclick="sendFriendRequest('\${escapeHtml(uid)}')" style="width:auto; padding: 6px 12px; font-size:12px;">Kết bạn</button>\`;
                if (rel) {
                    if (rel[3] === "accepted") {
                        actionHtml = \`<span style="color: green; font-size: 12px; font-weight: bold;">Đã là bạn bè</span>\`;
                    } else if (rel[3] === "pending") {
                        if (rel[1] === currentUser.id) {
                            actionHtml = \`<span style="color: var(--muted); font-size: 12px;">Đã gửi lời mời</span>\`;
                        } else {
                            actionHtml = \`<button class="primary-btn" onclick="acceptFriendRequest('\${escapeHtml(rel[0])}', \${rel._sheetRow})" style="width:auto; padding: 6px 12px; font-size:12px;">Chấp nhận</button>\`;
                        }
                    }
                }
                
                html += \`
                    <div style="display:flex; align-items:center; justify-content:space-between; padding: 10px; background:#f9f9f9; border-radius: 8px;">
                        <div style="display:flex; align-items:center; gap: 10px;">
                            <div style="width:36px; height:36px; background:var(--primary); color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold;">
                                \${name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div style="font-weight:600; font-size: 14px;">\${escapeHtml(name)}</div>
                                <div style="font-size: 12px; color: var(--muted);">\${escapeHtml(uid)}</div>
                            </div>
                        </div>
                        <div>\${actionHtml}</div>
                    </div>
                \`;
            }
            html += "</div>";
            res.innerHTML = html;
        }
    } catch(e) {
        res.innerHTML = \`<span style='color:red;'>Lỗi: \${e.message}</span>\`;
    } finally {
        hideLoading();
    }
}

async function sendFriendRequest(targetId) {
    if(!confirm("Gửi lời mời kết bạn?")) return;
    showLoading("Đang gửi...");
    try {
        const id = 'FR' + new Date().getTime();
        const row = [id, currentUser.id, targetId, "pending", formatDateTimeToDDMMYYYYHHMMSS(new Date())];
        const range = \`\${quoteSheetName("BAN_BE")}!A2\`;
        await sheetsFetch(\`/values/\${encodeURIComponent(range)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS\`, {
            method: "POST",
            body: JSON.stringify({ values: [row] })
        });
        alert("Đã gửi lời mời kết bạn.");
        searchFriends(); // refresh search results
        loadFriendsData();
    } catch(e) {
        alert("Lỗi: " + e.message);
    } finally {
        hideLoading();
    }
}

async function acceptFriendRequest(requestId, sheetRow) {
    showLoading("Đang chấp nhận...");
    try {
        const col = colName(3); // trang_thai
        const range = \`\${quoteSheetName("BAN_BE")}!\${col}\${sheetRow}\`;
        await sheetsFetch(\`/values/\${encodeURIComponent(range)}?valueInputOption=RAW\`, {
            method: "PUT",
            body: JSON.stringify({ values: [["accepted"]] })
        });
        alert("Đã chấp nhận kết bạn.");
        searchFriends();
        loadFriendsData();
    } catch(e) {
        alert("Lỗi: " + e.message);
    } finally {
        hideLoading();
    }
}

async function loadFriendsData() {
    const reqList = document.getElementById("friendRequestsList");
    const friList = document.getElementById("friendsList");
    if (!reqList || !friList) return;
    
    try {
        const banbeRows = await loadModuleRows("BAN_BE");
        const users = await loadModuleRows("DSNV");
        
        const myRequests = banbeRows.filter(r => r[2] === currentUser.id && r[3] === "pending");
        const myFriends = banbeRows.filter(r => r[3] === "accepted" && (r[1] === currentUser.id || r[2] === currentUser.id));
        
        const getUserInfo = (uid) => {
            const u = users.find(x => x[0] === uid);
            return u ? (u[1] || uid) : uid;
        };
        
        // Render requests
        if (myRequests.length === 0) {
            reqList.innerHTML = "<span style='color:var(--muted); font-size:13px;'>Không có lời mời nào.</span>";
        } else {
            let html = '<div style="display: flex; flex-direction: column; gap: 10px;">';
            for (const req of myRequests) {
                const uid = req[1];
                const name = getUserInfo(uid);
                html += \`
                    <div style="display:flex; align-items:center; justify-content:space-between; padding: 10px; background:#f9f9f9; border-radius: 8px;">
                        <div style="display:flex; align-items:center; gap: 10px;">
                            <div style="width:36px; height:36px; background:var(--primary); color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold;">
                                \${name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div style="font-weight:600; font-size: 14px;">\${escapeHtml(name)}</div>
                                <div style="font-size: 12px; color: var(--muted);">Muốn kết bạn với bạn</div>
                            </div>
                        </div>
                        <div>
                            <button class="primary-btn" onclick="acceptFriendRequest('\${escapeHtml(req[0])}', \${req._sheetRow})" style="width:auto; padding: 6px 12px; font-size:12px;">Đồng ý</button>
                        </div>
                    </div>
                \`;
            }
            html += "</div>";
            reqList.innerHTML = html;
        }
        
        // Render friends
        if (myFriends.length === 0) {
            friList.innerHTML = "<span style='color:var(--muted); font-size:13px;'>Bạn chưa có bạn bè nào.</span>";
        } else {
            let html = '<div style="display: flex; flex-direction: column; gap: 10px;">';
            for (const fri of myFriends) {
                const uid = fri[1] === currentUser.id ? fri[2] : fri[1];
                const name = getUserInfo(uid);
                html += \`
                    <div style="display:flex; align-items:center; justify-content:space-between; padding: 10px; background:#f9f9f9; border-radius: 8px;">
                        <div style="display:flex; align-items:center; gap: 10px;">
                            <div style="width:36px; height:36px; background:#e0e7ff; color:var(--primary); border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold;">
                                \${name.charAt(0).toUpperCase()}
                            </div>
                            <div style="font-weight:600; font-size: 14px;">\${escapeHtml(name)}</div>
                        </div>
                    </div>
                \`;
            }
            html += "</div>";
            friList.innerHTML = html;
        }
        
    } catch(e) {
        reqList.innerHTML = \`<span style='color:red;'>Lỗi: \${e.message}</span>\`;
        friList.innerHTML = \`<span style='color:red;'>Lỗi: \${e.message}</span>\`;
    }
}
`;

const fetchDataRegex = /async function fetchData[\s\S]*?if \(currentModule === "ANH_CHUP"\) \{/;

const newFetchDataPrefix = `async function fetchData(seq = moduleLoadSeq) {
    if (document.getElementById("mapContainer")) document.getElementById("mapContainer").style.display = "none";
    if (document.getElementById("homeContainer")) document.getElementById("homeContainer").style.display = "none";
    if (document.getElementById("galleryContainer")) document.getElementById("galleryContainer").style.display = "none";
    if (document.getElementById("danhBaContainer")) document.getElementById("danhBaContainer").style.display = "none";
    if (document.getElementById("tableWrapper")) document.getElementById("tableWrapper").style.display = "block";
    if (document.getElementById("headerActions")) document.getElementById("headerActions").style.display = "flex";
    if (document.getElementById("filterPanel")) document.getElementById("filterPanel").style.display = "flex";

    if (currentModule === "DANH_BA") {
        if (document.getElementById("tableWrapper")) document.getElementById("tableWrapper").style.display = "none";
        if (document.getElementById("headerActions")) document.getElementById("headerActions").style.display = "none";
        if (document.getElementById("filterPanel")) document.getElementById("filterPanel").style.display = "none";
        renderDanhBaModule();
        hideLoading();
        return;
    }

    if (currentModule === "ANH_CHUP") {`;

if (app.match(fetchDataRegex)) {
    app = app.replace(fetchDataRegex, newFetchDataPrefix);
    app += '\n' + danhBaFunc;
    fs.writeFileSync('app.js', app);
    console.log('Successfully added DANH_BA module!');
} else {
    console.log('Regex match failed!');
}
