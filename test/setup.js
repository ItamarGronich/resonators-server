process.env.ENV = 'test';
global.regeneratorRuntime = require('babel-regenerator-runtime');
require("ts-node").register();

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var _ = require('lodash');

_.mixin({
    omitDeep: require('omit-deep-lodash')
});
