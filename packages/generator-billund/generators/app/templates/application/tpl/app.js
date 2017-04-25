'use strict';

const path = require('path');
const co = require('co');
const koa = require('koa');
const Billund = require('billund-framework');
const meta = require('./mods/renderplugins/meta/index.js');
const staticResource = require('./mods/renderplugins/staticresource/index.js');

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
        },
        renderPlugins: {
            header: [meta, staticResource]
        }
    }));

    app.listen(8080);
    console.log('listening 8080 server start!');
}).catch((e) => {
    console.log(e.stack);
    app.context.logger.error(e.stack);
    process.exit(1);
});
