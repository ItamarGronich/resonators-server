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

app.use(cors());
app.use(requestIdMiddleware());
app.use(ctxMiddleware.create());
app.use(userAgent.express());
app.use(compressionMiddleware());
app.use(cookieParserMiddleware());
app.use(bodyParser.json());
app.use(appSession);
app.use(uow);
app.use(logRequest);

export default app;
