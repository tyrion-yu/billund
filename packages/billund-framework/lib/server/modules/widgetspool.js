'use strict';

const debug = require('debug');
const log = debug('billund-widget-binder:info');

const _ = require('lodash');
const legoUtils = require('billund-utils');
const decache = require('decache');

/*
    widget名称与路径的映射
 */
const name2Path = {};
/*
    widget的名称与widget内容的mapping
 */
const name2Widget = {};

/**
 * 默认的dataGenerator,直接将参数进行透传
 *
 * @param  {Obejct} params - 参数
 * @return {Object}
 */
function* defaultDataGenerator(params) {
    return params || {};
}

/**
 * 是否是正确的widget类型
 *
 * @param  {Object}  widget - 组件
 * @return {Boolean}
 */
function isCorrectWidget(widget) {
    return _.isObject(widget) && widget.name;
}

/**
 * 注册widget
 *
 * @param  {Object} config - 配置信息，字段如下
 * {
 *      widgetDir: [String], // widget的文件夹名称
 *      nameRegex: [Regex|String] // 名称的正则
 * }
 */
function bindWidgets(config) {
    if (!(config && config.widgetDir)) {
        console.warn('missing widgetDir config in lego framework');
        return;
    }

    const widgets = legoUtils.common.getFilteredFiles(config.widgetDir, {
        nameRegex: config.nameRegex
    });

    widgets.forEach((widgetPath) => {
        const widget = require(widgetPath);
        if (!isCorrectWidget(widget)) {
            log(`${widgetPath} load fail because it's not a correct lego widget.`);
            return true;
        }
        log(`${widgetPath} load success.`);

        const name = widget.name;
        if (name2Widget[name]) {
            // 目前不允许重复定义的名称组件
            throw new Error('Duplicate define widget name: ' + name + ',please check widgets');
        }
        // 如果发现dataGenerator不存在,那么指向默认的方法
        if (!widget.dataGenerator) {
            widget.dataGenerator = defaultDataGenerator;
        }
        name2Path[name] = widgetPath;
        name2Widget[name] = widget;
    });
}

/**
 * 根据widget的名称拿取widget信息
 *
 * @param  {String} name - 组件名称
 * @return {Object}
 */
function getWidgetByName(name) {
    return name2Widget[name];
}

/**
 * 更新widgets信息
 */
function updateWidgets() {
    const names = Object.keys(name2Widget);
    names.forEach((name) => {
        decache(name2Path[name]);
        const widget = require(name2Path[name]);
        // 如果发现dataGenerator不存在,那么指向默认的方法
        if (!widget.dataGenerator) {
            widget.dataGenerator = defaultDataGenerator;
        }
        name2Widget[name] = widget;
        log(`${name} widget update.`);
    });
}

module.exports = {
    bindWidgets,
    getWidgetByName,
    updateWidgets
};
