// Gerekli modülleri içeri aktarıyoruz
const http = require('http');
const net = require('net');
const { URL } = require('url');

// Proxy sunucumuzun çalışacağı port
const PORT = 9999;
const HOST = '0.0.0.0';//127.0.0.1

// 1. HTTP Sunucusunu Oluşturma
const server = http.createServer((req, res) => {
    // Bu kısım sadece normal HTTP istekleri için çalışır
    console.log(`HTTP İstek: ${req.method} ${req.url}`);

    // Hedef sunucuya gönderilecek seçenekleri hazırlıyoruz
    const options = {
        hostname: req.headers.host,
        port: 80, // HTTP için varsayılan port
        path: req.url,
        method: req.method,
        headers: req.headers,
    };

    // Hedef sunucuya proxy isteği oluşturuyoruz
    const proxyRequest = http.request(options, (proxyRes) => {
        // Hedef sunucudan gelen cevabın başlıklarını istemciye yazıyoruz
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        // Hedef sunucudan gelen cevabın gövdesini istemciye pipe ediyoruz
        proxyRes.pipe(res);
    });

    // İstemciden gelen isteğin gövdesini hedef sunucuya pipe ediyoruz
    req.pipe(proxyRequest);

    // Hata yönetimi
    proxyRequest.on('error', (err) => {
        console.error(`Hedef sunucuya bağlanırken hata: ${err.message}`);
        res.writeHead(502); // 502 Bad Gateway hatası
        res.end('Proxy hatası: Hedef sunucuya ulaşılamadı.');
    });

    req.on('error', (err) => {
        console.error(`İstemci bağlantı hatası: ${err.message}`);
    });
});

// 2. HTTPS Tünelleme (CONNECT metodu)
server.on('connect', (req, clientSocket, head) => {
    // CONNECT isteği geldiğinde bu olay tetiklenir
    console.log(`CONNECT İsteği: ${req.url}`);

    // Hedef sunucunun host ve port bilgilerini req.url'den alıyoruz (örn: "www.google.com:443")
    const { port, hostname } = new URL(`http://${req.url}`);
    const serverPort = port || 443; // Port belirtilmemişse 443'tür

    // Hedef sunucuya bir TCP bağlantısı (tünel) oluşturuyoruz
    const serverSocket = net.connect(serverPort, hostname, () => {
        // Tünel kurulduğunda istemciye bağlantının başarılı olduğunu bildiriyoruz
        clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');

        // Veriyi iki yönlü olarak akıtıyoruz (pipe)
        serverSocket.pipe(clientSocket);
        clientSocket.pipe(serverSocket);
    });

    // Hata yönetimi
    serverSocket.on('error', (err) => {
        console.error(`Hedef sunucuya tünel hatası: ${err.message}`);
        clientSocket.end('HTTP/1.1 502 Bad Gateway\r\n\r\n');
    });

    clientSocket.on('error', (err) => {
        console.error(`İstemci soket hatası: ${err.message}`);
        serverSocket.end();
    });
});

// Sunucuyu dinlemeye başlıyoruz
server.listen(PORT, HOST, () => {
    console.log(`Node.js Proxy Sunucu ${HOST}:${PORT} üzerinde dinlemede... ✅`);
});