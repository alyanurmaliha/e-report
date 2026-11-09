// Menentukan nama tempat data disimpan di localStorage
const KUNCI_STORAGE = 'E_REPORT_DATA';

// 1. Variabel global utk menyimpan data laporan
let daftarLaporan = [];

// Fungsi muat data & event listener dimuat saat halaman HTML selesai siap
document.addEventListener('DOMContentLoaded', () => {
    muatData();

    // Memasang listener form HANYA 1x di sini
    const formEl = document.getElementById('report-form');
    if (formEl) {
        formEl.addEventListener('submit', handleFormSubmit);
    }
});

// 2. READ => mengambil data dari localStorage / data.js
function muatData() {
    // Cek dulu apakah ada data di localStorage, kalau tidak ada pakai dataAwalLaporan dari data.js
    const dataLokal = localStorage.getItem(KUNCI_STORAGE);
    if (dataLokal) {
        daftarLaporan = JSON.parse(dataLokal);
    } else {
        daftarLaporan = typeof dataAwalLaporan !== 'undefined' ? [...dataAwalLaporan] : [];
    }

    tampilkanDataTable();
    updateStatistik();
}

// Menampilkan data laporan ke halaman web
function tampilkanDataTable() {
    const tabelBody = document.getElementById('reports-table-body');
    if (!tabelBody) return;

    // Memastikan tablebody kosong
    tabelBody.innerHTML = '';

    // Menampilkan baris data laporan ke table body
    daftarLaporan.forEach((laporan) => {
        tabelBody.appendChild(buatBarisLaporan(laporan));
    });
}

// Membuat 1 baris tr untuk 1 laporan (Sesuai Class CSS kamu)
function buatBarisLaporan(laporan) {
    const baris = document.createElement('tr');
    
    // Mengubah status ke huruf kecil ('menunggu' / 'selesai') agar sesuai class CSS
    const statusClass = (laporan.status || 'Menunggu').toLowerCase();

    // Fungsi bantu ambil inisial nama pelapor buat avatar lingkaran
    const inisial = laporan.pelapor 
        ? laporan.pelapor.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
        : '??';

    baris.innerHTML = `
        <td>
            <div class="pelapor-cell">
                <div class="pelapor-avatar">${inisial}</div>
                <div>
                    <strong>${laporan.pelapor}</strong>
                    <small>Pelapor</small>
                </div>
            </div>
        </td>

        <td>
            <span class="category-badge">${laporan.kategori}</span>
        </td>

        <td class="deskripsi-text">${laporan.deskripsi}</td>

        <td>
            <span class="badge-status ${statusClass}">${laporan.status}</span>
        </td>
    `;
    
    return baris;
}

// 3. Fungsi untuk menambahkan data laporan baru
function handleFormSubmit(event) {
    event.preventDefault(); // Mencegah refresh halaman

    // Mengambil isi form
    const form = event.target;
    const nama = form.reporter ? form.reporter.value.trim() : '';
    const kategori = form.category ? form.category.value : '';
    const deskripsi = form.description ? form.description.value.trim() : '';

    // Pengecekan validasi => mengecek apakah semua input sudah diisi
    if (!nama || !kategori || !deskripsi) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Mohon lengkapi semua data!'
        });
        return;
    }

    // Membuat object laporan baru
    const laporanBaru = {
        id: `rep-${Date.now()}`,
        pelapor: nama,
        kategori: kategori,
        deskripsi: deskripsi,
        status: 'Menunggu'
    };

    // Menambah laporan baru ke data (HANYA 1 KALI)
    daftarLaporan.unshift(laporanBaru);
    
    // Simpan ke localStorage, update tabel, dan update kartu statistik
    simpanData();
    tampilkanDataTable();
    updateStatistik();

    // Mengosongkan form setelah submit
    form.reset();

    // Notifikasi SweetAlert
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Laporan berhasil dikirim!",
        showConfirmButton: false,
        timer: 1500
    });
}

// Fungsi untuk memperbarui angka total dan status menunggu pada kartu statistik
function updateStatistik() {
    const totalEl = document.querySelector('.stat-value-total') || document.querySelectorAll('.stat-value')[0];
    const waitingEl = document.querySelector('.stat-value-waiting') || document.querySelectorAll('.stat-value')[1];

    if (!totalEl || !waitingEl) return;

    // Hitung total laporan
    const totalLaporan = daftarLaporan.length;

    // Hitung laporan yang statusnya 'Menunggu'
    const totalMenunggu = daftarLaporan.filter(laporan => 
        (laporan.status || '').toLowerCase() === 'menunggu'
    ).length;

    // Tampilkan angka ke HTML
    totalEl.textContent = totalLaporan;
    waitingEl.textContent = totalMenunggu;
}

// Proses menyimpan data ke localStorage
function simpanData() {
    localStorage.setItem(KUNCI_STORAGE, JSON.stringify(daftarLaporan));
}