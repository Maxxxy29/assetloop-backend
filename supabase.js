const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

const isConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project')
);

let supabase = null;
if (isConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
    console.log(`[Supabase] Klien Supabase diinisialisasi untuk URL: ${supabaseUrl}`);
  } catch (err) {
    console.error('[Supabase] Gagal menginisialisasi klien Supabase:', err.message);
  }
} else {
  console.log('[Supabase] SUPABASE_URL / SUPABASE_KEY belum diisi di .env. Menggunakan local store sebagai fallback.');
}

// ---------------------------------------------------------------------------
// DATA SEED AWAL (Fallback & Auto-Seed)
// ---------------------------------------------------------------------------
const defaultUsers = [
  {
    id: 1,
    name: 'Superadmin AssetLoop',
    email: 'superadmin@assetloop.com',
    password_hash: bcrypt.hashSync('superadmin123', 10),
    role: 'superadmin',
    photo: null,
    delete_requested: false,
    delete_reason: null,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Admin Mobile AssetLoop',
    email: 'admin@assetloop.com',
    password_hash: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    photo: null,
    delete_requested: false,
    delete_reason: null,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Admin AssetLoop Cabang',
    email: 'admin.cabang@assetloop.com',
    password_hash: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    photo: null,
    delete_requested: false,
    delete_reason: null,
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Andi Pratama',
    email: 'andi@assetloop.com',
    password_hash: bcrypt.hashSync('andi123', 10),
    role: 'user',
    photo: null,
    delete_requested: false,
    delete_reason: null,
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    name: 'Pengguna AssetLoop',
    email: 'user@assetloop.com',
    password_hash: bcrypt.hashSync('user123', 10),
    role: 'user',
    photo: null,
    delete_requested: false,
    delete_reason: null,
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    name: 'Siti Nurhaliza',
    email: 'siti@assetloop.com',
    password_hash: bcrypt.hashSync('siti123', 10),
    role: 'user',
    photo: null,
    delete_requested: false,
    delete_reason: null,
    created_at: new Date().toISOString()
  },
  {
    id: 7,
    name: 'Budi Santoso',
    email: 'budi@assetloop.com',
    password_hash: bcrypt.hashSync('budi123', 10),
    role: 'user',
    photo: null,
    delete_requested: false,
    delete_reason: null,
    created_at: new Date().toISOString()
  },
  {
    id: 8,
    name: 'Rina Marlina',
    email: 'rina@assetloop.com',
    password_hash: bcrypt.hashSync('rina123', 10),
    role: 'user',
    photo: null,
    delete_requested: false,
    delete_reason: null,
    created_at: new Date().toISOString()
  }
];

const defaultImageMap = {
  'IT-001': '/images/laptop_lenovo.jpg',
  'IT-002': '/images/proyektor_epson.jpg',
  'IT-003': '/images/printer_hp.jpg',
  'IT-004': '/images/kursi_kantor.jpg',
  'IT-005': '/images/pc_dell.jpg',
  'IT-006': '/images/layar_proyektor.jpg',
  'IT-007': '/images/tinta_epson.jpg',
  'IT-008': '/images/mic_jbl.jpg',
  'IT-009': '/images/speaker_jbl.jpg',
  'IT-010': '/images/kamera_canon.jpg',
  'FN-001': '/images/meja_kerja.jpg',
  'FN-002': '/images/lemari_arsip.jpg',
  'KD-001': '/images/motor_vario.jpg',
  'KD-002': '/images/mobil_innova.jpg'
};

