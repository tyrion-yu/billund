'use strict';

const RENDER_TYPE = require('billund-enums').renderType;

/**
 * 计算当前页面上的渲染配置
 *
 * @param  {Array} widgets - 对应的重要组件
 * @return {Object}
 */
function addupRenderType(widgets) {
    let react = 0;
    let vue = 0;

    widgets.forEach((widget) => {
        const renderType = widget.renderType;
        if (renderType == RENDER_TYPE.RENDER_TYPE_REACT) {
            react++;
        }
        if (renderType == RENDER_TYPE.RENDER_TYPE_VUE) {
            vue++;
        }
    });
    return {
        react,
        vue
    };
}

/**
 * 创建store的映射表
 *
 * @param  {Object} config - 配置
 * @param  {Array} widgets - 对应的重要组件
 */
function assemblyStore(config, widgets) {
    const renderTypes = addupRenderType(widgets);
    /*
        暂时react还不需要同构的store
        vue因为vuex的getters需要有同构的store
        装配进对应的widget
     */
    const reactStore = null;
    const vueStore = renderTypes.vue > 0 ? require('./lib/vue.js').createStore(config, widgets) : null;

    widgets.forEach((widget) => {
        widget.store = widget.renderType == RENDER_TYPE.RENDER_TYPE_VUE ? vueStore : reactStore;
    });
}

module.exports = {
    assemblyStore
};
