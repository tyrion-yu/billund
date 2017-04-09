'use strict';

const isDev = (process.env.LEGO_ENV === 'development' || process.env.BILLUND_ENV === 'development');

const _ = require('lodash');
const Vue = require('vue');

// 目前使用直接创建的方法,因为我们自己已经实现了bigpipe
const renderer = require('vue-server-renderer').createRenderer({
    cache: require('lru-cache')({
        max: 1000,
        maxAge: 1000 * 60 * 60
    })
});

/**
 * 渲染组件内容
 *
 * @param  {Object} widget - 组件
 * @param  {Object} data - 渲染数据
 * @return {String}
 */
function* render(widget, data) {
    const vueConfig = widget.template;
    if (!vueConfig) throw new Error(`name:${widget.name} missing template!`);

    // 如果是测试环境的话,去掉serverKey方法,因为有热更新的需求
    if (isDev) vueConfig.serverCacheKey = null;
    // 判断是否是合理的数据类型
    isValidProps(data) || (data = {});

    const provider = createProvider(vueConfig, data);

    return yield new Promise((resolve, reject) => {
        renderer.renderToString(provider, (error, html) => {
            if (error) {
                console.error(`id:${widget.id},name:${widget.name} render error!
                                ${error.stack}`);
                reject(error);
                return;
            }
            resolve(html);
        });
    });
}

/**
 * 确认是否是合理的数据类型
 *
 * @param  {Object}  data - 数据
 * @return {Boolean}
 */
function isValidProps(data) {
    return data && _.isObject(data);
}

/**
 * 在外围创建一个根节点,包装我们自己的容器
 *
 * @param  {Object} wrappedElement - 被包装的元素
 * @param  {Object} props - 数据
 * @return {Object}
 */
function createProvider(wrappedElement, props) {
    return new Vue({
        components: {
            'wrapped-element': wrappedElement
        },
        render(h) {
            return h('wrapped-element', {
                props
            });
        }
    });
}

module.exports = render;
