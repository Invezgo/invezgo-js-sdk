# 📦 Panduan Publikasi ke NPM

Panduan lengkap untuk mempublikasikan `@invezgo/sdk` ke NPM registry.

## 📋 Prasyarat

1. **Akun NPM**
   - Daftar di [npmjs.com](https://www.npmjs.com/signup) jika belum punya
   - Jika menggunakan scoped package (`@invezgo/sdk`), pastikan organisasi `@invezgo` sudah dibuat di NPM

2. **Login ke NPM**
   ```bash
   npm login
   ```
   Masukkan username, password, dan email Anda.

3. **Verifikasi Login**
   ```bash
   npm whoami
   ```

## 🔧 Langkah-Langkah Publikasi

### 1. Pastikan Build Berhasil

Pastikan kode sudah di-build dengan benar:

```bash
npm run build
```

Ini akan menghasilkan:
- `dist/index.js` (CommonJS)
- `dist/index.esm.js` (ES Modules)
- `dist/index.d.ts` (TypeScript declarations)

### 2. Periksa File yang Akan Dipublish

Pastikan file yang akan dipublish sesuai dengan `files` di `package.json`:

```json
"files": [
  "dist",
  "README.md",
  "LICENSE"
]
```

Untuk melihat file apa saja yang akan dipublish, jalankan:

```bash
npm pack --dry-run
```

### 3. Verifikasi package.json

Pastikan informasi penting sudah benar:

```json
{
  "name": "@invezgo/sdk",
  "version": "1.0.0",
  "description": "...",
  "author": "Invezgo",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/Invezgo/invezgo-js-sdk.git"
  }
}
```

### 4. Publish ke NPM

#### Untuk Public Package (Default)

```bash
npm publish --access public
```

**Catatan:** Scoped packages (`@invezgo/sdk`) defaultnya adalah private, jadi harus menggunakan flag `--access public`.

#### Untuk Private Package

Jika ingin membuat package private:

```bash
npm publish
```

Anda perlu upgrade ke NPM Pro untuk private packages.

### 5. Verifikasi Publikasi

Setelah publish, cek di:

- **NPM Registry**: https://www.npmjs.com/package/@invezgo/sdk
- **Install Test**: 
  ```bash
  npm install @invezgo/sdk
  ```

## 🔄 Update Versi (Untuk Release Berikutnya)

Untuk update versi, gunakan semantic versioning:

### Patch (1.0.0 → 1.0.1)
```bash
npm version patch
npm publish --access public
```

### Minor (1.0.0 → 1.1.0)
```bash
npm version minor
npm publish --access public
```

### Major (1.0.0 → 2.0.0)
```bash
npm version major
npm publish --access public
```

Atau edit `package.json` secara manual, lalu:

```bash
npm publish --access public
```

## 🏷️ Git Tag (Opsional tapi Disarankan)

Setelah publish, buat git tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Atau gunakan `npm version` yang otomatis membuat tag:

```bash
npm version patch --git-tag-version true
git push && git push --tags
npm publish --access public
```

## 🚨 Troubleshooting

### Error: "You do not have permission to publish"

**Solusi:**
1. Pastikan Anda sudah login: `npm whoami`
2. Untuk scoped package, pastikan Anda adalah owner organisasi `@invezgo`
3. Jika belum, minta owner untuk menambahkan Anda sebagai collaborator

### Error: "Package name already exists"

**Solusi:**
- Package dengan nama yang sama sudah ada. Ubah versi di `package.json` atau gunakan nama yang berbeda.

### Error: "Invalid package name"

**Solusi:**
- Nama package harus lowercase, tidak boleh ada spasi
- Scoped package harus format: `@scope/name`

### Error: "Cannot publish over existing version"

**Solusi:**
- Versi yang ingin dipublish sudah ada. Update versi di `package.json`

## 📝 Checklist Sebelum Publish

- [ ] Build berhasil (`npm run build`)
- [ ] Semua test (jika ada) passing
- [ ] `package.json` sudah benar (name, version, description, author)
- [ ] README.md sudah lengkap
- [ ] LICENSE ada dan sesuai
- [ ] `.npmignore` atau `files` di package.json sudah benar
- [ ] Sudah login ke NPM (`npm whoami`)
- [ ] Versi sudah sesuai (semantic versioning)

## 🔐 Keamanan

### API Key di Code

Pastikan tidak ada API key yang hardcoded di:
- Source code
- README.md
- Contoh code
- Commit history

Gunakan environment variables atau `.env` file.

### .npmignore

Pastikan file sensitif tidak terpublish:

```
.env
.env.local
*.log
node_modules
.vscode
.idea
.DS_Store
src/
tsconfig.json
rollup.config.js
```

## 🎯 Best Practices

1. **Semantic Versioning**: Ikuti semver (MAJOR.MINOR.PATCH)
2. **CHANGELOG.md**: Buat file changelog untuk dokumentasi perubahan
3. **Git Tags**: Tag setiap release dengan versi
4. **Release Notes**: Tulis release notes di GitHub Releases
5. **Testing**: Test install package sebelum publish final

## 📚 Referensi

- [NPM Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [Scoped Packages](https://docs.npmjs.com/about-scoped-packages)

