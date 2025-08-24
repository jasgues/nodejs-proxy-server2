const http = require('http');
const net = require('net');
const { URL } = require('url');
const chalk = require('chalk');
const axios = require("axios");

const PORT = 9999;
const HOST = '0.0.0.0';

let ip = "";

// === Public IP'yi al ===
async function getPublicIP() {
    try {
        const res = await axios.get("https://api.ipify.org?format=json");
        ip = res.data.ip;
        return ip;
    } catch (err) {
        console.error("Hata:", err);
        return "0.0.0.0";
    }
}

// === İstatistikler ===
const stats = {
    totalRequests: 0,
    totalDataSent: 0,
    totalDataReceived: 0,
    startTime: Date.now()
};

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatUptime(seconds) {
    function pad(s) { return (s < 10 ? '0' : '') + s; }
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds %= (24 * 60 * 60);
    const hours = Math.floor(seconds / (60 * 60));
    seconds %= (60 * 60);
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${days}g ${pad(hours)}s ${pad(minutes)}d ${pad(secs)}sn`;
}

function logRequest(ip, method, url, statusCode, bytesSent, bytesReceived, duration) {
    const statusColor =
        statusCode >= 500 ? chalk.red
            : statusCode >= 400 ? chalk.yellow
                : statusCode >= 300 ? chalk.cyan
                    : statusCode >= 200 ? chalk.green
                        : chalk.gray;

    const logMessage = [
        chalk.gray(`[${new Date().toLocaleString('tr-TR')}]`),
        statusColor(statusCode),
        chalk.blue(method.padEnd(8)),
        chalk.gray(`${ip.padEnd(15)}`),
        `${url}`,
        chalk.magenta(`| Süre: ${duration}ms`.padEnd(15)),
        chalk.green(`↑ ${formatBytes(bytesSent)}`.padEnd(15)),
        chalk.red(`↓ ${formatBytes(bytesReceived)}`.padEnd(15))
    ].join(' ');

    console.log(logMessage);
}

// === Proxy Server ===
const server = http.createServer((req, res) => {
    const startTime = Date.now();
    let bytesSent = 0;
    let bytesReceived = 0;
    const clientIp = req.socket.remoteAddress;

    const options = {
        hostname: req.headers.host,
        port: 80,
        path: req.url,
        method: req.method,
        headers: req.headers,
    };

    const proxyRequest = http.request(options, (proxyRes) => {
        proxyRes.on('data', chunk => {
            bytesReceived += chunk.length;
        });
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });

    req.on('data', chunk => {
        bytesSent += chunk.length;
    });

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        stats.totalRequests++;
        stats.totalDataSent += bytesSent;
        stats.totalDataReceived += bytesReceived;
        logRequest(clientIp, req.method, req.url, res.statusCode, bytesSent, bytesReceived, duration);
    });

    req.pipe(proxyRequest);

    proxyRequest.on('error', (err) => res.end());
});

// === HTTPS CONNECT ===
server.on('connect', (req, clientSocket, head) => {
    const startTime = Date.now();
    let bytesSent = 0;
    let bytesReceived = 0;
    const clientIp = req.socket.remoteAddress;

    const { port, hostname } = new URL(`http://${req.url}`);
    const serverPort = port || 443;

    const serverSocket = net.connect(serverPort, hostname, () => {
        clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
        serverSocket.pipe(clientSocket);
        clientSocket.pipe(serverSocket);
    });

    clientSocket.on('data', chunk => {
        bytesSent += chunk.length;
    });
    serverSocket.on('data', chunk => {
        bytesReceived += chunk.length;
    });

    clientSocket.on('close', () => {
        const duration = Date.now() - startTime;
        stats.totalRequests++;
        stats.totalDataSent += bytesSent;
        stats.totalDataReceived += bytesReceived;
        logRequest(clientIp, req.method, req.url, '200 (TUNNEL)', bytesSent, bytesReceived, duration);
    });

    serverSocket.on('error', (err) => clientSocket.end());
    clientSocket.on('error', (err) => serverSocket.end());
});

// === Stats ===
function printStats() {
    console.log(chalk.yellow('\n--- Proxy İstatistikleri ---'));
    console.log(`Çalışma Süresi       : ${chalk.cyan(formatUptime((Date.now() - stats.startTime) / 1000))}`);
    console.log(`Toplam İstek         : ${chalk.cyan(stats.totalRequests)}`);
    console.log(`Toplam Giden Veri    : ${chalk.green(formatBytes(stats.totalDataSent))}`);
    console.log(`Toplam Gelen Veri    : ${chalk.red(formatBytes(stats.totalDataReceived))}`);
    console.log(chalk.yellow('--------------------------\n'));
}

process.on('SIGINT', () => {
    console.log(chalk.yellow('\nProxy sunucu kapatılıyor...'));
    printStats();
    process.exit(0);
});

// === Önce public IP al, sonra server başlat ===
(async () => {
    const publicIp = await getPublicIP();
    server.listen(PORT, HOST, () => {
        console.log(chalk.green(`Node.js Proxy Sunucu ${publicIp}:${PORT} üzerinde dinlemede... ✅`));
    });
})();
