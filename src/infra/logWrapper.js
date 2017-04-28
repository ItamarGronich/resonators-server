import ctx from 'request-local';

export default (logger, withoutSessionId) => {
    const wrapLogMethod = method => (msg, other, sessionId) => {
        let modifiedMsg = {
            sessionId: sessionId || withoutSessionId || ctx.data.sessionId,
            message: msg
        };

        if (other)
            modifiedMsg.other = other.toString() + (other.stack ? '\n' + other.stack : '');

        return method.call(logger, modifiedMsg);
    }

    const wrapper = {
        ...logger,
        debug: wrapLogMethod(logger.debug),
        warn: wrapLogMethod(logger.warn),
        info: wrapLogMethod(logger.info),
        error: wrapLogMethod(logger.error)
    };

    return wrapper;
};
