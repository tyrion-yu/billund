'use strict';

const _ = require('lodash');
const STATE = require('billund-enums').state;

/**
 * 生成对应的pageTitle
 *
 * @param {Object} config - 对应的配置
 * @return {Object}
 */
module.exports = function*(config) {
    config = config || {};
    const storeData = config.storeData && _.isObject(config.storeData) ? config.storeData : {};

    return {
        result: `<script class="lego-initial-state">window.${STATE.INITIAL_STATE}=${JSON.stringify(storeData)}</script>`
    };
};
