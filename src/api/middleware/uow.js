import ctx from "request-local";
import { v4 as uuid } from "uuid";
import createUow from "../../application/createUow";

export default function (req, res, next) {
    ctx.data.uow = createUow();
    ctx.data.id = uuid();
    next();
}
