# YolHava – CLAUDE.md

## Amaç
Yola çıkmadan ve yolda; güzergâh boyunca **varış saatine göre hava** (yağmur, kar, sis, buzlanma, rüzgâr), **kaza / yol çalışması / kapalı yol** ve **trafik yoğunluğu** gösteren mobil yolculuk uygulaması. Düzenli seferler (ör. Mersin–Adana) kaydedilir, sesli yol tarifi ve sürüş modu vardır. Yalnızca telefondan geliştirilir ve test edilir.

## Sahiplik ve yayın
- Hak sahibi ve yayıncı: **Yurdagül Güler** (geliştirici memur; onun adı hiçbir yerde geçmez).
- Destek: yolhava.destek@gmail.com • Play paketi: **com.yolhava.android** (com.yolhava.app başkasına ait)
- Play: kapalı test (Test Ekibi listesi, 14 kişi). TWA (PWABuilder), konum delegasyonu **kapalı**.

## Altyapı (hepsi ücretsiz katman)
| Parça | Yer |
|---|---|
| Uygulama (karıştırılmış index.html, sw.js, yasal sayfalar, LICENSE) | GitHub **YOLHAVA** (açık) → GitHub Pages `nalciguler-netizen.github.io/YOLHAVA/` |
| Okunabilir kaynak + sunucu kodu + bu dosya | GitHub **yolhava-sunucu** (gizli) → `kaynak/`, `worker.js`, `wrangler.jsonc` |
| Sunucu | Cloudflare Worker **yolhava-api** (`yolhava-api.yolhava-destek.workers.dev`), gizli depoya bağlı (yükle → otomatik yayın) |
| Veritabanı | Cloudflare D1 **yolhava** (bildirimler, oylar, günlük kullanım sayacı) |
| Site doğrulama | **nalciguler-netizen.github.io** deposu → `.well-known/assetlinks.json` (tüm uygulamalar ortak) |
| Harita | OpenFreeMap (yedek: OSM) • Hava: Open-Meteo (doğrudan, sunucudan değil) |
| Rota, hız sınırı, trafik, kaza | TomTom (anahtar yalnızca Cloudflare'de `TOMTOM_KEY` secret) • Yedek rota: OSRM |
| Adres arama / istasyonlar | Photon • Overpass |

## Alınmış kararlar
- İlk yayın **ücretsiz ve reklamsız**; `BETA_ALL_PRO=true`. 500–1000 indirmeden sonra abonelik.
- Fiyat: aylık 1,99 $, yıllık 14,99 $; lansman: 7 gün deneme + 12 ay 0,50 $/ay (1000 abonede kapanır); geçişte mevcut kullanıcılara 14 gün ek Pro.
- Her zaman ücretsiz: rota, alternatifler, sesli tarif, kaza/yol uyarıları, genel hava rozeti, hız sınırı tabelası, 1 kayıtlı sefer.
- Pro: hava ayrıntıları, en iyi çıkış saati, sesli hava uyarıları, tüm katmanlar + 72 sa animasyon, canlı trafik katmanı, aşım uyarısı, sınırsız sefer, çevrimdışı indirme.
- Kaza/yol bilgisi **rota cevabından** (sectionType=traffic) gelir; ayrıntılı kaza servisi kapalı (`INC_DETAILS=false`, aylık kota 2.500).
- Sıkışık yollar rota çizgisinde turuncu/kırmızı; ileri saatli seferde gösterilmez.
- Kullanıcı bildirimi: yalnızca hazır kategoriler, rastgele cihaz no., en geç 1 günde silinir.
- Frenler: IP başına dakikada 60 (karo 600), Cloudflare Rate Limiter (namespace **2001**), günlük TomTom kotası (rota 600, karo 6000).
- Koşullar sürümü `TERMS_VER=2`: onay kutusu zorunlu; her sürüş başında güvenlik uyarısı.

## Yapılmaması gerekenler
- **Radar/EDS/polis** bildirimi veya uyarısı ekleme (yasal risk). Serbest metinli kullanıcı notu ekleme.
- Herhangi bir **anahtarı** koda, depoya veya sohbete yazma. Ücretli servis ya da kart gerektiren plan seçme (önce gelir).
- Okunabilir kodu **açık depoya** yükleme; değişiklikleri hep `kaynak/` üzerinde yap, açık depoya karıştırılmış (esbuild minify + IIFE) kopyayı ver.
- Open-Meteo'yu ticari plan olmadan sunucudan geçirme (IP başı sınır). Paket adını, imza anahtarını, assetlinks'i habersiz değiştirme.
- Başka uygulamanın dosyalarını bu konuşmaya karıştırma. Güncellemede yalnız değişen dosyaları, test edilmiş tek paket hâlinde ver.

## Ticari kullanım kuralları
- Kaynak kod ve tasarım: **tüm hakları saklıdır** (LICENSE, FSEK). Üçüncü taraf veriler kendi lisansıyla: OSM (ODbL, atıf), Open-Meteo (CC BY 4.0, **ticari planla** satış), TomTom (kota/plan), OpenFreeMap, Leaflet/MapLibre (BSD).
- **Pro açılmadan önce:** Open-Meteo ticari plan, Play Billing, yasal metinlere ödeme/iade bölümü, veri güvenliğine satın alma geçmişi, GİB 20/B belgesi, kuruma bildirim + yazılı hukuki görüş, koşulların avukata okutulması.
- Sorumluluk: bilgiler tahmindir, trafik işaretleri önceliklidir; sınırlama TBK m.115'e uygun (kast/ağır kusur hariç), tüketici hakları saklı. Hata bildirimleri kayıt altına alınıp düzeltilir.
- Kişisel veri: hesap yok, konum yalnız uygulama açıkken; KVKK/GDPR metinleri `gizlilik.html` / `privacy.html`.