const defaultAssets = [
  { id: 1, code: 'IT-001', name: 'Laptop Lenovo', category: 'Laptop', asset_type: 'electronic', extra: 'Lenovo ThinkPad', total_stock: 6, damaged_count: 0, image_url: '/images/laptop_lenovo.jpg' },
  { id: 2, code: 'IT-002', name: 'Proyektor Epson', category: 'Proyektor', asset_type: 'electronic', extra: 'Epson EB-U42', total_stock: 3, damaged_count: 0, image_url: '/images/proyektor_epson.jpg' },
  { id: 3, code: 'IT-003', name: 'Printer HP', category: 'Printer', asset_type: 'electronic', extra: 'HP LaserJet', total_stock: 3, damaged_count: 0, image_url: '/images/printer_hp.jpg' },
  { id: 4, code: 'IT-004', name: 'Kursi Ergonomis', category: 'Kursi', asset_type: 'furniture', extra: 'Ergonomis', total_stock: 11, damaged_count: 1, image_url: '/images/kursi_kantor.jpg' },
  { id: 5, code: 'IT-005', name: 'PC Dell Vostro', category: 'Komputer', asset_type: 'electronic', extra: 'Dell Vostro 3888', total_stock: 4, damaged_count: 0, image_url: '/images/pc_dell.jpg' },
  { id: 6, code: 'IT-006', name: 'Layar Proyektor', category: 'Layar', asset_type: 'electronic', extra: 'Levede Tripod', total_stock: 2, damaged_count: 0, image_url: '/images/layar_proyektor.jpg' },
  { id: 7, code: 'IT-007', name: 'Tinta Epson 001', category: 'Tinta', asset_type: 'electronic', extra: 'Epson 001 CMYK', total_stock: 8, damaged_count: 0, image_url: '/images/tinta_epson.jpg' },
  { id: 8, code: 'IT-008', name: 'Mic Wireless JBL', category: 'Audio', asset_type: 'electronic', extra: 'JBL Wireless', total_stock: 2, damaged_count: 0, image_url: '/images/mic_jbl.jpg' },
  { id: 9, code: 'IT-009', name: 'Speaker JBL PartyBox', category: 'Audio', asset_type: 'electronic', extra: 'JBL PartyBox 110', total_stock: 2, damaged_count: 0, image_url: '/images/speaker_jbl.jpg' },
  { id: 10, code: 'IT-010', name: 'Kamera Canon EOS 30D', category: 'Kamera', asset_type: 'electronic', extra: 'Canon EOS', total_stock: 2, damaged_count: 0, image_url: '/images/kamera_canon.jpg' },
  { id: 11, code: 'FN-001', name: 'Meja Kerja', category: 'Meja', asset_type: 'furniture', extra: 'Kayu Solid', total_stock: 12, damaged_count: 0, image_url: '/images/meja_kerja.jpg' },
  { id: 12, code: 'FN-002', name: 'Lemari Arsip', category: 'Lemari', asset_type: 'furniture', extra: 'Besi 4 Laci', total_stock: 5, damaged_count: 0, image_url: '/images/lemari_arsip.jpg' },
  { id: 13, code: 'KD-001', name: 'Motor Honda Vario', category: 'Kendaraan', asset_type: 'vehicle', extra: 'B 3829 KLC', total_stock: 2, damaged_count: 0, image_url: '/images/motor_vario.jpg' },
  { id: 14, code: 'KD-002', name: 'Mobil Toyota Innova', category: 'Kendaraan', asset_type: 'vehicle', extra: 'B 1928 PQR', total_stock: 1, damaged_count: 0, image_url: '/images/mobil_innova.jpg' }
];

const d = (offset) => {
  const x = new Date();
  x.setDate(x.getDate() + offset);
  return x.toISOString().slice(0, 10);
};

let memUsers = [...defaultUsers];
let memAssets = [...defaultAssets];
let memLoans = [
  {
    id: 1,
    asset_id: 1,
    user_id: 4,
    start_date: d(-1),
    end_date: d(2),
    purpose: 'Keperluan dinas luar kantor',
    status: 'approved',
    return_date: null,
    return_note: null,
    return_condition: null,
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 2,
    asset_id: 4,
    user_id: 7,
    start_date: d(-4),
    end_date: d(-1),
    purpose: 'Acara rapat kantor',
    status: 'returning',
    return_date: d(0),
    return_note: 'Kursi dikembalikan dalam kondisi baik dan bersih',
    return_condition: null,
    created_at: new Date(Date.now() - 345600000).toISOString()
  },
  {
    id: 3,
    asset_id: 2,
    user_id: 6,
    start_date: d(1),
    end_date: d(2),
    purpose: 'Workshop pelatihan internal',
    status: 'pending',
    return_date: null,
    return_note: null,
    return_condition: null,
    created_at: new Date().toISOString()
  }
];

