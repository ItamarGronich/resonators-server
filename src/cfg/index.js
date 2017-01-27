import dev from './dev';

const env = process.env.ENV || 'dev';

let cfg;

switch (env) {
    case 'dev':
        cfg = dev;
        break;
    case 'prod':
        cfg = prod;
        break;
    default:
        cfg = dev;
        break;
}

export default cfg;
