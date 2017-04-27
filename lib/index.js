'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = createServer;

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaServeIndex = require('koa-serve-index');

var _koaServeIndex2 = _interopRequireDefault(_koaServeIndex);

var _koaStatic = require('koa-static');

var _koaStatic2 = _interopRequireDefault(_koaStatic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var proxy = require('koa-proxies'); /**
                                     * Created by sea35 on 2017/1/12.
                                     */

var app = new _koa2.default();
var defaultCwd = process.cwd();
var defaultArgs = {
    port: 3001
};

function proxyConfigAnalyze(context) {
    var l = context.indexOf("/(.*)");
    if (l >= 0) {
        return function (url) {
            var newUrl = url.replace(context.replace("/(.*)", ""), "");
            console.log(newUrl);
            return newUrl;
        };
    }
    return null;
}
function formatProxy(context) {
    return context.replace("/*", "").replace("/(.*)", "").replace("post", "").replace("get", "").replace("POST", "").replace("GET", "").trim();
}
function createServer(_args) {

    var args = (0, _extends3.default)({}, defaultArgs, _args);

    app.use((0, _koaServeIndex2.default)(defaultCwd, {
        hidden: true,
        view: 'details'
    }));

    app.use((0, _koaStatic2.default)(defaultCwd));
    var proxyTable = void 0;
    try {
        proxyTable = require(defaultCwd + "/proxy.config.js");
    } catch (e) {
        console.log("not find proxy.config.js");
    }

    (0, _keys2.default)(proxyTable).forEach(function (context) {
        var options = proxyTable[context];
        if (typeof options === 'string') {
            options = {
                target: options,
                changeOrigin: true,
                logs: true,
                rewrite: proxyConfigAnalyze(context)
            };
        }
        app.use(proxy(formatProxy(context), options));
    });
    app.listen(args.port, function (e) {
        return console.log(e || 'listening at port ' + args.port);
    });
}
module.exports = exports['default'];