const fs = require('fs');
let app = fs.readFileSync('app.js','utf8');

const newConfig = `
        DSNV: {
            label: "DSNV",
            icon: "users",
            headers: ["id", "ho_ten", "hinh_anh", "gioi_tinh", "ngay_sinh", "quyen", "mk", "udt", "sdt", "email"],
            hidden: true
        },
        BAN_BE: {
            label: "Bạn Bè",
            icon: "users",
            headers: ["id", "nguoi_gui", "nguoi_nhan", "trang_thai", "thoi_gian"],
            hidden: true
        },
        DANH_BA: {
            label: "Danh Bạ",
            icon: "book-user",
            headers: []
        }
    }
};

const MODULE_STORAGE_KEY = "kieuDucActiveModule";
const AUTH_STORAGE_KEY = "kieuDucCurrentUser";
const MODULE_ORDER = ["TRANG_CHU", "VI_TRI", "DANH_BA"];
`;

app = app.replace(/DSNV: \{[\s\S]*?const MODULE_ORDER = \["TRANG_CHU", "VI_TRI"\];/, newConfig.trim());

fs.writeFileSync('app.js', app);
console.log('Patched CONFIG!');
