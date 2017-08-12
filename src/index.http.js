import http from 'http';
import cfg from './cfg';

http.createServer((req, res) => {
    res.redirect(cfg.host);
    res.end();
}).listen(process.env.PORT || 80);
