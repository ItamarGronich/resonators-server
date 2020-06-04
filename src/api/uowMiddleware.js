import createUow from '../application/createUow';
import ctx from 'request-local';
import uuid from 'uuid/v4';

export default function uowMiddleware(req, res, next) {
    ctx.data.uow = createUow();
    ctx.data.id = uuid();
    next();
}
