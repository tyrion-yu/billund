'use strict';

const webpack = require('webpack');
const packageJSON = require('../../package.json');
const legoConfig = packageJSON.legoconfig;
const resourceResolver = require('./resourceresolver.js');

const env = process.env;

function getEntries() {
    const entry = {};
    entry[legoConfig.vuechunkname] = ['billund-supportor/lib/vendors/vue.js'];
    entry[legoConfig.reactchunkname] = ['billund-supportor/lib/vendors/react.js'];
    return entry;
}

const plugins = [];
if (env === 'product') {
    plugins.push(new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }));
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));
}

module.exports = {
    entry: getEntries(),
    output: {
        filename: '[name].js',
        path: resourceResolver.DIST_PATH,
        publicPath: resourceResolver.PUBLIC_PATH,
        chunkFilename: '[name].[chunkhash].js'
    },
    cache: true,
    resolve: {
        extensions: ['.js', '.jsx', '.vue', '.less']
    },
    target: 'web',
    module: {
        rules: [{
            test: /\.(js)$/,
            exclude: /node_modules\//,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'stage-0'],
                    cacheDirectory: true
                }
            }]
        }]
    },
    plugins
};
