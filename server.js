require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');

const db = require('./supabase');

const app = express();

// ===========================================================================
// SECURITY HARDENING: Anti-Fingerprinting & Security Headers
// ===========================================================================
app.disable('x-powered-by');

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Rate Limiter Sederhana Anti Brute-Force Bot / Hacker
const authAttempts = new Map();
function rateLimitAuth(maxAttempts = 15, windowMs = 10 * 60 * 1000) {
  return (req, res, next) => {
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const ip = String(rawIp).split(',')[0].trim();
    const now = Date.now();
    const record = authAttempts.get(ip) || { count: 0, resetTime: now + windowMs };

    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + windowMs;
    }

    if (record.count >= maxAttempts) {
      const waitMin = Math.ceil((record.resetTime - now) / 60000);
      return res.status(429).json({
        success: false,
        message: `Terlalu banyak percobaan. Akses dibatasi sementara demi keamanan. Silakan coba lagi dalam ${waitMin} menit.`
      });
    }

    req.authLimiter = {
      recordSuccess: () => authAttempts.delete(ip),
      recordFailure: () => {
        record.count++;
        authAttempts.set(ip, record);
      }
    };
    next();
  };
}

app.use(cors());
app.use(express.json({ limit: '12mb' }));

// Serve static frontend web portal
app.use(express.static(path.join(__dirname, 'public')));

const ok = (res, data, status = 200) => res.status(status).json({ success: true, data });
const fail = (res, message, status = 400) => res.status(status).json({ success: false, message });

// ---------------------------------------------------------------------------
// HEALTH & STATUS
// ---------------------------------------------------------------------------
app.get('/api/health', async (_req, res) => {
  const status = await db.checkConnection();
  ok(res, {
    service: 'AssetLoop Supabase Backend',
    version: '1.0.0',
    database: status.connected ? 'supabase_connected' : 'fallback_mode',
    details: status,
    timestamp: new Date().toISOString()
  });
});

// ---------------------------------------------------------------------------
// AUTHENTICATION
// ---------------------------------------------------------------------------

// 1. Mobile Login (Superadmin, Admin, User) - Dilindungi Anti Brute-Force
app.post('/api/auth/login', rateLimitAuth(15, 10 * 60 * 1000), async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return fail(res, 'Email dan password wajib diisi', 400);

  const cleanEmail = String(email).trim().toLowerCase();
  if (!cleanEmail.endsWith('@assetloop.com')) {
    return fail(res, 'Akses ditolak: Email wajib menggunakan domain resmi @assetloop.com', 400);
  }
  const user = await db.findUserByEmail(cleanEmail);
  if (!user || !user.password_hash) {
    if (req.authLimiter) req.authLimiter.recordFailure();
    return fail(res, 'Email atau password salah', 401);
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    if (req.authLimiter) req.authLimiter.recordFailure();
    return fail(res, 'Email atau password salah', 401);
  }

  if (req.authLimiter) req.authLimiter.recordSuccess();

  ok(res, {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    photo: user.photo
  });
});

// 2. Web Backend Login (HANYA SUPERADMIN!) - Dilindungi Anti Brute-Force
app.post('/api/web/login', rateLimitAuth(15, 10 * 60 * 1000), async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return fail(res, 'Email dan password wajib diisi', 400);

  const cleanEmail = String(email).trim().toLowerCase();
  if (!cleanEmail.endsWith('@assetloop.com')) {
    return fail(res, 'Akses ditolak: Email wajib menggunakan domain resmi @assetloop.com', 400);
  }
  const user = await db.findUserByEmail(cleanEmail);
  if (!user || !user.password_hash) {
    if (req.authLimiter) req.authLimiter.recordFailure();
    return fail(res, 'Email atau password salah', 401);
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    if (req.authLimiter) req.authLimiter.recordFailure();
    return fail(res, 'Email atau password salah', 401);
  }

  // VALIDASI PERAN SPESIFIK UNTUK WEB BACKEND:
  if (user.role === 'admin') {
    return fail(res, 'Akses Ditolak: Akun Anda memiliki role Admin (Mobile Only). Sesuai kebijakan sistem, Admin hanya dapat mengelola aset di Aplikasi Mobile. Tampilan backend website khusus untuk Superadmin.', 403);
  }

  if (user.role === 'user' || user.role === 'karyawan') {
    return fail(res, 'Akses Ditolak: Akun Pengguna hanya dapat meminjam aset melalui Aplikasi Mobile. Anda tidak memiliki izin akses ke Website Backend.', 403);
  }

  if (user.role !== 'superadmin') {
    return fail(res, 'Akses Ditolak: Hanya Superadmin yang diizinkan masuk ke Web Backend.', 403);
  }

  if (req.authLimiter) req.authLimiter.recordSuccess();

  ok(res, {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    photo: user.photo,
    token: `token_${user.id}_${Date.now()}`
  });
});

