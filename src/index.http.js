import http from 'http';
import cfg from './cfg';
import url from 'url';

http.createServer((req, res) => {
    res.writeHead(301, {'Location': url.resolve(cfg.host, req.url)});
    res.end();
}).listen(process.env.PORT || 80);
