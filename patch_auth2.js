const fs = require('fs');
let app = fs.readFileSync('app.js','utf8');

const newToggleAuthMode = `function toggleAuthMode(event) {
    if (event) event.preventDefault();
    isRegisterMode = !isRegisterMode;
    
    document.getElementById('authTitle').innerText = isRegisterMode ? 'Đăng ký' : 'Đăng nhập';
    document.getElementById('authSubmitBtn').innerText = isRegisterMode ? 'Đăng ký' : 'Đăng nhập';
    document.getElementById('registerNameGroup').style.display = isRegisterMode ? 'flex' : 'none';
    document.getElementById('registerPhoneGroup').style.display = isRegisterMode ? 'flex' : 'none';
    document.getElementById('registerEmailGroup').style.display = isRegisterMode ? 'flex' : 'none';
    document.getElementById('rememberRow').style.display = isRegisterMode ? 'none' : 'flex';
    
    document.getElementById('authIdLabel').innerText = 'Tên đăng nhập (ID)';
    document.getElementById('toggleAuthBtn').innerText = isRegisterMode ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký ngay';
    document.getElementById('loginError').innerText = '';
    
    document.getElementById('registerName').required = isRegisterMode;
    document.getElementById('registerPhone').required = isRegisterMode;
}`;

app = app.replace(/function toggleAuthMode[\s\S]*?document\.getElementById\('registerName'\)\.required = isRegisterMode;\s*\}/, newToggleAuthMode);

const handleLoginRegex = /async function handleLogin[\s\S]*?hideLoading\(\);\s*\}\s*\}\s*\}/;

const newHandleLogin = `async function handleLogin(event) {
    event.preventDefault();
    const id = String(document.getElementById("loginId").value || "").trim();
    const mk = String(document.getElementById("loginPassword").value || "").trim();
    const name = String(document.getElementById("registerName")?.value || "").trim();
    const phone = String(document.getElementById("registerPhone")?.value || "").trim();
    const email = String(document.getElementById("registerEmail")?.value || "").trim();
    const remember = document.getElementById("rememberLogin")?.checked ?? true;
    const errorEl = document.getElementById("loginError");
    
    if (errorEl) errorEl.innerText = "";
    
    if (isRegisterMode) {
        if (!id || !mk || !name || !phone) {
            if (errorEl) errorEl.innerText = "Vui lòng nhập đầy đủ thông tin bắt buộc.";
            return;
        }
        
        showLoading("Đang đăng ký...");
        try {
            const users = await loadNhanVienRows();
            const existingUser = users.find(item => item.id.toLowerCase() === id.toLowerCase() || (item.sdt && item.sdt === phone));
            if (existingUser) {
                if (errorEl) errorEl.innerText = "Tên đăng nhập (ID) hoặc Số điện thoại đã tồn tại.";
                return;
            }
            
            // DSNV headers: ["id", "ho_ten", "hinh_anh", "gioi_tinh", "ngay_sinh", "quyen", "mk", "udt", "sdt", "email"]
            const row = [id, name, "", "", "", "user", mk, "", phone, email];
            const range = \`\${quoteSheetName("DSNV")}!A2\`;
            await sheetsFetch(\`/values/\${encodeURIComponent(range)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS\`, {
                method: "POST",
                body: JSON.stringify({ values: [row] })
            });
            
            alert("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
            toggleAuthMode();
        } catch (err) {
            console.error(err);
            if (errorEl) errorEl.innerText = "Lỗi đăng ký: " + err.message;
        } finally {
            hideLoading();
        }
    } else {
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
                quyen: user.quyen,
                sdt: user.sdt,
                email: user.email
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
}`;

app = app.replace(handleLoginRegex, newHandleLogin);

fs.writeFileSync('app.js', app);
console.log('Patched login logic!');
