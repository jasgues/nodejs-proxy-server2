# 🚀 Node.js ile Geliştirilmiş Proxy Sunucusu

Bu proje, **Node.js**'in dahili modülleri (`http` ve `net`) kullanılarak geliştirilmiş, hem **HTTP** hem de **HTTPS** trafiğini yönetebilen basit ve temel bir **proxy sunucusudur**.
Ağ programlama temellerini, HTTP/HTTPS protokollerinin işleyişini ve Node.js'in asenkron yeteneklerini anlamak için harika bir başlangıç noktasıdır.

---

## ✨ Özellikler

* **HTTP İstek Yönlendirme:** Standart HTTP trafiğini hedef sunucuya iletir.
* **HTTPS Tünelleme Desteği:** `CONNECT` metodunu kullanarak şifreli HTTPS trafiği için güvenli bir tünel oluşturur.
* **Saf Node.js:** Harici hiçbir npm paketine bağımlılığı yoktur.
* **Basit ve Anlaşılır Kod:** Öğrenme ve geliştirme amacıyla kolayca anlaşılabilir.
* **Çoklu Bağlantı Yönetimi:** Node.js'in asenkron yapısı sayesinde birden fazla bağlantıyı verimli şekilde yönetir.

---

## 🛠️ Kullanılan Teknolojiler

* **Node.js**

  * Dahili **http** Modülü → HTTP sunucusu oluşturmak ve istekleri yönetmek için.
  * Dahili **net** Modülü → HTTPS tünellemesi için TCP soket bağlantıları oluşturmak için.

---

## ⚙️ Kurulum ve Çalıştırma

Bu projeyi çalıştırmak için sisteminizde **Node.js** kurulu olması yeterlidir.

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/KULLANICI_ADINIZ/PROJE_ADINIZ.git
cd PROJE_ADINIZ
```

### 2. Yerel Makinede Çalıştırma

Herhangi bir harici paket gerektirmez. Doğrudan çalıştırabilirsiniz:

```bash
node proxy.js
```

Başarıyla çalıştığında terminalde aşağıdaki çıktıyı göreceksiniz:

```bash
Node.js Proxy Sunucu 127.0.0.1:9999 üzerinde dinlemede... ✅
```

### 3. Proxy'yi Test Etme

#### Tarayıcı Ayarları

* Web tarayıcınızın (Chrome, Firefox vb.) Ağ Ayarlarına gidin.
* Manuel Proxy Yapılandırması’nı seçin.
* **HTTP Proxy:** `127.0.0.1`
* **Port:** `9999`
* Ayarları kaydedin ve HTTP/HTTPS sitelerini ziyaret edin.

#### Komut Satırı (curl)

```bash
# HTTP Testi
curl -x http://127.0.0.1:9999 http://example.com

# HTTPS Testi
curl -x http://127.0.0.1:9999 https://www.google.com
```

---

## ☁️ Sunucuya Kurulum (Deployment)

Bu proxy sunucusunu bir VPS’e (örn. Google Cloud, DigitalOcean) kurmak için:

1. **Node.js Kurulumu:** Sunucunuza Node.js’i nvm gibi bir araçla kurun.
2. **Kod Değişikliği:** `proxy.js` dosyasındaki `HOST` değişkenini güncelleyin:

   ```js
   const HOST = '0.0.0.0'; // Dış bağlantıları kabul etmesi için
   ```
3. **Güvenlik Duvarı (Firewall):** Bulut sağlayıcınızın güvenlik panelinden ve sunucunun kendi güvenlik duvarından (örn: ufw, firewalld) `9999/tcp` portuna izin verin.
4. **Servis Olarak Çalıştırma (PM2):** SSH bağlantısı kapandığında da çalışması için:

   ```bash
   # PM2'yi global olarak yükleyin
   sudo npm install pm2 -g

   # Uygulamayı başlatın
   pm2 start proxy.js --name "my-proxy"

   # Sunucu yeniden başladığında PM2'nin de başlaması için
   pm2 startup
   pm2 save
   ```

---

## ⚠️ Önemli Güvenlik Uyarısı

Bu proxy'nin mevcut halinde **kimlik doğrulama (authentication) mekanizması yoktur**.
`0.0.0.0/0` (tüm internet) ayarıyla açıldığında, **Açık Proxy (Open Proxy)** haline gelir.
Bu durum, sunucunuzun kötü niyetli faaliyetler için kullanılmasına ve IP adresinizin kara listeye girmesine neden olabilir.

🔒 **Ciddi kullanım öncesinde, `Proxy-Authorization` başlığını kontrol eden bir kimlik doğrulama katmanı eklemeniz şiddetle tavsiye edilir.**

---

## 🗺️ Gelecek Planları / Roadmap

* [ ] Kimlik Doğrulama: Basic Auth (Proxy-Authorization) desteği
* [ ] Önbellekleme (Caching)
* [ ] İçerik Filtreleme
* [ ] Detaylı Loglama

---

## 🤝 Katkıda Bulunma

Katkılarınız için her zaman açığız!

* Pull request açabilir
* Issue oluşturabilirsiniz.

---

## 📄 Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır.
Detaylar için [LICENSE](LICENSE) dosyasına göz atın.
