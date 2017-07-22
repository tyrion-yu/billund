'use strict';

const Cat = require('@dp/cat-client');
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

    const transaction = Cat.newTransaction('createProvider', widget.name);
    const provider = createProvider(vueConfig, data, widget.store);
    transaction.setStatus(Cat.STATUS.SUCCESS);
    transaction.complete();

    return yield new Promise((resolve, reject) => {
        const renderTransaction = Cat.newTransaction('renderToString', widget.name);
        renderer.renderToString(provider, (error, html) => {
            if (error) {
                console.error(`id:${widget.id},name:${widget.name} render error!
                                ${error.stack}`);
                reject(error);
                renderTransaction.setStatus(Cat.STATUS.FAIL);
                renderTransaction.complete();
                return;
            }
            renderTransaction.setStatus(Cat.STATUS.SUCCESS);
            renderTransaction.complete();
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
 * @param  {Object} store - vuex store
 * @return {Object}
 */
function createProvider(wrappedElement, props, store) {
    return new Vue({
        store,
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
