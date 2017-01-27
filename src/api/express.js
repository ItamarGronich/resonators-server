import express from 'express';
import compressionMiddleware from 'compression';
import cookieParserMiddleware from 'cookie-parser'
import requestIdMiddleware from 'express-request-id';

const app = express();

app.use(compressionMiddleware());
app.use(cookieParserMiddleware());
app.use(requestIdMiddleware());

export default app;