let memNotifications = [
  {
    id: 1,
    recipient_email: 'andi@perusahaan.com',
    title: 'Pengajuan Anda disetujui',
    body: 'Laptop Lenovo (IT-001) telah disetujui',
    type: 'loanApproved',
    loan_id: 1,
    is_read: false,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    recipient_email: 'superadmin@assetloop.com',
    title: 'Pengajuan baru masuk',
    body: 'Proyektor Epson (IT-002) oleh Siti Nurhaliza',
    type: 'newRequest',
    loan_id: 3,
    is_read: false,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    recipient_email: 'admin@assetloop.com',
    title: 'Pengajuan baru masuk',
    body: 'Proyektor Epson (IT-002) oleh Siti Nurhaliza',
    type: 'newRequest',
    loan_id: 3,
    is_read: false,
    created_at: new Date().toISOString()
  }
];

let nextUserId = 20;
let nextAssetId = 20;
let nextLoanId = 10;
let nextNotifId = 10;

// ---------------------------------------------------------------------------
// FUNGSI UTAMA REPOSITORY (SUPABASE DENGAN FALLBACK)
// ---------------------------------------------------------------------------

async function checkConnection() {
  if (!supabase) return { connected: false, mode: 'local_fallback', message: 'Menggunakan local database fallback (SUPABASE_URL belum diatur).' };
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (error) throw error;
    return { connected: true, mode: 'supabase_cloud', url: supabaseUrl, data };
  } catch (err) {
    return { connected: false, mode: 'error_fallback', error: err.message };
  }
}

async function findUserByEmail(email) {
  const em = (email || '').toLowerCase().trim();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .ilike('email', em)
        .limit(1)
        .maybeSingle();
      if (!error && data) return data;
    } catch (_) { }
  }
  return memUsers.find(u => u.email.toLowerCase() === em) || null;
}

async function findUserById(id) {
  const nid = Number(id);
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role, photo, delete_requested, delete_reason, created_at')
        .eq('id', nid)
        .maybeSingle();
      if (!error && data) return data;
    } catch (_) { }
  }
  const u = memUsers.find(x => x.id === nid);
  if (!u) return null;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    photo: u.photo,
    delete_requested: Boolean(u.delete_requested),
    delete_reason: u.delete_reason || null,
    created_at: u.created_at
  };
}

async function getAllUsers() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role, photo, delete_requested, delete_reason, created_at')
        .order('id', { ascending: true });
      if (!error && data) return data;
    } catch (_) { }
  }
  return memUsers.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    photo: u.photo,
    delete_requested: Boolean(u.delete_requested),
    delete_reason: u.delete_reason || null,
    created_at: u.created_at
  }));
}

async function getAdmins() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role, photo')
        .in('role', ['superadmin', 'admin']);
      if (!error && data) return data;
    } catch (_) { }
  }
  return memUsers
    .filter(u => u.role === 'superadmin' || u.role === 'admin')
    .map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, photo: u.photo }));
}

async function createUser({ name, email, password_hash, role = 'user' }) {
  const em = email.toLowerCase().trim();
  if (!em.endsWith('@assetloop.com')) {
    throw new Error('Email wajib menggunakan domain resmi @assetloop.com');
  }
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          name: name.trim(),
          email: em,
          password_hash,
          role,
          delete_requested: false,
          delete_reason: null
        }])
        .select('id, name, email, role, photo, delete_requested, delete_reason, created_at')
        .single();
      if (!error && data) return data;
      if (error && error.code === '23505') throw new Error('Email sudah terdaftar');
    } catch (err) {
      if (err.message.includes('terdaftar') || err.message.includes('domain')) throw err;
    }
  }
  if (memUsers.some(u => u.email.toLowerCase() === em)) {
    throw new Error('Email sudah terdaftar');
  }
  const newUser = {
    id: nextUserId++,
    name: name.trim(),
    email: em,
    password_hash,
    role,
    photo: null,
    delete_requested: false,
    delete_reason: null,
    created_at: new Date().toISOString()
  };
  memUsers.push(newUser);
  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    photo: newUser.photo,
    delete_requested: false,
    delete_reason: null,
    created_at: newUser.created_at
  };
}

