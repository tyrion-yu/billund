'use strict';

const _ = require('lodash');
const legoUtils = require('billund-utils');
const router = require('koa-router')();

// /**
//  * 增加对降级url的支持
//  *
//  * @param {Object} config - 初始化配置
//  */
// function addFallbackActionSupport(config) {
//     if (!(config && config.fallbackUrl)) {
//         console.warn(`please regist a fallbackUrl for fallback widgets`);
//         return;
//     }

//     function* action() {
//         const query = this.query || {};
//         const widgetName = query.widgetname || '';
//         let params = query.params || '';
//         // 进行转换,可能报错,需要兼容
//         try {
//             params = JSON.parse(params);
//         } catch (e) {
//             params = {};
//         }
//     }

//     router.register(config.fallbackUrl, ['get', 'post'], [actionConfig.action]);
// }

/**
 * 绑定对应的action到routers中
 *
 * @param  {Object} config - 对应的配置项目,字段如下:
 * {
 *      actionDir: [String], // action的文件夹名称
 *      nameRegex: [Regex|String] // 名称的正则
 *      fallbackUrl: [String] // 降级的url
 * }
 * @return {GenerateFunction} - 中间件函数
 */
function bindActionRouter(config) {
    if (!(config && config.actionDir)) throw new Error('missing actionDir config in lego framework');

    const actions = legoUtils.common.getFilteredFiles(config.actionDir, {
        nameRegex: config.nameRegex
    });

    const url2Path = {};

    /**
     * 向router中注册url & action
     *
     * @param  {String} url - router的路径
     * @param  {GeneratorFunction} action - 执行函数
     */
    function registUrlToAction(url, action) {
        if (!(url && action)) return;

        if (url2Path[url]) throw new Error(`duplicate define router url: ${url}`);

        url2Path[url] = true;
        router.register(url, ['get', 'post'], [action]);
    }

    actions.forEach((action) => {
        let actionConfig = null;
        try {
            actionConfig = require(action);
        } catch (e) {
            console.error(e);
            return true;
        }

        // 如果没有要的属性,就过滤掉
        if (!(actionConfig && actionConfig.url)) return true;

        const urls = _.isArray(actionConfig.url) ? actionConfig.url : [actionConfig.url];

        urls.forEach((url) => {
            registUrlToAction(url, actionConfig.action);
        });
    });
    return router.routes();
}

module.exports = {
    bindActionRouter
};
