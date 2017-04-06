'use strict';

/**
 * 生成对应的meta信息
 *
 * @param {Object} config - 对应的配置
 * @return {Object}
 */
module.exports = function*(config) {
    config = config || {};
    const options = config.options || {};
    const charset = options.charset || 'UTF-8';
    return {
        result: `<meta charset="${charset}">`
    };
};
