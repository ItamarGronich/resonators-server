import express from 'express';
import compressionMiddleware from 'compression';
import cookieParserMiddleware from 'cookie-parser'
import requestIdMiddleware from 'express-request-id';
import bodyParser from 'body-parser';

const app = express();

app.use(compressionMiddleware());
app.use(cookieParserMiddleware());
app.use(requestIdMiddleware());
app.use(bodyParser.json());

export default app;
