import createUow from '../application/createUow';
import ctx from 'request-local';
import * as uuid from 'uuid';

export default function uowMiddleware(req, res, next) {
    ctx.data.uow = createUow();
    ctx.data.id = uuid.v4();
    next();
}
