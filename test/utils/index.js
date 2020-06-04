import _ from 'lodash';
import sinon from 'sinon';

export function getArgsOf(spy, pred) {
    for (let i = 0; i < spy.callCount; i++) {
        const call = spy.getCall(i);
        const args = call.args;

        if (pred(args))
            return args;
    }
}