async function requestDeleteUser(id, reason) {
  const nid = Number(id);

  if (supabase) {
    try {
      const { count, error: countErr } = await supabase
        .from('loans')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', nid)
        .in('status', ['pending', 'approved', 'returning']);
      if (countErr) {
        console.error('[requestDeleteUser] count error:', countErr);
      } else if (count > 0) {
        throw new Error('Pengguna masih memiliki transaksi peminjaman aktif. Harap selesaikan atau kembalikan semua aset terlebih dahulu sebelum mengajukan hapus akun.');
      }

      const { error: updErr } = await supabase.from('users').update({
        delete_requested: true,
        delete_reason: reason || 'Pengajuan hapus akun oleh pengguna'
      }).eq('id', nid);
      if (updErr) throw updErr;
    } catch (err) {
      if (err.message && err.message.includes('aktif')) throw err;
      console.error('[requestDeleteUser] supabase update error:', err);
    }
  } else {
    // Mode fallback in-memory jika tanpa Supabase
    const hasActive = memLoans.some(l => l.user_id === nid && ['pending', 'approved', 'returning'].includes(l.status));
    if (hasActive) {
      throw new Error('Pengguna masih memiliki transaksi peminjaman aktif. Harap selesaikan atau kembalikan semua aset terlebih dahulu sebelum mengajukan hapus akun.');
    }
  }

  const u = memUsers.find(x => x.id === nid);
  if (u) {
    u.delete_requested = true;
    u.delete_reason = reason || 'Pengajuan hapus akun oleh pengguna';
  }
  return { success: true, message: 'Pengajuan hapus akun berhasil dikirim ke Superadmin' };
}

async function cancelDeleteUserRequest(id) {
  const nid = Number(id);
  if (supabase) {
    try {
      const { error: updErr } = await supabase.from('users').update({
        delete_requested: false,
        delete_reason: null
      }).eq('id', nid);
      if (updErr) console.error('[cancelDeleteUserRequest] update error:', updErr);
    } catch (err) {
      console.error('[cancelDeleteUserRequest] error:', err);
    }
  }
  const u = memUsers.find(x => x.id === nid);
  if (u) {
    u.delete_requested = false;
    u.delete_reason = null;
  }
  return { success: true, message: 'Pengajuan hapus akun berhasil dibatalkan' };
}

async function deleteUser(id) {
  const nid = Number(id);

  if (supabase) {
    try {
      // 1. Cek apakah ada peminjaman aktif di Supabase
      const { count, error: countErr } = await supabase
        .from('loans')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', nid)
        .in('status', ['pending', 'approved', 'returning']);
      if (countErr) {
        console.error('[deleteUser] error checking active loans in Supabase:', countErr);
      } else if (count > 0) {
        throw new Error('Tidak dapat menghapus akun: Pengguna masih memiliki peminjaman aktif yang belum dikembalikan!');
      }

      // 2. Bersihkan notifikasi terkait email pengguna sebelum dihapus
      const { data: userRecord } = await supabase.from('users').select('email').eq('id', nid).maybeSingle();
      if (userRecord && userRecord.email) {
        const cleanEm = userRecord.email.toLowerCase().trim();
        await supabase.from('notifications').delete().ilike('recipient_email', cleanEm);
      }

      // 3. Bersihkan riwayat peminjaman (yang sudah returned/rejected) dari pengguna
      await supabase.from('loans').delete().eq('user_id', nid);

      // 4. Hapus data pengguna di Supabase
      const { error: delErr } = await supabase.from('users').delete().eq('id', nid);
      if (delErr) {
        console.error('[deleteUser] error deleting user in Supabase:', delErr);
        throw delErr;
      }
    } catch (err) {
      throw err;
    }
  } else {
    // Mode fallback in-memory
    const hasActive = memLoans.some(l => l.user_id === nid && ['pending', 'approved', 'returning'].includes(l.status));
    if (hasActive) {
      throw new Error('Tidak dapat menghapus akun: Pengguna masih memiliki peminjaman aktif yang belum dikembalikan!');
    }
    memLoans = memLoans.filter(l => l.user_id !== nid);
    const uMem = memUsers.find(x => x.id === nid);
    if (uMem && uMem.email) {
      memNotifications = memNotifications.filter(n => n.recipient_email.toLowerCase() !== uMem.email.toLowerCase());
    }
  }

  memUsers = memUsers.filter(x => x.id !== nid);
  return { deleted: true, id: nid };
}

