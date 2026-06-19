# Disc — Kalkulator Diskon Bertingkat

Kalkulator diskon berurutan (bertingkat) oleh [iceyuki](https://iceyuki.com).

Live: **https://disc.iceyuki.com**

## Apa ini?

Hitung diskon yang diterapkan **satu per satu**, bukan dijumlahkan.

Contoh: `10+19+5+25` bukan 59%, melainkan **48.06%** diskon efektif.

```
100.000 → -10% → 90.000 → -19% → 72.900 → -5% → 69.255 → -25% → 51.941
```

## Fitur

- Input diskon dipisah `+` (contoh: `9+10+5+25`)
- Hasil diskon efektif dengan animasi count-up
- Chip per tingkat diskon
- Tombol **Full** — salin `45+10+85+10 = 93.32%`
- Tombol **%** — salin `93.32%` saja
- Tombol clear (×)
- Input hanya angka dan `+` (emoji, `%`, huruf diblokir)
- Nuansa es biru, mobile-friendly
- 100% client-side — tanpa server, tanpa database

## Struktur

```
index.html   → halaman utama
style.css    → tampilan
app.js       → logika kalkulator
```

## Cara pakai lokal

Buka langsung `index.html` di browser, atau:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

Lalu buka `http://localhost:8080`

## Deploy

Upload ketiga file (`index.html`, `style.css`, `app.js`) ke hosting statis:

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages

Arahkan subdomain `disc` ke folder tersebut untuk `disc.iceyuki.com`.

## Rumus

```
harga_akhir = harga_awal × (1 - d₁/100) × (1 - d₂/100) × ...
diskon_efektif = (1 - harga_akhir / harga_awal) × 100
```

## Lisensi

MIT