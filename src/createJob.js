import _ from 'lodash';

export default function createJob({
    runner,
    interval,
    onStart = _.noop,
    onStop = _.noop,
    onError = _.noop
}) {
    let stopped = true;

    function start() {
        stopped = false;
        onStart();
        loop();
    }

    function stop() {
        stopped = true;
        onStop();
    }

    async function loop() {
        try {
            if (stopped)
                return;

            await runner();
        } catch (err) {
            onError(err);
        }

        if (stopped)
            return;

        setTimeout(loop, interval);
    }

    return {
        start,
        stop
    };
}
