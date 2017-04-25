'use strict';

const path = require('path');

const packageJSON = require('../../package.json');
const rootDir = path.dirname(path.resolve(__dirname, '../../package.json'));
const legoConfig = packageJSON.legoconfig;

/**
 * 生成组件的绝对路径列表
 *
 * @return {Array}
 */
function getWidgetPaths() {
    const widgetConfigPath = path.resolve(rootDir, legoConfig.widgetconfig);
    const widgets = require(widgetConfigPath).widgets || [];
    return widgets.map((widget) => {
        const isRelativePath = widget.indexOf('.') === 0;
        return isRelativePath ? path.resolve(rootDir, widget) : require.resolve(widget);
    });
}

/**
 * !important
 * 因为webpack的include是一个模糊匹配的方式，以防我们的loader匹配到不正确的匹配，所以转换include为一个完全匹配的方式
 *
 * @param  {Array} paths - 组件的绝对路径列表
 * @return {Array} 适合webpack的全路径匹配
 */
function covertToAllMatchedIncludes(paths) {
    return (paths || []).map((p) => {
        return function(input) {
            return input === p;
        };
    });
}

module.exports = {
    getWidgetPaths,
    covertToAllMatchedIncludes
};