async function updateUser(id, { name }) {
  const nid = Number(id);
  if (supabase) {
    try {
      await supabase.from('users').update({ name: name.trim() }).eq('id', nid);
    } catch (_) { }
  }
  const u = memUsers.find(x => x.id === nid);
  if (u) u.name = name.trim();
  return findUserById(nid);
}

async function updateUserPhoto(id, photo) {
  const nid = Number(id);
  if (supabase) {
    try {
      await supabase.from('users').update({ photo: photo || null }).eq('id', nid);
    } catch (_) { }
  }
  const u = memUsers.find(x => x.id === nid);
  if (u) u.photo = photo || null;
  return findUserById(nid);
}

async function updateUserPassword(id, password_hash) {
  const nid = Number(id);
  if (supabase) {
    try {
      await supabase.from('users').update({ password_hash }).eq('id', nid);
    } catch (_) { }
  }
  const u = memUsers.find(x => x.id === nid);
  if (u) u.password_hash = password_hash;
  return true;
}

async function updateUserRole(id, role) {
  const nid = Number(id);
  if (!['superadmin', 'admin', 'user'].includes(role)) {
    throw new Error('Role tidak valid');
  }
  if (supabase) {
    try {
      await supabase.from('users').update({ role }).eq('id', nid);
    } catch (_) { }
  }
  const u = memUsers.find(x => x.id === nid);
  if (u) u.role = role;
  return findUserById(nid);
}

// ---------------------------------------------------------------------------
// ASSETS
// ---------------------------------------------------------------------------

async function getAssets() {
  if (supabase) {
    try {
      const { data: assets, error } = await supabase.from('assets').select('*').order('code');
      if (!error && assets) {
        // Hitung borrowed
        const { data: activeLoans } = await supabase
          .from('loans')
          .select('asset_id')
          .in('status', ['approved', 'returning']);
        const countMap = {};
        (activeLoans || []).forEach(l => { countMap[l.asset_id] = (countMap[l.asset_id] || 0) + 1; });
        return assets.map(a => ({
          ...a,
          image_url: a.image_url || defaultImageMap[a.code] || null,
          borrowed: countMap[a.id] || 0
        }));
      }
    } catch (_) { }
  }
  return memAssets.map(a => {
    const borrowed = memLoans.filter(l => l.asset_id === a.id && ['approved', 'returning'].includes(l.status)).length;
    return {
      ...a,
      image_url: a.image_url || defaultImageMap[a.code] || null,
      borrowed
    };
  }).sort((a, b) => a.code.localeCompare(b.code));
}

async function createAsset(b) {
  const photo = b.image_url ? String(b.image_url).trim() : null;
  if (supabase) {
    try {
      const { data, error } = await supabase.from('assets').insert([{
        code: b.code,
        name: b.name,
        category: b.category,
        asset_type: b.asset_type || 'electronic',
        extra: b.extra || '',
        total_stock: Number(b.total_stock || 0),
        damaged_count: Number(b.damaged_count || 0),
        image_url: photo
      }]).select().single();
      if (!error && data) return { id: data.id };
      if (error && error.code === '23505') throw new Error('Kode aset sudah digunakan');
      if (error && error.message && error.message.includes('image_url')) {
        // Fallback jika kolom image_url belum dibuat di Supabase
        const { data: d2, error: e2 } = await supabase.from('assets').insert([{
          code: b.code,
          name: b.name,
          category: b.category,
          asset_type: b.asset_type || 'electronic',
          extra: b.extra || '',
          total_stock: Number(b.total_stock || 0),
          damaged_count: Number(b.damaged_count || 0)
        }]).select().single();
        if (!e2 && d2) return { id: d2.id };
      }
    } catch (err) {
      if (err.message === 'Kode aset sudah digunakan') throw err;
    }
  }
  if (memAssets.some(a => a.code.toUpperCase() === b.code.toUpperCase())) {
    throw new Error('Kode aset sudah digunakan');
  }
  const newAsset = {
    id: nextAssetId++,
    code: b.code,
    name: b.name,
    category: b.category,
    asset_type: b.asset_type || 'electronic',
    extra: b.extra || '',
    total_stock: Number(b.total_stock || 0),
    damaged_count: Number(b.damaged_count || 0),
    image_url: photo
  };
  memAssets.push(newAsset);
  return { id: newAsset.id };
}

