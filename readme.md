🚀 Node.js ile Geliştirilmiş Proxy Sunucusu
Bu proje, Node.js'in dahili modülleri (http ve net) kullanılarak geliştirilmiş, hem HTTP hem de HTTPS trafiğini yönetebilen basit ve temel bir proxy sunucusudur. Ağ programlama temellerini, HTTP/HTTPS protokollerinin işleyişini ve Node.js'in asenkron yeteneklerini anlamak için harika bir başlangıç noktasıdır.

✨ Özellikler
HTTP İstek Yönlendirme: Standart HTTP trafiğini hedef sunucuya iletir.

HTTPS Tünelleme Desteği: CONNECT metodunu kullanarak şifreli HTTPS trafiği için güvenli bir tünel oluşturur.

Saf Node.js: Harici hiçbir npm paketine bağımlılığı yoktur.

Basit ve Anlaşılır Kod: Öğrenme ve geliştirme amacıyla kolayca anlaşılabilir şekilde yazılmıştır.

Çoklu Bağlantı Yönetimi: Node.js'in asenkron yapısı sayesinde birden fazla bağlantıyı verimli bir şekilde yönetir.

🛠️ Kullanılan Teknolojiler
Node.js

Dahili http Modülü: HTTP sunucusu oluşturmak ve istekleri yönetmek için.

Dahili net Modülü: HTTPS tünellemesi için TCP soket bağlantıları oluşturmak için.

⚙️ Kurulum ve Çalıştırma
Bu projeyi çalıştırmak için sisteminizde Node.js'in kurulu olması yeterlidir.

1. Projeyi Klonlayın
Bash

git clone https://github.com/KULLANICI_ADINIZ/PROJE_ADINIZ.git
cd PROJE_ADINIZ
2. Yerel Makinede Çalıştırma
Proje herhangi bir harici paket gerektirmez. Doğrudan çalıştırabilirsiniz:

Bash

node proxy.js
Başarıyla çalıştığında terminalde aşağıdaki gibi bir mesaj göreceksiniz:

Node.js Proxy Sunucu 127.0.0.1:9999 üzerinde dinlemede... ✅
3. Proxy'yi Test Etme
Proxy sunucunuz artık 127.0.0.1 adresinde 9999 portunda çalışıyor. Test etmek için:

Tarayıcı Ayarları:

Web tarayıcınızın (Chrome, Firefox vb.) Ağ Ayarlarına gidin.

Manuel Proxy Yapılandırması'nı seçin.

HTTP Proxy: 127.0.0.1

Port: 9999

Ayarları kaydedin ve hem HTTP hem de HTTPS sitelerini ziyaret etmeyi deneyin.

Komut Satırı (curl):

Bash

# HTTP Testi
curl -x http://127.0.0.1:9999 http://example.com

# HTTPS Testi
curl -x http://127.0.0.1:9999 https://www.google.com
☁️ Sunucuya Kurulum (Deployment)
Bu proxy sunucusunu bir VPS'e (örn: Google Cloud, DigitalOcean) kurmak için aşağıdaki adımları izleyin:

Node.js Kurulumu: Sunucunuza Node.js'i nvm gibi bir araçla kurun.

Kod Değişikliği: proxy.js dosyasındaki HOST değişkenini dışarıdan bağlantı kabul etmesi için '0.0.0.0' olarak güncelleyin.

JavaScript

const HOST = '0.0.0.0'; // Dış bağlantıları kabul etmesi için
Güvenlik Duvarı (Firewall): Bulut sağlayıcınızın güvenlik duvarı panelinden ve sunucunun kendi güvenlik duvarından (örn: ufw, firewalld) proxy portuna (örn: 9999/tcp) izin verin.

Servis Olarak Çalıştırma (PM2): SSH bağlantısı kapandığında sunucunun durmaması için PM2 gibi bir process manager kullanın.

Bash

# PM2'yi global olarak yükleyin
sudo npm install pm2 -g

# Uygulamayı başlatın
pm2 start proxy.js --name "my-proxy"

# Sunucu yeniden başladığında PM2'nin de başlaması için
pm2 startup
pm2 save
⚠️ Önemli Güvenlik Uyarısı
Bu proxy'nin mevcut haliyle bir kimlik doğrulama (authentication) mekanizması yoktur. 0.0.0.0/0 (tüm internet) ayarıyla dış dünyaya açıldığında, IP adresinizi bilen herkesin kullanabileceği bir Açık Proxy (Open Proxy) haline gelir. Bu durum, sunucunuzun kötü niyetli faaliyetler için kullanılmasına ve IP adresinizin kara listelere girmesine neden olabilir.

Ciddi kullanım öncesinde, Proxy-Authorization başlığını kontrol eden bir kimlik doğrulama katmanı eklemeniz şiddetle tavsiye edilir.

🗺️ Gelecek Planları / Roadmap
[ ] Kimlik Doğrulama: Basic Auth (Proxy-Authorization) desteği eklemek.

[ ] Önbellekleme (Caching): Sık istenen içerikleri önbelleğe alarak performansı artırmak.

[ ] İçerik Filtreleme: Belirli alan adlarını veya içerik türlerini engelleme yeteneği.

[ ] Detaylı Loglama: Gelen/giden istekleri bir dosyaya kaydetmek.

🤝 Katkıda Bulunma
Katkılarınız için her zaman açığız! Lütfen bir pull request açın veya bir issue oluşturarak fikirlerinizi ve bulduğunuz hataları bizimle paylaşın.

📄 Lisans
Bu proje MIT Lisansı altında lisanslanmıştır. Detaylar için LICENSE dosyasına göz atın.