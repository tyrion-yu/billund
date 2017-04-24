'use strict';

const path = require('path');
const co = require('co');
const koa = require('koa');
const Billund = require('billund-framework');

const app = koa();
const legoConfig = require('./package.json').legoconfig;

co(function*() {
    app.use(Billund.init({
        actionDir: path.resolve(__dirname, legoConfig.actiondir),
        actionNameRegex: new RegExp(legoConfig.actionRegExp),
        widgetDir: path.resolve(__dirname, legoConfig.serverdist),
        widgetNameRegex: /\.(js)$/,
        vendors: {
            react: '<%- PkgName %>/react.js',
            vue: '<%- PkgName %>/vue.js'
        }
    }));

    app.listen(8080);
}).catch((e) => {
    console.log(e.stack);
    app.context.logger.error(e.stack);
    process.exit(1);
});
