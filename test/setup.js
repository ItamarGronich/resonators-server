#!/usr/bin/env node
process.env.ENV = 'test';
global.regeneratorRuntime = require('babel-regenerator-runtime');
require("babel-register")({});