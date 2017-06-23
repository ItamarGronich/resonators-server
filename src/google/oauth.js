const prod = require('./oauth.prod');
const test = require('./oauth.test');

const module = process.env.ENV === 'test' ? test : prod;

Object.keys(module).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return module[key];
        }
    });
});
