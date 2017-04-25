'use strict';

/**
 * 分割静态资源,分割为entry与style(js & css)
 *
 * @param  {Array} staticResources - 静态资源列表
 * @return {Object}
 */
function splitResources(staticResources) {
    staticResources = staticResources || [];
    const entries = [];
    const styles = [];

    staticResources.forEach((resource) => {
        if (resource.entry) {
            entries.push(resource.entry);
        }
        if (resource.styles) {
            styles.push(resource.styles);
        }
    });
    return {
        entries,
        styles
    };
}

/**
 * 解析样式标签
 *
 * @param  {Array} styles - 样式文件
 * @return {Array}
 */
function parseStyles(styles) {
    return (styles || []).map((style) => {
        return `<link rel="stylesheet" href="//localhost:9074/app/${style}" type="text/css">`;
    });
}

/**
 * 解析静态资源文件
 *
 * @param  {Array} entries - 静态资源文件
 * @return {Array}
 */
function parseEntries(entries) {
    return (entries || []).map((entry) => {
        return `<script defer="true" src="//localhost:9074/app/${entry}"></script>`;
    });
}

/**
 * billund的render-plugin,我们只是提供一个简单的实现，你应该根据你的具体情况进行实现
 *
 * @param {Object} config - billund提供的渲染配置
 * @return {Object}
 */
function* parse(config) {
    if (!(config && config.staticResources)) {
        return {
            result: ''
        };
    }

    const splitedResources = splitResources(config.staticResources);

    const parsedStyles = parseStyles(splitedResources.styles) || [];
    const parsedEntries = parseEntries(splitedResources.entries) || [];

    return {
        result: (parsedStyles.concat(parsedEntries)).join('')
    };
}

module.exports = parse;