// 3. Registrasi Pengguna Baru (Mobile App)
app.post('/api/auth/register', rateLimitAuth(10, 15 * 60 * 1000), async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 6) {
    return fail(res, 'Data pendaftaran tidak valid (nama, email, password minimal 6 karakter)');
  }
  const cleanEmail = String(email).trim().toLowerCase();
  if (!cleanEmail.endsWith('@assetloop.com')) {
    return fail(res, 'Pendaftaran ditolak: Email wajib menggunakan domain resmi @assetloop.com', 400);
  }
  try {
    const password_hash = await bcrypt.hash(password, 10);
    const user = await db.createUser({
      name: String(name).trim(),
      email: cleanEmail,
      password_hash,
      role: 'user'
    });
    ok(res, user, 201);
  } catch (e) {
    return fail(res, e.message || 'Pendaftaran gagal', 409);
  }
});

// 4. Lupa & Reset Kata Sandi (Mobile App & Web) - Dilindungi Anti Spam/Abuse
app.post('/api/auth/reset-password', rateLimitAuth(8, 15 * 60 * 1000), async (req, res) => {
  const { email, new_password } = req.body;
  if (!email || !new_password) {
    return fail(res, 'Email dan kata sandi baru wajib diisi', 400);
  }
  if (new_password.length < 6) {
    return fail(res, 'Kata sandi baru minimal 6 karakter', 400);
  }
  try {
    const cleanEmail = String(email).trim().toLowerCase();
    if (!cleanEmail.endsWith('@assetloop.com')) {
      return fail(res, 'Gagal: Email wajib menggunakan domain resmi @assetloop.com', 400);
    }
    const user = await db.findUserByEmail(cleanEmail);
    if (!user) {
      if (req.authLimiter) req.authLimiter.recordFailure();
      return fail(res, 'Email tidak ditemukan. Pastikan email terdaftar.', 404);
    }
    const hash = await bcrypt.hash(new_password, 10);
    await db.updateUserPassword(user.id, hash);
    if (req.authLimiter) req.authLimiter.recordSuccess();
    try {
      await db.createNotification({
        recipient_email: user.email,
        title: 'Kata Sandi Diperbarui',
        body: `Kata sandi akun Anda berhasil diubah pada ${new Date().toLocaleString('id-ID')}. Jika ini bukan Anda, segera hubungi admin.`,
        type: 'system'
      });
    } catch (_) {}
    ok(res, { success: true, message: 'Kata sandi berhasil diperbarui. Silakan masuk kembali.' });
  } catch (e) {
    return fail(res, e.message || 'Gagal mengatur ulang kata sandi', 500);
  }
});

// ---------------------------------------------------------------------------
// USERS & ROLES
// ---------------------------------------------------------------------------

// Daftar admin & superadmin (untuk mobile app notifikasi)
app.get('/api/users/admins', async (_req, res) => {
  const admins = await db.getAdmins();
  ok(res, admins);
});

// Daftar semua pengguna (Superadmin Web feature)
app.get('/api/users', async (_req, res) => {
  const users = await db.getAllUsers();
  ok(res, users);
});

// Tambah pengguna dari Web Backend (Superadmin)
app.post('/api/web/users', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return fail(res, 'Semua data wajib diisi');
  }
  const cleanEmail = String(email).trim().toLowerCase();
  if (!cleanEmail.endsWith('@assetloop.com')) {
    return fail(res, 'Gagal: Email wajib menggunakan domain resmi @assetloop.com', 400);
  }
  if (!['superadmin', 'admin', 'user'].includes(role)) {
    return fail(res, 'Role tidak valid (pilih: superadmin, admin, atau user)');
  }
  try {
    const password_hash = await bcrypt.hash(password, 10);
    const user = await db.createUser({ name, email: cleanEmail, password_hash, role });
    ok(res, user, 201);
  } catch (e) {
    return fail(res, e.message || 'Gagal menambahkan user', 400);
  }
});

