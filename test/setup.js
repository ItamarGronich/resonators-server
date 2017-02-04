process.env.ENV = 'test';
global.regeneratorRuntime = require('babel-regenerator-runtime');
require("babel-register")({});

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
