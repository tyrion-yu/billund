'use strict';

const path = require('path');

module.exports = {
    entry: './lib/index.js',
    output: {
        path: path.resolve(__dirname, './built'),
        filename: 'billund-supportor.js',
        library: 'BillundSupportor',
        libraryTarget: 'umd'
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDom',
        'react-addons-css-transition-group': 'ReactAddonsCssTransitionGroup',
        redux: 'Redux',
        'react-redux': 'ReactRedux',
        vue: 'Vue',
        vuex: 'Vuex'
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
