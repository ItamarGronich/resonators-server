global.regeneratorRuntime = require('babel-regenerator-runtime');

process.env.ENV = 'test';

require("babel-register")();

require('./dbFixtures');
