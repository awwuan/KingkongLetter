# Kingkong Private Letter — Mobile First

Website surat pribadi dengan desain dark, clean, modern, dan mobile-first.

## Fitur
- Loading 0–100% dengan logo Kingkong mengikuti progress bar.
- Home berupa amplop interaktif dengan animasi membuka.
- PIN 6 digit melalui bottom-sheet yang nyaman di HP.
- PIN: `200026`.
- Surat 2 lembar dengan highlight di atas tiap lembar.
- Efek typewriter + sound effect menggunakan Web Audio API.
- Kata `SYOK`, `BERTEMAN`, `Dear Mb Reza,` dan kalimat penutup dibuat bold.
- Setelah lembar pertama selesai ditulis, countdown membaca 5 menit dimulai.
- Tombol **Lanjut sekarang** untuk melewati countdown.
- Jika tombol tidak ditekan, otomatis masuk lembar kedua saat 5 menit habis.
- Lembar kedua tidak berpindah otomatis. Tetap terbuka sampai tombol **Akhiri surat** ditekan.
- Background bintang + shooting stars, tetapi tetap dibuat ringan untuk mobile.
- Responsive untuk layar kecil dan safe-area iPhone.

## Menjalankan
```bash
npm install
npm run dev
```

## Build production
```bash
npm run build
```

Hasil build ada di folder `dist`.

## Mengganti logo
Ganti file:
`public/kingkong-logo.svg`

## Mengubah PIN
Edit konstanta `OTP_CODE` di `src/App.jsx`.

## Mengubah waktu membaca
Edit konstanta `READ_SECONDS` di `src/App.jsx`.

## Kontrol ukuran teks
Di halaman surat tersedia kontrol `A− | 16 | A+` pada navigation bar.
- Ukuran default isi surat: **16px**.
- Bisa diubah dari **14px sampai 20px**.
- Tekan angka tengah untuk reset ke **16px**.
- Pilihan ukuran tersimpan otomatis di browser.