async function updateAsset(id, b) {
  const nid = isNaN(Number(id)) ? id : Number(id);
  const photo = b.image_url !== undefined ? (b.image_url ? String(b.image_url).trim() : null) : undefined;
  const updateData = {
    code: b.code,
    name: b.name,
    category: b.category,
    asset_type: b.asset_type || 'electronic',
    extra: b.extra || '',
    total_stock: Number(b.total_stock || 0),
    damaged_count: Number(b.damaged_count || 0)
  };
  if (photo !== undefined) {
    updateData.image_url = photo;
  }
  if (supabase) {
    try {
      const { data, error } = await supabase.from('assets').update(updateData).eq('id', nid).select();
      if (error) {
        console.error('Supabase update asset error:', error);
        if (error.code === '23505') {
          throw new Error('Kode aset sudah digunakan oleh aset lain');
        }
        if (error.message && error.message.includes('image_url')) {
          delete updateData.image_url;
          const { error: err2 } = await supabase.from('assets').update(updateData).eq('id', nid);
          if (err2) throw err2;
        }
      }
    } catch (err) {
      if (err.message && err.message.includes('sudah digunakan')) throw err;
      console.error('updateAsset error in supabase:', err);
    }
  }
  const a = memAssets.find(x => x.id === nid || String(x.id) === String(id));
  if (a) {
    a.code = b.code;
    a.name = b.name;
    a.category = b.category;
    a.asset_type = b.asset_type || 'electronic';
    a.extra = b.extra || '';
    a.total_stock = Number(b.total_stock || 0);
    a.damaged_count = Number(b.damaged_count || 0);
    if (photo !== undefined) {
      a.image_url = photo;
    }
  }
  return { updated: true, id: nid };
}

async function deleteAsset(id) {
  const nid = Number(id);
  // Cek apakah ada loan aktif
  const hasActive = memLoans.some(l => l.asset_id === nid && ['pending', 'approved', 'returning'].includes(l.status));
  if (hasActive) {
    throw new Error('Aset masih memiliki pengajuan/peminjaman aktif');
  }
  if (supabase) {
    try {
      const { count } = await supabase
        .from('loans')
        .select('*', { count: 'exact', head: true })
        .eq('asset_id', nid)
        .in('status', ['pending', 'approved', 'returning']);
      if (count > 0) throw new Error('Aset masih memiliki pengajuan/peminjaman aktif');
      await supabase.from('assets').delete().eq('id', nid);
    } catch (err) {
      throw err;
    }
  }
  memAssets = memAssets.filter(x => x.id !== nid);
  return { deleted: true };
}

// ---------------------------------------------------------------------------
// LOANS
// ---------------------------------------------------------------------------

