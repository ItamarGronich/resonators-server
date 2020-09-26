import cors from "cors";
import express from "express";
import ctx from "request-local";
import { v4 as uuid } from "uuid";
import bodyParser from "body-parser";
import userAgent from "express-useragent";
import compressionMiddleware from "compression";
import cookieParserMiddleware from "cookie-parser";
import ctxMiddleware from "request-local/middleware";
import requestIdMiddleware from "express-request-id";

import uowMiddleware from "./uowMiddleware";
import appSession from "./appSessionMiddleware";
import requestLogger from "./requestLoggerMiddleware";

const app = express();

app.use(ctxMiddleware.create());
app.use((req, res, next) => {
    ctx.data.sessionId = uuid();
    next();
});

app.use(cors());
app.use(userAgent.express());
app.use(requestLogger);
app.use(compressionMiddleware());
app.use(cookieParserMiddleware());
app.use(requestIdMiddleware());
app.use(appSession);
app.use(uowMiddleware);
app.use(bodyParser.json());

export default app;