// Pengajuan Hapus Akun oleh Pengguna Mobile
app.post('/api/users/:id/request-delete', async (req, res) => {
  try {
    const result = await db.requestDeleteUser(req.params.id, req.body.reason);
    ok(res, result);
  } catch (e) {
    fail(res, e.message || 'Gagal mengajukan hapus akun', 400);
  }
});

// Pembatalan Pengajuan Hapus Akun
app.post('/api/users/:id/cancel-delete', async (req, res) => {
  try {
    const result = await db.cancelDeleteUserRequest(req.params.id);
    ok(res, result);
  } catch (e) {
    fail(res, e.message || 'Gagal membatalkan pengajuan hapus akun', 400);
  }
});

// Hapus Akun Pengguna Secara Permanen (Superadmin)
app.delete('/api/users/:id', async (req, res) => {
  try {
    const result = await db.deleteUser(req.params.id);
    ok(res, result);
  } catch (e) {
    fail(res, e.message || 'Gagal menghapus akun pengguna', 400);
  }
});

app.delete('/api/web/users/:id', async (req, res) => {
  try {
    const result = await db.deleteUser(req.params.id);
    ok(res, result);
  } catch (e) {
    fail(res, e.message || 'Gagal menghapus akun pengguna', 400);
  }
});

// Ubah Role Pengguna (Superadmin Web feature)
app.put('/api/users/:id/role', async (req, res) => {
  const { role } = req.body;
  if (!['superadmin', 'admin', 'user'].includes(role)) {
    return fail(res, 'Role tidak valid');
  }
  try {
    const user = await db.updateUserRole(req.params.id, role);
    ok(res, user);
  } catch (e) {
    return fail(res, e.message || 'Gagal mengubah role', 400);
  }
});

app.get('/api/users/:id', async (req, res) => {
  const u = await db.findUserById(req.params.id);
  u ? ok(res, u) : fail(res, 'Pengguna tidak ditemukan', 404);
});

app.put('/api/users/:id', async (req, res) => {
  const u = await db.updateUser(req.params.id, { name: req.body.name });
  ok(res, u);
});

app.put('/api/users/:id/photo', async (req, res) => {
  const u = await db.updateUserPhoto(req.params.id, req.body.photo);
  ok(res, u);
});

app.put('/api/users/:id/password', async (req, res) => {
  const user = await db.findUserById(req.params.id);
  if (!user) return fail(res, 'Pengguna tidak ditemukan', 404);

  const fullUser = await db.findUserByEmail(user.email);
  if (!fullUser || !await bcrypt.compare(req.body.old_password || '', fullUser.password_hash)) {
    return fail(res, 'Password lama tidak sesuai', 400);
  }
  const newHash = await bcrypt.hash(req.body.new_password, 10);
  await db.updateUserPassword(req.params.id, newHash);
  ok(res, { changed: true });
});

// ---------------------------------------------------------------------------
// ASSETS
// ---------------------------------------------------------------------------

app.get('/api/assets', async (_req, res) => {
  const list = await db.getAssets();
  ok(res, list);
});

app.post('/api/assets', async (req, res) => {
  try {
    const result = await db.createAsset(req.body);
    ok(res, result, 201);
  } catch (e) {
    fail(res, e.message || 'Gagal menyimpan aset', 409);
  }
});

app.put('/api/assets/:id', async (req, res) => {
  try {
    const result = await db.updateAsset(req.params.id, req.body);
    ok(res, result);
  } catch (e) {
    fail(res, e.message || 'Gagal memperbarui aset', 400);
  }
});

app.delete('/api/assets/:id', async (req, res) => {
  try {
    const result = await db.deleteAsset(req.params.id);
    ok(res, result);
  } catch (e) {
    fail(res, e.message || 'Gagal menghapus aset', 400);
  }
});

// ---------------------------------------------------------------------------
// LOANS & RETURNS
// ---------------------------------------------------------------------------

app.get('/api/loans', async (_req, res) => {
  const loans = await db.getLoans();
  ok(res, loans);
});

