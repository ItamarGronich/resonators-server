import dev from './dev';
import test from './test';

const env = process.env.ENV || 'dev';

let cfg;

switch (env) {
    case 'dev':
        cfg = dev;
        break;
    case 'prod':
        cfg = prod;
        break;
    case 'test':
        cfg = test;
        break;
    default:
        cfg = dev;
        break;
}

export default cfg;
