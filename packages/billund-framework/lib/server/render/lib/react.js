'use strict';

const _ = require('lodash');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

/**
 * 渲染组件内容
 *
 * @param  {Object} widget - 组件
 * @param  {Object} data - 渲染数据
 * @return {String}
 */
function render(widget, data) {
    let element = widget.template;
    if (!element) throw new Error(`name:${widget.name} missing template!`);
    try {
        element = React.createFactory(element);
        //  判断是否是合理的数据类型
        isValidProps(data) || (data = {});
        return ReactDOMServer.renderToString(element(data));
    } catch (error) {
        console.error(`id:${widget.id},name:${widget.name} render error!
                                ${error.stack}`);
        throw error;
    }
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

module.exports = render;