// Ekspor Riwayat Peminjaman ke CSV
app.get('/api/loans/export', async (_req, res) => {
  try {
    const loans = await db.getLoans();
    const headers = [
      'ID Peminjaman', 'Nama Peminjam', 'Email Peminjam', 'Role',
      'Nama Aset', 'Kode Aset', 'Kategori',
      'Tanggal Mulai', 'Tanggal Selesai', 'Status',
      'Keperluan', 'Tanggal Dikembalikan', 'Catatan Pengembalian', 'Kondisi',
      'Surat Peminjaman', 'Kartu Identitas'
    ];
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = loans.map(l => [
      esc(l.loan_id), esc(l.user_name || '-'), esc(l.email || '-'), esc(l.role || 'user'),
      esc(l.asset_name || '-'), esc(l.code || '-'), esc(l.category || '-'),
      esc(l.start_date), esc(l.end_date), esc(l.loan_status),
      esc(l.purpose || '-'), esc(l.return_date || '-'), esc(l.return_note || '-'), esc(l.return_condition || '-'),
      esc(l.loan_letter_url ? 'Dilampirkan' : 'Tidak Ada'),
      esc(l.identity_card_url ? 'Dilampirkan' : 'Tidak Ada')
    ]);
    const csv = '\uFEFF' + [headers.map(esc).join(','), ...rows.map(r => r.join(','))].join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="Laporan_Peminjaman_AssetLoop_${new Date().toISOString().slice(0, 10)}.csv"`);
    res.status(200).send(csv);
  } catch (e) {
    fail(res, e.message || 'Gagal mengekspor laporan peminjaman', 500);
  }
});

app.get('/api/loans/overlap', async (req, res) => {
  const count = await db.countOverlapping(req.query.asset_id, req.query.start, req.query.end);
  ok(res, { count });
});

app.post('/api/loans', async (req, res) => {
  try {
    const result = await db.createLoan(req.body);
    ok(res, result, 201);
  } catch (e) {
    fail(res, e.message || 'Gagal membuat pengajuan', 400);
  }
});

app.put('/api/loans/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'approved', 'rejected', 'returning', 'returned'].includes(status)) {
    return fail(res, 'Status tidak valid');
  }
  await db.updateLoanStatus(req.params.id, status);
  ok(res, { updated: true });
});

app.put('/api/loans/:id/return', async (req, res) => {
  await db.returnLoan(req.params.id, req.body.return_date, req.body.return_note);
  ok(res, { updated: true });
});

app.put('/api/loans/:id/complete-return', async (req, res) => {
  try {
    const result = await db.completeReturn(req.params.id, Boolean(req.body.damaged));
    ok(res, result);
  } catch (e) {
    fail(res, e.message || 'Gagal menyelesaikan pengembalian', 400);
  }
});

// ---------------------------------------------------------------------------
// NOTIFICATIONS
// ---------------------------------------------------------------------------

app.post('/api/notifications', async (req, res) => {
  const result = await db.createNotification(req.body);
  ok(res, result, 201);
});

app.get('/api/notifications', async (req, res) => {
  const notifs = await db.getNotifications(req.query.email);
  ok(res, notifs);
});

app.put('/api/notifications/:id/read', async (req, res) => {
  await db.markNotificationRead(req.params.id);
  ok(res, { updated: true });
});

app.put('/api/notifications/read-all', async (req, res) => {
  await db.markAllNotificationsRead(req.body.email);
  ok(res, { updated: true });
});

// ---------------------------------------------------------------------------
// FALLBACK SPA ROUTE
// ---------------------------------------------------------------------------
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return fail(res, 'Endpoint API tidak ditemukan', 404);
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// START SERVER
const os = require('os');
function getLocalIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

const port = Number(process.env.PORT || 3000);
app.listen(port, '0.0.0.0', () => {
  const lanIp = getLocalIp();
  console.log(`=======================================================`);
  console.log(`🚀 AssetLoop Backend (Supabase Ready)`);
  console.log(`📡 API lokal (PC)           : http://localhost:${port}/api`);
  console.log(`📱 API untuk HP (Wi-Fi)     : http://${lanIp}:${port}/api`);
  console.log(`💻 Web Backend (Superadmin) : http://localhost:${port}`);
  console.log(`=======================================================`);
});
