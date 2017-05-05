'use strict';

// 设置lego的环境参数
process.env.LEGO_ENV = 'dev';
process.env.NODE_ENV = 'development';

const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const serverConfig = require('./webpack/server/widget.config.js');

const path = require('path');
const co = require('co');
const koa = require('koa');
const Billund = require('billund');
const meta = require('./mods/renderplugins/meta/index.js');
const staticResource = require('./mods/renderplugins/staticresource/index.js');

const app = koa();
const legoConfig = require('./package.json').legoconfig;

/**
 * 初始化服务端编译
 *
 * @return {Promise}
 */
function initServerCompilePromise() {
    serverConfig.plugins = serverConfig.plugins || [];
    serverConfig.plugins.push(new ProgressBarPlugin());
    const serverCompiler = webpack(serverConfig);
    return new Promise((resolve, reject) => {
        serverCompiler.run((err, stats) => {
            stats = stats.toJson();
            stats.errors.forEach((error) => {
                console.error(error);
            });
            stats.warnings.forEach((error) => {
                console.warn(error);
            });
            if (err) {
                reject(err);
                return;
            }
            console.log('server compile done.');
            watchServerCompile(serverCompiler);
            resolve('done');
        });
    });
}

/**
 * 开启server端的watch监听
 *
 * @param {Object} serverCompiler - 对应的webpack编译器
 */
function watchServerCompile(serverCompiler) {
    serverCompiler.watch({}, (err, stats) => {
        stats = stats.toJson();
        stats.errors.forEach((error) => {
            console.error(error);
        });
        stats.warnings.forEach((error) => {
            console.warn(error);
        });
        if (err) {
            console.log(err.stack);
        }
        // 提示Billund删除自己cache的内容
        Billund.updateWidgets();
    });
}

co(function*() {
    // 初始化编译
    yield initServerCompilePromise();

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
