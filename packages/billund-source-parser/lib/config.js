'use strict';

const path = require('path');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const babelTypes = require('babel-types');
const generate = require('babel-generator').default;
const renderType = require('billund-enums').renderType;

/**
 * 抓取require和exports出来的值,强烈建议和exports plugin一起使用,因为就不用指定default了
 *
 * @param  {String} source - 源代码
 * @return {Object} - 抓取后的值
 */
function extractRequireAndExport(source) {
    /*
        根据源码进行解析成ast树
        然后抓取各种情况:
        1. var x = require('xxx');
        2. import xxx from 'xxx.js';
        3. module.exports = {};
        4. export default {};
     */
    const requireMap = {};
    const exportMap = {};
    const ast = babylon.parse(source);

    traverse(ast, {
        CallExpression(nodePath) {
            const isRequire = nodePath.node.callee && nodePath.node.callee.name === 'require';
            if (!isRequire) return;

            const parentPath = nodePath.findParent((pa) => pa.isVariableDeclarator());
            if (!parentPath) return;
            const key = parentPath.node.id.name;

            const requireVal = nodePath.node.arguments[0].value;
            requireMap[key] = requireVal;
        },
        ImportDeclaration(nodePath) {
            const requireVal = nodePath.source.value;

            const specifiers = nodePath.specifiers;
            const isExportDefault = specifiers[0].node.type === 'ImportDefaultSpecifier';
            if (!isExportDefault) throw new Error('sorry, for easier use,please use import default specifier');

            const key = specifiers[0].node.local.name;
            requireMap[key] = requireVal;
        },
        MemberExpression(nodePath) {
            const isModuleExports = nodePath.node.object.name == 'module' && nodePath.node.property.name == 'exports';
            if (!isModuleExports) return;

            const parentPath = nodePath.findParent((pa) => pa.isAssignmentExpression());
            const exportsObj = parentPath.node.right;
            if (!babelTypes.isObjectExpression(exportsObj)) throw new Error('sorry, please exports an object');

            const properties = exportsObj.properties || [];
            properties.forEach((property) => {
                exportMap[property.key.name] = property.value;
            });
        },
        ExportDefaultDeclaration(nodePath) {
            const properties = nodePath.node.properties || [];
            properties.forEach((property) => {
                exportMap[property.key.name] = property.value;
            });
        }
    });
    return {
        requireMap,
        exportMap
    };
}

/**
 * 从properties中抓取name的值
 *
 * @param  {Array} properties - 属性队列
 * @return {String}
 */
function extractWidgetNameFromProperties(properties) {
    const nameProperty = properties.find((property) => {
        return property.key.name === 'name';
    });
    if (!nameProperty) return '';

    /*
        目前只支持export出来的对象中,name对应的value是一个字符串常量
     */
    const value = nameProperty.value;
    if (!(babelTypes.isLiteral(value) || babelTypes.isStringLiteral(value))) return '';
    return value.value;
}

/**
 * 从config的代码中抓取widget的名称
 *
 * @param  {String} source - 源代码
 * @return {String}
 */
function extractWidgetName(source) {
    if (!source) return '';

    const ast = babylon.parse(source);
    let name = '';
    traverse(ast, {
        MemberExpression(nodePath) {
            const isModuleExports = nodePath.node.object.name == 'module' && nodePath.node.property.name == 'exports';
            if (!isModuleExports) return;

            const parentPath = nodePath.findParent((pa) => pa.isAssignmentExpression());
            const exportsObj = parentPath.node.right;
            if (!babelTypes.isObjectExpression(exportsObj)) throw new Error('sorry, for lego widget cfg please export an object.');

            const properties = exportsObj.properties || [];
            name = extractWidgetNameFromProperties(properties);
        },
        ExportDefaultDeclaration(nodePath) {
            const properties = nodePath.node.properties || [];
            name = extractWidgetNameFromProperties(properties);
        }
    });

    return name;
}

/**
 * 在ast中更新模板的信息
 *
 * @param  {String} source - 源代码
 * @param  {Array} properties - 属性ast树
 * @param  {Object} state - 状态对象
 */
