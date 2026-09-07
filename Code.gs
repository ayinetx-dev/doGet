function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Emasku - Kredit Emas')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Setup Database Spreadsheet Otomatis
function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = {
    "Users": ["ID", "Username", "Password", "Role", "Created_At"],
    "Pembelian": ["ID_Transaksi", "Username", "Gram", "Harga_Total", "Metode_Pembayaran", "Status", "Tanggal"],
    "Mutasi": ["ID_Mutasi", "Username", "Tipe", "Jumlah", "Tujuan_Bank", "Status", "Tanggal"],
    "Arisan": ["ID_Arisan", "Username", "Nama_Kelompok", "Setoran_Bulanan", "Status", "Tanggal"],
    "Promo": ["ID_Promo", "Judul_Promo", "Deskripsi", "Diskon", "Berlaku_Hingga"],
    "MasterData": ["Kategori", "Tebus_Murah_Info", "Pusat_Bantuan_Kontak"]
  };
  
  for (var sheetName in sheets) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(sheets[sheetName]);
    }
  }
  return "Database berhasil disetting!";
}

// Fungsi Autentikasi / Login
function loginUser(username, password) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Users");
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] === username && data[i][2] === password) {
      return { success: true, username: data[i][1], role: data[i][3] };
    }
  }
  
  // Default Register jika belum ada (untuk kemudahan testing)
  if(data.length <= 1) {
    sheet.appendRow([new Date().getTime(), username, password, "User", new Date()]);
    return { success: true, username: username, role: "User" };
  }
  
  return { success: false, message: "Username atau Password salah!" };
}

// Fungsi Simpan Pembelian Emas
function processPembelian(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Pembelian");
  var id = "BUY-" + new Date().getTime();
  sheet.appendRow([id, data.username, data.gram, data.total, data.metode, "Pending", new Date()]);
  return { success: true, message: "Pembelian berhasil diajukan!" };
}

// Fungsi Simpan Transfer / Deposit / Withdraw
function processMutasi(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Mutasi");
  var id = "UTS-" + new Date().getTime();
  sheet.appendRow([id, data.username, data.tipe, data.jumlah, data.bank, "Diproses", new Date()]);
  return { success: true, message: data.tipe + " berhasil diajukan!" };
}

// Fungsi Arisan Emas
function processArisan(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Arisan");
  var id = "ARS-" + new Date().getTime();
  sheet.appendRow([id, data.username, data.namaKelompok, data.setoran, "Aktif", new Date()]);
  return { success: true, message: "Berhasil bergabung ke Arisan Emas!" };
}

// Ambil Data Detail (Promo, Kategori, Tebus Murah, Pusat Bantuan)
function getAppData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Ambil Promo
  var promoSheet = ss.getSheetByName("Promo");
  var promoData = promoSheet.getDataRange().getValues();
  var promos = [];
  for (var i = 1; i < promoData.length; i++) {
    promos.push({judul: promoData[i][1], desc: promoData[i][2], diskon: promoData[i][3]});
  }
  if(promos.length === 0) promos.push({judul: "Diskon Akhir Pekan", desc: "Cashback 0.5gram untuk cicilan 12 bulan", diskon: "5%"});

  // Ambil Master Data (Kategori, Tebus Murah, Bantuan)
  var masterSheet = ss.getSheetByName("MasterData");
  var masterData = masterSheet.getDataRange().getValues();
  var kategori = ["Logam Mulia Antam", "UBS Gold", "Custom Batangan"];
  var tebusMurah = "Diskon khusus produk cicilan emas mini 0.5 gram setiap tanggal 25.";
  var pusatBantuan = "WhatsApp CS: 081234567890 | Email: support@emasku.com";

  return {
    promos: promos,
    kategori: kategori,
    tebusMurah: tebusMurah,
    pusatBantuan: pusatBantuan
  };
}
