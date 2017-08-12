import http from 'http';
import cfg from './cfg';

http.createServer((req, res) => {
    res.writeHead(301, {'Location': cfg.host});
    res.end();
}).listen(process.env.PORT || 80);
