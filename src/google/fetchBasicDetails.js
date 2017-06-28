import prod from './fetchBasicDetails.prod.js';
import test from './fetchBasicDetails.test.js';

const module = process.env.ENV === 'test' ? test : prod;

export default module;
