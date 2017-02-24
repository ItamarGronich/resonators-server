import express from 'express';
import compressionMiddleware from 'compression';
import cookieParserMiddleware from 'cookie-parser'
import requestIdMiddleware from 'express-request-id';
import bodyParser from 'body-parser';
import uowMiddleware from './uowMiddleware';
import appSession from './appSessionMiddleware';

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/pages');
app.use(compressionMiddleware());
app.use(cookieParserMiddleware());
app.use(requestIdMiddleware());
app.use(appSession);
app.use(uowMiddleware);

app.use(bodyParser.json());

export default app;
