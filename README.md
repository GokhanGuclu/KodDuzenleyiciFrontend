# 🐍 Kod Düzenleyici Frontend

Modern Python kod analizi uygulaması - Türkçe hata açıklamaları ve çözüm önerileri ile profesyonel kod kalitesi değerlendirmesi.

## 🚀 Özellikler

- ⚡ **Vite + React 18** - Hızlı geliştirme ve modern UI
- 🔧 **TypeScript** - Tip güvenliği ve gelişmiş IDE desteği
- 🐍 **Python Kod Analizi** - flake8, pycodestyle, pyflakes entegrasyonu
- 🇹🇷 **Türkçe Açıklamalar** - Tüm hata kodları için detaylı Türkçe açıklamalar
- 📊 **Detaylı Raporlar** - Kod kalitesi skorları ve görsel analizler
- 🎨 **Modern UI/UX** - Responsive tasarım ve kullanıcı dostu arayüz
- 🐳 **Docker Desteği** - Kolay deployment ve containerization
- 📁 **Path Mapping** - Kolay import yolları (@/components, @/services, vb.)

## 📁 Proje Yapısı

```
src/
├── components/              # React bileşenleri
│   ├── FileUpload.tsx      # Dosya yükleme bileşeni
│   ├── Report.tsx          # Analiz raporu bileşeni
│   ├── CodeComparison.tsx  # Kod karşılaştırma bileşeni
│   └── CircularProgressBar.tsx # İlerleme çubuğu
├── services/               # Servis katmanı
│   ├── ReportService.ts    # API servisleri
│   └── TurkishCodeAnalyzer.ts # Türkçe hata açıklamaları
├── App.tsx                 # Ana uygulama bileşeni
├── main.tsx               # Uygulama giriş noktası
└── index.css              # Global stiller
```

## 🛠️ Kurulum

### Geliştirme Ortamı

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

3. Tarayıcınızda `http://localhost:5173` adresini açın.

### Docker ile Çalıştırma

1. Docker image'ını build edin:
```bash
docker build -t kod-duzeltme-frontend .
```

2. Container'ı çalıştırın:
```bash
docker run -d -p 3000:3000 --name kod-duzeltme-frontend kod-duzeltme-frontend
```

3. Windows için otomatik rebuild:
```bash
rebuild-docker.bat
```

## 📜 Mevcut Komutlar

- `npm run dev` - Geliştirme sunucusunu başlatır
- `npm run build` - Production build oluşturur
- `npm run preview` - Build'i önizler
- `npm run lint` - ESLint ile kod kontrolü
- `npm run type-check` - TypeScript tip kontrolü

## 🎯 Ana Bileşenler

### FileUpload
- Drag & drop dosya yükleme
- Python dosya formatı desteği
- Gerçek zamanlı dosya validasyonu
- Modern UI ile kullanıcı dostu deneyim

### Report
- Detaylı kod analizi raporları
- İki görünüm modu: Tümü ve Sırayla
- Türkçe hata açıklamaları
- Kod karşılaştırma özelliği
- İstatistiksel analizler

### CodeComparison
- Yanlış vs Doğru kod karşılaştırması
- Syntax highlighting
- Çözüm önerileri
- Modal popup görünümü

### TurkishCodeAnalyzer
- 1000+ hata kodu için Türkçe açıklamalar
- E, F, W, C, N kodları desteği
- Detaylı çözüm önerileri
- Kod örnekleri

## 🔧 Konfigürasyon

### TypeScript
- `tsconfig.json` - Strict mode aktif
- Path mapping ile kolay import'lar
- Modern ES2022 desteği

### Vite
- `vite.config.ts` - Hızlı build ve HMR
- Path alias desteği (@/components, @/services)
- Optimized production builds

### Docker
- `Dockerfile` - Multi-stage build
- Alpine Linux base image
- Production-ready configuration
- `.dockerignore` - Optimized build context

## 📱 Responsive Tasarım

Proje tüm cihazlarda mükemmel çalışır:
- **Mobil-first** yaklaşım
- **Touch-friendly** butonlar ve etkileşimler
- **Esnek grid** sistemi
- **Modern CSS** ile smooth animasyonlar

## 🚀 Backend Entegrasyonu

- **RESTful API** ile backend iletişimi
- **Polling** mekanizması ile asenkron analiz
- **Error handling** ve retry logic
- **Loading states** ve progress indicators

## 🎨 UI/UX Özellikleri

- **Modern gradient** tasarımlar
- **Smooth animations** ve transitions
- **Dark/Light** tema desteği
- **Accessibility** standartları
- **Loading states** ve error handling
- **Responsive** grid layout

## 📊 Analiz Özellikleri

- **PEP 8** uyumluluk kontrolü
- **Code complexity** analizi
- **Naming conventions** kontrolü
- **Import optimization** önerileri
- **Syntax error** tespiti
- **Performance** önerileri

## 🔍 Hata Kodları

Desteklenen hata kategorileri:
- **E kodları** - PEP 8 style violations
- **F kodları** - Pyflakes unused imports/variables
- **W kodları** - Style warnings
- **C kodları** - Complexity warnings
- **N kodları** - Naming convention violations

## 📄 Lisans

MIT License - Detaylar için LICENSE dosyasına bakın.

---

**Geliştirici:** Gökhan Güçlü  
**Tarih:** 2024  
**Versiyon:** 1.0.0