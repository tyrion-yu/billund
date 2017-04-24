'use strict';

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./resource.config.js');
const port = config.devServer.port;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const packageJSON = require('../../package.json');
const legoConfig = packageJSON.legoconfig;

/**
 * 装配配置
 *
 * @return {Object} - 配置
 */
function prepareDevConfig() {
    const devConfig = config;
    // 首先,以代码形式加入Inline-mode
    const entry = devConfig.entry;
    Object.keys(entry).forEach((key) => {
        let arr = entry[key];
        if (typeof arr === 'string') {
            arr = [arr];
        }
        // 我们约定,公用包以common开头
        if (key != legoConfig.commonchunkname) {
            arr.unshift(`webpack-dev-server/client?http://localhost:${port}/`, 'webpack/hot/dev-server');
        }
        entry[key] = arr;
    });
    devConfig.plugins = devConfig.plugins || [];
    devConfig.plugins.push(new webpack.HotModuleReplacementPlugin(), new ProgressBarPlugin());
    return devConfig;
}

let devConfig = prepareDevConfig();
new WebpackDevServer(webpack(devConfig), devConfig.devServer)
    .listen(port, 'localhost', (err) => {
        if (err) {
            console.log(err);
        }
        console.log('Listening at localhost:' + port);
        console.log('Opening your system browser...');
    });
