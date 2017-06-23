import express from 'express';
import compressionMiddleware from 'compression';
import cookieParserMiddleware from 'cookie-parser'
import requestIdMiddleware from 'express-request-id';
import bodyParser from 'body-parser';
import uowMiddleware from './uowMiddleware';
import appSession from './appSessionMiddleware';
import ctxMiddleware from 'request-local/middleware';
import ctx from 'request-local';
import requestLogger from './requestLoggerMiddleware';
import uuid from 'uuid/v4';
import cors from 'cors';
import path from 'path';

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/pages');

app.use(ctxMiddleware.create());

app.use((req, res, next) => {
    ctx.data.sessionId = uuid();
    next();
});

app.use(cors());
app.use(requestLogger);
app.use(compressionMiddleware());
app.use(cookieParserMiddleware());
app.use(requestIdMiddleware());
app.use(appSession);
app.use(uowMiddleware);
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

export default app;
