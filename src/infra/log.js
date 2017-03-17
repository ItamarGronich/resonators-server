import log from 'winston';
import ctx from 'request-local';

const wrapLogMethod = method => (msg, other, sessionId) => {
    const modifiedMsg = {
        sessionId: sessionId || ctx.data.sessionId,
        message: msg
    };

    if (other)
        modifiedMsg.other = other;

    return method.call(log, modifiedMsg);
}

const wrapper = {
    ...log,
    debug: wrapLogMethod(log.debug),
    warn: wrapLogMethod(log.warn),
    info: wrapLogMethod(log.info),
    error: wrapLogMethod(log.error)
};

export default wrapper;
