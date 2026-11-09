// Menentukan nama tempat data disimpan di localStorage
const KUNCI_STORAGE = 'E_REPORT_DATA';


1. //variabel global utk menyimpan data laporan
let daftarLaporan = [];

//fungsi muat data itu di eksekusi saat halaman html selesai dimuat
document.addEventListener('DOMContentLoaded', muatData);

2. //READ => mengambil data dari data.js
function muatData() {
    daftarLaporan = typeof dataAwalLaporan !== 'undefined' ? [...dataAwalLaporan] : [];
    //console.log(daftarLaporan);
    tampilkanDataTable();
}

 //menampilkan data laporan ke halaman web
function tampilkanDataTable() {
    const tabelBody = document.getElementById('reports-table-body');
    // memastikan tablebody kosong
    tabelBody.innerHTML = '';

    //menampilkan baris data laporan ke table body
    daftarLaporan.forEach((laporan) => {
        tabelBody.appendChild(buatBarisLaporan(laporan));
    });
    
}

//membuat 1 baris tr, untuk 1 laporan

// membuat 1 baris tr, untuk 1 laporan (Sudah disesuaikan dengan Class CSS kamu!)
function buatBarisLaporan(laporan) {
    // membuat tr baru
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

// 3. fungsi untuk menambahkan data laporan baru
function handleFormSubmit(event) {
    event.preventDefault(); // Mencegah refresh halaman

    //mengambil isi form
    const form = event.target;
    const nama = form.reporter.value.trim();
    const kategori = form.category.value;
    const deskripsi = form.description.value.trim();

    //pengecekan value (validasi) => mengecek apakah semua input sudah diisi
    if (!nama || !kategori || !deskripsi) {
        return console.log('Mohon lengkapi semua data!');
    }

    //membuat object laporan baru
    const laporanBaru = {
         id: `rep-${Date.now()}`, //menggunakan timestamp sebagai id unik, 
        pelapor: nama,
        kategori: kategori,
        deskripsi: deskripsi,
        status: 'Menunggu'
    };

    //menambah laporan baru ke data lama
    daftarLaporan.unshift(laporanBaru);
    // Menyimpan data ke localStorage
    simpanData();
    tampilkanDataTable();

    daftarLaporan.unshift(laporanBaru);
    simpanData();
    tampilkanDataTable();
    updateStatistik(); // <-- Tambahkan baris ini!

    //utk mengosongkan form
    form.reset();

    // Fungsi untuk memperbarui angka total dan status menunggu pada kartu statistik
function updateStatistik() {
    // Ambil elemen HTML berdasarkan class atau id-nya
    const totalEl = document.querySelector('.stat-value-total') || document.querySelectorAll('.stat-value')[0];
    const waitingEl = document.querySelector('.stat-value-waiting') || document.querySelectorAll('.stat-value')[1];

    if (!totalEl || !waitingEl) return;

    // Hitung total laporan
    const totalLaporan = daftarLaporan.length;

    // Hitung laporan yang statusnya 'Menunggu' (case-insensitive)
    const totalMenunggu = daftarLaporan.filter(laporan => 
        (laporan.status || '').toLowerCase() === 'menunggu'
    ).length;

    // Tampilkan angka ke HTML
    totalEl.textContent = totalLaporan;
    waitingEl.textContent = totalMenunggu;
}

    //sweet alert
    Swal.fire({
  position: "top-end",
  icon: "success",
  title: "Laporan berhasil dikirim!",
  showConfirmButton: false,
  timer: 1500
});
}

// proses menyimpan data ke localStorage
function simpanData() {
    localStorage.setItem(KUNCI_STORAGE, JSON.stringify(daftarLaporan));
}