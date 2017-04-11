'use strict';

const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const babelTypes = require('babel-types');

/**
 * 抓取代码中的组件内容
 *
 * @param  {String} source - 源代码
 * @param  {Object} state - 状态对象,有如下几个字段:
 * {
 *     widgetNames: [Array] // 对应文件所在的文件夹名称
 * }
 * @return {Array}
 */
function extractWidgetInfos(source, state) {
    state = state || {};
    const widgetNames = state.widgetNames;
    if (!(widgetNames && widgetNames.length)) {
        console.error(`missing widgetNames params in action source parser.`);
        return [];
    }
    const collectInfos = [];
    /*
        进行ast解析，然后进行遍历,寻找有类似此类的配置
        {
            name: [String][required], // 组件的名称
            weight: [Number][optional] // 组件的权重
        }
     */
    const ast = babylon.parse(source);
    traverse(ast, {
        ObjectExpression(path) {
            const properties = path.node.properties || [];
            const nameProperty = properties.find((property) => {
                return property.key.name === 'name' || property.key.value === 'name';
            });
            if (!nameProperty) return;

            const weightProperty = properties.find((property) => {
                return property.key.name === 'weight' || property.key.value === 'weight';
            });
            const weight = weightProperty ? weightProperty.value.value : 0;
            collectInfos.push({
                name: nameProperty.value.value,
                weight
            });
        }
    });
    // 开始过滤,需要确保name都在weightNames中存在,因为有错误抓取的可能性
    return collectInfos.filter((obj) => {
        return widgetNames.indexOf(obj.name) != -1;
    });
}

/**
 * 从properties中抓取actionPath的值
 *
 * @param  {Array} properties - 属性队列
 * @return {String}
 */
function extractActionPathFromProperties(properties) {
    const urlProperty = properties.find((property) => {
        return property.key.name === 'url';
    });
    if (!urlProperty) return '';

    /*
        目前只支持export出来的对象中,name对应的value是一个字符串常量
     */
    const value = urlProperty.value;
    if (!(babelTypes.isLiteral(value) || babelTypes.isStringLiteral(value))) return '';
    return value.value;
}

/**
 * 抓取action的路径
 *
 * @param  {String} source - 源代码
 * @param  {Object} state - 状态对象,有如下几个字段:
 * {
 *
 * }
 * @return {String}
 */
function extractActionPath(source, state) {
    if (!source) return '';

    const ast = babylon.parse(source);
    let actionPath = '';
    traverse(ast, {
        MemberExpression(nodePath) {
            const isModuleExports = nodePath.node.object.name == 'module' && nodePath.node.property.name == 'exports';
            if (!isModuleExports) return;

            const parentPath = nodePath.findParent((pa) => pa.isAssignmentExpression());
            const exportsObj = parentPath.node.right;
            if (!babelTypes.isObjectExpression(exportsObj)) throw new Error('sorry, for lego action please export an object.');

            const properties = exportsObj.properties || [];
            actionPath = extractActionPathFromProperties(properties);
        },
        ExportDefaultDeclaration(nodePath) {
            const properties = nodePath.node.properties || [];
            actionPath = extractActionPathFromProperties(properties);
        }
    });

    return actionPath;
}

/**
 * 抓取store的配置
 *
 * @param  {String} source - 源代码
 * @param  {Object} state - 状态对象,有如下几个字段:
 * {
 *
 * }
 * @return {String}
 */
function extractStoreConfig(source, state) {
    if (!source) return '';

    const ast = babylon.parse(source);
    let storeConfigStr = '';

    traverse(ast, {
        ObjectExpression(path) {
            const properties = path.node.properties || [];
            const configProperty = properties.find((property) => {
                return property.key.name === 'storeConfig' || property.key.value === 'storeConfig';
            });
            if (!configProperty) return;

            const value = configProperty.value;
            storeConfigStr = source.substring(value.start, value.end);
        }
    });

    return storeConfigStr;
}

module.exports = {
    extractWidgetInfos,
    extractActionPath,
    extractStoreConfig
};
