'use strict';

const RENDER_TYPE = require('billund-enums').renderType;

/**
 * 渲染组件内容
 *
 * @param  {Object} widget - 组件
 * @param  {Object} data - 渲染数据
 * @return {String}
 */
function* render(widget, data) {
    const renderType = widget.renderType;
    if (renderType == RENDER_TYPE.RENDER_TYPE_VUE) {
        const vueRender = require('./lib/vue.js');
        return yield vueRender(widget, data);
    }
    const reactRender = require('./lib/react.js');
    return reactRender(widget, data);
}

module.exports = render;
