'use strict';

/**
 * 生成对应的pageTitle
 *
 * @param {Object} config - 对应的配置
 * @return {Object}
 */
module.exports = function*(config) {
    config = config || {};
    const options = config.options || {};
    const title = options.pageTitle || '';
    return {
        result: `<title>${title}</title>`
    };
};
