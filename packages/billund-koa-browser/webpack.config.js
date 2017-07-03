'use strict';

const path = require('path');

module.exports = {
    entry: './lib/application.js',
    output: {
        path: path.resolve(__dirname, './built'),
        filename: 'billund-koa-browser.js',
        library: 'BillundKoaBrowser',
        libraryTarget: 'umd'
    },
    module: {
        rules: [{
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'stage-0'],
                    plugins: [
                        'add-module-exports',
                        'transform-object-assign',
                        'array-includes'
                    ]
                }
            }]
        }]
    }
};