async function getLoans() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('loans')
        .select(`
          id, start_date, end_date, purpose, status, return_date, return_note, return_condition, loan_letter_url, identity_card_url, created_at,
          asset:assets ( id, code, name, category, asset_type, extra, total_stock, damaged_count ),
          user:users ( id, name, email, role )
        `)
        .order('id', { ascending: false });
      if (!error && data) {
        // Format agar sesuai dengan struktur respon sebelumnya
        return data.map(l => ({
          loan_id: l.id,
          start_date: l.start_date,
          end_date: l.end_date,
          purpose: l.purpose,
          loan_status: l.status,
          loan_created: l.created_at,
          return_date: l.return_date,
          return_note: l.return_note,
          return_condition: l.return_condition,
          loan_letter_url: l.loan_letter_url || null,
          identity_card_url: l.identity_card_url || null,
          asset_id: l.asset?.id,
          code: l.asset?.code,
          asset_name: l.asset?.name,
          category: l.asset?.category,
          asset_type: l.asset?.asset_type,
          extra: l.asset?.extra,
          total_stock: l.asset?.total_stock,
          damaged_count: l.asset?.damaged_count,
          borrowed: 0,
          user_id: l.user?.id,
          user_name: l.user?.name,
          email: l.user?.email,
          role: l.user?.role
        }));
      }
    } catch (_) { }
  }
  return memLoans.map(l => {
    const a = memAssets.find(x => x.id === l.asset_id) || {};
    const u = memUsers.find(x => x.id === l.user_id) || {};
    return {
      loan_id: l.id,
      start_date: l.start_date,
      end_date: l.end_date,
      purpose: l.purpose,
      loan_status: l.status,
      loan_created: l.created_at,
      return_date: l.return_date,
      return_note: l.return_note,
      return_condition: l.return_condition,
      loan_letter_url: l.loan_letter_url || null,
      identity_card_url: l.identity_card_url || null,
      asset_id: a.id,
      code: a.code,
      asset_name: a.name,
      category: a.category,
      asset_type: a.asset_type,
      extra: a.extra,
      total_stock: a.total_stock,
      damaged_count: a.damaged_count,
      borrowed: 0,
      user_id: u.id,
      user_name: u.name,
      email: u.email,
      role: u.role
    };
  }).sort((a, b) => b.loan_id - a.loan_id);
}

async function countOverlapping(assetId, start, end) {
  const nid = Number(assetId);
  if (supabase) {
    try {
      const { count, error } = await supabase
        .from('loans')
        .select('*', { count: 'exact', head: true })
        .eq('asset_id', nid)
        .in('status', ['pending', 'approved', 'returning'])
        .lte('start_date', end)
        .gte('end_date', start);
      if (!error && typeof count === 'number') return count;
    } catch (_) { }
  }
  return memLoans.filter(l =>
    l.asset_id === nid &&
    ['pending', 'approved', 'returning'].includes(l.status) &&
    l.start_date <= end &&
    l.end_date >= start
  ).length;
}

async function createLoan(b) {
  const loanLetter = b.loan_letter_url ? String(b.loan_letter_url).trim() : null;
  const identityCard = b.identity_card_url ? String(b.identity_card_url).trim() : null;

  if (supabase) {
    try {
      const { data, error } = await supabase.from('loans').insert([{
        asset_id: Number(b.asset_id),
        user_id: Number(b.user_id),
        start_date: b.start_date,
        end_date: b.end_date,
        purpose: b.purpose,
        status: 'pending',
        loan_letter_url: loanLetter,
        identity_card_url: identityCard
      }]).select().single();
      if (!error && data) return { id: data.id };
      if (error && (error.message.includes('loan_letter_url') || error.message.includes('identity_card_url'))) {
        const { data: d2, error: e2 } = await supabase.from('loans').insert([{
          asset_id: Number(b.asset_id),
          user_id: Number(b.user_id),
          start_date: b.start_date,
          end_date: b.end_date,
          purpose: b.purpose,
          status: 'pending'
        }]).select().single();
        if (!e2 && d2) return { id: d2.id };
      }
    } catch (_) { }
  }
  const newLoan = {
    id: nextLoanId++,
    asset_id: Number(b.asset_id),
    user_id: Number(b.user_id),
    start_date: b.start_date,
    end_date: b.end_date,
    purpose: b.purpose,
    status: 'pending',
    return_date: null,
    return_note: null,
    return_condition: null,
    loan_letter_url: loanLetter,
    identity_card_url: identityCard,
    created_at: new Date().toISOString()
  };
  memLoans.unshift(newLoan);
  return { id: newLoan.id };
}

