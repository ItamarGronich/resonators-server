import _ from 'lodash';
import base from './base';
import dev from './dev';
import test from './test';
import prod from './prod';
import defaultCfg from './default';

const env = process.env.ENV || 'dev';

let cfg;

switch (env) {
    case 'dev':
        cfg = dev;
        break;
    case 'production':
        cfg = prod;
        break;
    case 'test':
        cfg = test;
        break;
    default:
        cfg = dev;
        break;
}

let mergedCfg = _.merge({}, base, cfg);

//default cfg can add derived data from the merged cfg
mergedCfg = _.merge(mergedCfg, defaultCfg(mergedCfg), cfg);

export default mergedCfg;