function updateTemplateInfo(source, properties, state) {
    const templateProperty = properties.find((property) => {
        return property.key.name === 'template';
    });
    if (!templateProperty) throw new Error('missing template in lego config.');
    /*
        根据源码解析成ast树,寻找module.exports或者export default中的template,分为以下几种情况
        1.是变量情况，目前抛出异常，因为目前还需要解析出模板的类型
        2.直接就是path.resolve的情况,那么执行，然后替换为require('./')
        3.是'./template.jsx'的字符串情况,那么替换为require('./')
     */
    const value = templateProperty.value;
    if (babelTypes.isIdentifier(value)) throw new Error(`sorry,we can't parse identifier template value`);

    let realPath = '';
    if (babelTypes.isCallExpression(value)) {
        realPath = source.substring(value.start, value.end).replace('__dirname', `'${state.dirname}'`);
        realPath = eval(realPath);
    } else if (babelTypes.isLiteral(value) || babelTypes.isStringLiteral(value)) {
        realPath = value.value;
    }
    if (!realPath) throw new Error(`sorry,can't resolve template value:${value}`);

    templateProperty.value = babelTypes.callExpression(babelTypes.identifier('require'), [babelTypes.stringLiteral(realPath)]);
    /*
        解析模板类型(目前利用文件后缀名来进行解析,目前限制只有react|vue两种),并且加入properties
     */
    const extname = path.extname(realPath);
    if (!(extname && extname.length > 1)) throw new Error(`sorry,can't resolve template type. templatePath:${realPath}`);

    let type = renderType.RENDER_TYPE_REACT;
    const suffix = extname.substring(1);
    if (suffix === 'vue' || suffix === 'vjsx') {
        type = renderType.RENDER_TYPE_VUE;
    }
    const typeKey = babelTypes.identifier('renderType');
    const typeValue = babelTypes.numericLiteral(type);
    properties.push(babelTypes.objectProperty(typeKey, typeValue));
}

/**
 * 在ast中更新store的信息
 *
 * @param  {String} source - 源代码
 * @param  {Array} properties - 属性ast树
 * @param  {Object} state - 状态对象
 */
function updateStoreConfig(source, properties, state) {
    const storeProperty = properties.find((property) => {
        return property.key.name === 'storeConfig';
    });
    if (!storeProperty) return;
    /*
        根据源码解析成ast树,寻找module.exports或者export default中的template,分为以下几种情况
        1.是变量情况，不做处理直接返回
        2.直接就是path.resolve的情况,那么执行，然后替换为require('./')
        3.是'./template.jsx'的字符串情况,那么替换为require('./')
     */
    const value = storeProperty.value;
    if (babelTypes.isIdentifier(value)) return;

    let realPath = '';
    if (babelTypes.isCallExpression(value)) {
        realPath = source.substring(value.start, value.end).replace('__dirname', `'${state.dirname}'`);
        realPath = eval(realPath);
    } else if (babelTypes.isLiteral(value) || babelTypes.isStringLiteral(value)) {
        realPath = value.value;
    }
    if (!realPath) throw new Error(`sorry,can't resolve template value:${value}`);

    storeProperty.value = babelTypes.callExpression(babelTypes.identifier('require'), [babelTypes.stringLiteral(realPath)]);
}

/**
 * 修正配置中的模板信息
 *
 * @param  {String} source - 源代码
 * @param  {Object} state - 状态对象,有如下几个字段:
 * {
 *     dirname: [String], // 对应文件所在的文件夹名称
 * }
 * @return {String}
 */
function correctTemplate(source, state) {
    const ast = babylon.parse(source);
    traverse(ast, {
        MemberExpression(nodePath) {
            const isModuleExports = nodePath.node.object.name == 'module' && nodePath.node.property.name == 'exports';
            if (!isModuleExports) return;

            const parentPath = nodePath.findParent((pa) => pa.isAssignmentExpression());
            const exportsObj = parentPath.node.right;
            if (!babelTypes.isObjectExpression(exportsObj)) throw new Error('sorry, please exports an object');

            const properties = exportsObj.properties || [];
            updateTemplateInfo(source, properties, state);
        },
        ExportDefaultDeclaration(nodePath) {
            const properties = nodePath.node.properties || [];
            updateTemplateInfo(source, properties, state);
        }
    });
    return generate(ast, {}).code;
}

/**
 * 修正配置中的模板信息
 *
 * @param  {String} source - 源代码
 * @param  {Object} state - 状态对象,有如下几个字段:
 * {
 *     dirname: [String], // 对应文件所在的文件夹名称
 * }
 * @return {String}
 */
function correctStoreConfig(source, state) {
    const ast = babylon.parse(source);
    traverse(ast, {
        MemberExpression(nodePath) {
            const isModuleExports = nodePath.node.object.name == 'module' && nodePath.node.property.name == 'exports';
            if (!isModuleExports) return;

            const parentPath = nodePath.findParent((pa) => pa.isAssignmentExpression());
            const exportsObj = parentPath.node.right;
            if (!babelTypes.isObjectExpression(exportsObj)) throw new Error('sorry, please exports an object');

            const properties = exportsObj.properties || [];
            updateStoreConfig(source, properties, state);
        },
        ExportDefaultDeclaration(nodePath) {
            const properties = nodePath.node.properties || [];
            updateStoreConfig(source, properties, state);
        }
    });
    return generate(ast, {}).code;
}

module.exports = {
    extractRequireAndExport,
    extractWidgetName,
    correctTemplate,
    correctStoreConfig
};
