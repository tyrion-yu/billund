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
    const meta = options.meta || {};

    const keywords = meta.keywords || 'billund';
    const description = meta.description || '大众点评';

    return {
        result: `
        		<meta name="Keywords" content="${keywords}" />
    			<meta name="Description" content="${description}" />
    			<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    			<meta name="apple-mobile-web-app-status-bar-style" content="black" />
    			<meta name="format-detection" content="telephone=no" />
    			<meta name="format-detection" content="email=no" />
        		`
    };
};