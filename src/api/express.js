import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import userAgent from "express-useragent";
import compressionMiddleware from "compression";
import cookieParserMiddleware from "cookie-parser";
import ctxMiddleware from "request-local/middleware";
import requestIdMiddleware from "express-request-id";

import { uow, appSession, logRequest } from "./middleware";

const app = express();

app.use(ctxMiddleware.create());
app.use(cors());
app.use(userAgent.express());
app.use(logRequest);
app.use(compressionMiddleware());
app.use(cookieParserMiddleware());
app.use(requestIdMiddleware());
app.use(appSession);
app.use(uow);
app.use(bodyParser.json());

export default app;