async function updateLoanStatus(id, status) {
  const nid = Number(id);
  if (supabase) {
    try {
      await supabase.from('loans').update({ status }).eq('id', nid);
    } catch (_) { }
  }
  const l = memLoans.find(x => x.id === nid);
  if (l) l.status = status;
  return { updated: true };
}

async function returnLoan(id, return_date, return_note) {
  const nid = Number(id);
  if (supabase) {
    try {
      await supabase.from('loans').update({
        status: 'returning',
        return_date,
        return_note
      }).eq('id', nid);
    } catch (_) { }
  }
  const l = memLoans.find(x => x.id === nid);
  if (l) {
    l.status = 'returning';
    l.return_date = return_date;
    l.return_note = return_note;
  }
  return { updated: true };
}

async function completeReturn(id, damaged) {
  const nid = Number(id);
  const condition = damaged ? 'rusak' : 'baik';
  const today = new Date().toISOString().slice(0, 10);

  if (supabase) {
    try {
      const { data: loan } = await supabase.from('loans').select('asset_id, return_date').eq('id', nid).single();
      if (loan) {
        await supabase.from('loans').update({
          status: 'returned',
          return_condition: condition,
          return_date: loan.return_date || today
        }).eq('id', nid);

        if (damaged) {
          const { data: asset } = await supabase.from('assets').select('damaged_count').eq('id', loan.asset_id).single();
          if (asset) {
            await supabase.from('assets').update({ damaged_count: (asset.damaged_count || 0) + 1 }).eq('id', loan.asset_id);
          }
        }
      }
    } catch (_) { }
  }

  const l = memLoans.find(x => x.id === nid);
  if (l) {
    l.status = 'returned';
    l.return_condition = condition;
    l.return_date = l.return_date || today;
    if (damaged) {
      const a = memAssets.find(x => x.id === l.asset_id);
      if (a) a.damaged_count = (a.damaged_count || 0) + 1;
    }
  }
  return { completed: true };
}

// ---------------------------------------------------------------------------
// NOTIFICATIONS
// ---------------------------------------------------------------------------

async function getNotifications(email) {
  const em = (email || '').toLowerCase().trim();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .ilike('recipient_email', em)
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (_) { }
  }
  return memNotifications
    .filter(n => n.recipient_email.toLowerCase() === em)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

async function createNotification(b) {
  const rec = (b.recipient_email || '').toLowerCase().trim();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('notifications').insert([{
        recipient_email: rec,
        title: b.title,
        body: b.body,
        type: b.type,
        loan_id: b.loan_id ? Number(b.loan_id) : null,
        is_read: false
      }]).select().single();
      if (!error && data) return { id: data.id };
    } catch (_) { }
  }
  const newN = {
    id: nextNotifId++,
    recipient_email: rec,
    title: b.title,
    body: b.body,
    type: b.type,
    loan_id: b.loan_id ? Number(b.loan_id) : null,
    is_read: false,
    created_at: new Date().toISOString()
  };
  memNotifications.unshift(newN);
  return { id: newN.id };
}

async function markNotificationRead(id) {
  const nid = Number(id);
  if (supabase) {
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('id', nid);
    } catch (_) { }
  }
  const n = memNotifications.find(x => x.id === nid);
  if (n) n.is_read = true;
  return { updated: true };
}

async function markAllNotificationsRead(email) {
  const em = (email || '').toLowerCase().trim();
  if (supabase) {
    try {
      await supabase.from('notifications').update({ is_read: true }).ilike('recipient_email', em);
    } catch (_) { }
  }
  memNotifications.forEach(n => {
    if (n.recipient_email.toLowerCase() === em) n.is_read = true;
  });
  return { updated: true };
}

module.exports = {
  isConfigured,
  checkConnection,
  findUserByEmail,
  findUserById,
  getAllUsers,
  getAdmins,
  createUser,
  updateUser,
  updateUserPhoto,
  updateUserPassword,
  updateUserRole,
  requestDeleteUser,
  cancelDeleteUserRequest,
  deleteUser,
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset,
  getLoans,
  countOverlapping,
  createLoan,
  updateLoanStatus,
  returnLoan,
  completeReturn,
  getNotifications,
  createNotification,
  markNotificationRead,
  markAllNotificationsRead
};

