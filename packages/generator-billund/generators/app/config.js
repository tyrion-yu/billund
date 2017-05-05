'use strict';
const _ = require('lodash');

const pkgs = {
    react: {
        'babel-preset-react': '^6.3.13',
        react: '~15.2.1',
        'react-addons-css-transition-group': '~15.2.1',
        'react-dom': '~15.2.1',
        'react-redux': '~4.4.5',
        redux: '^3.5.2'
    },
    vue: {
        'vue-loader': '^10.0.0',
        'vue-template-compiler': '2.1.6',
        vue: '2.1.6',
        'vue-server-renderer': '2.1.6',
        vuex: '2.0.0'
    },
    base: {
        del: '^2.2.0',
        koa: '^1.0.0',
        'billund-enums': '^0.1.0',
        'billund': '^0.1.0',
        'billund-source-parser': '^0.1.0',
        'billund-utils': '^0.1.0',
        'babel-core': '^6.3.15',
        'babel-loader': '^6.2.0',
        'babel-plugin-add-module-exports': '^0.2.1',
        'babel-plugin-array-includes': '^2.0.3',
        'babel-plugin-transform-object-assign': '^6.8.0',
        'babel-preset-es2015': '^6.3.13',
        'babel-preset-es2015-node': '^6.1.1',
        'babel-preset-stage-0': '^6.16.0',
        co: '^4.6.0',
        'css-loader': '^0.23.1',
        gulp: '^3.9.1',
        'run-sequence': '^1.2.1',
        glob: '^5.0.15',
        happypack: '^3.0.0',
        'postcss-initial': '^1.5.1',
        'postcss-loader': '^1.0.0',
        'ignore-loader': '^0.1.1',
        'json-loader': '^0.5.4',
        less: '^2.7.2',
        'less-loader': '^4.0.0',
        lodash: '^4.15.0',
        md5: '^2.2.1',
        'node-uuid': '^1.4.7',
        'style-loader': '^0.13.0',
        webpack: '^2.0.0',
        'billund-action-loader': '^0.1.0',
        'billund-config-loader': '^0.1.0',
        'billund-supportor-preprocessor-loader': '^0.1.0'
    }
};

const devPkgs = {
    react: {
        'babel-preset-react-hmre': '^1.1.1'
    },
    vue: {

    },
    base: {
        'babel-eslint': '^4.1.6',
        'cortex-recombiner-webpack-plugin': '^1.0.1',
        eslint: '^1.10.3',
        'extract-text-webpack-plugin': '^2.0.0',
        'file-loader': '^0.9.0',
        mocha: '^2.0.1',
        'progress-bar-webpack-plugin': '^1.9.0',
        'url-loader': '^0.5.7',
        'webpack-dev-server': '^2.0.0'
    }
};
const scripts = {
    dev: 'node devserver.js',
    'start:server': 'node app.js',
    'start:browser': 'node ./webpack/browser/webpack.server.js',
    'build:browser': 'gulp',
    'build:server': 'webpack --config ./webpack.config.server.js --progress --hide-modules',
    postinstall: 'gulp postinstall'
};

module.exports = {
    APPLICATION_CONFIG: {
        dependencies: _.extend({}, pkgs.base, pkgs.react, pkgs.vue),
        devDependencies: _.extend({}, devPkgs.base, devPkgs.react, devPkgs.vue),
        scripts: _.extend({}, scripts),
        legoconfig: {
            actiondir: './action',
            actionRegExp: '.(action).(js)$',
            staticjsdir: './entries',
            widgetconfig: './config/widgets.js',
            serverdist: './serverdist',
            commonchunkname: 'common',
            supportorpreprocessor: './supportorpreprocessor.js',
            vuechunkname: 'vue',
            reactchunkname: 'react'
        }
    },
    WIDGET_REACT_CONFIG: {
        dependencies: _.extend({}, pkgs.base, pkgs.react),
        devDependencies: _.extend({}, devPkgs.base, devPkgs.react),
        scripts,
        main: './src/config.lcg'
    },
    WIDGET_VUE_CONFIG: {
        dependencies: _.extend({}, pkgs.base, pkgs.vue),
        devDependencies: _.extend({}, devPkgs.base, devPkgs.vue),
        scripts,
        main: './src/config.lcg'
    }
};
