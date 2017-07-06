'use strict';

const _ = require('lodash');

const RENDER_TYPE = require('billund-enums').renderType;

const widgetsPool = require('../../modules/widgetspool');

/**
 * 转换组件信息,将转换成真正的组件内容
 *
 * @param  {Array} widgetConfigs - 组件配置,字段如下:
 * {
 *     name: [String], // 组件名称
 *     params: [*], // 组件运行所需的参数
 *     requireParams: [Array], // 组件所必须的参数字段,主要是交给bigpipe进行降级处理
 *     index: [String], // xxx.xxx型数字,用来指定组件在页面上的分组
 *     weight: [Number] // 组件在当前页面上的权重
 * }
 * @return {Array} - 其中单个字段如下:
 * {
 *     id: [String], // 组件在页面上的唯一id,
 *     name: [String], // 组件名称
 *     renderType: [Number], // 模板的渲染类型
 *     params: [*], // 组件运行所需的参数
 *     requireParams: [Array], // 组件所必须的参数字段,主要是交给bigpipe进行降级处理
 *     index: [String] // xxx.xxx型数字,用来指定组件在页面上的分组,
 *     group: [String], // 组件的分组group代号
 *     sub: [String],// 组件的第二组代号
 *     template: [Object],// 组件类,
 *     dataGenerator: [Function]// 生成数据函数
 * }
 * @throws {Error} - 当配置出现重复时会给出提示异常
 */
function convertWidgets(widgetConfigs) {
    const idCache = {}; // 记录id

    widgetConfigs = widgetConfigs.filter((config) => {
        return config && config.name;
    });

    return widgetConfigs.map((config) => {
        /*
         * 首先,进行清洗每一个组件配置,如果widget里面没有index,兼容成000.000
         * 接着,拿出真实的组件的内容,混入配置
         * 最后,根据模板来计算真实的渲染类型
         */
        let index = '000.000';
        if (config.index && _.isString(config.index)) index = config.index;

        let indexArr = index.split('.');
        if (!(indexArr && indexArr.length == 2)) {
            config.group = '000';
            config.sub = '000';
        } else {
            config.group = indexArr[0];
            config.sub = indexArr[1];
        }
        // 判断是否已经有id了?如果没有id的话通过'name-group-sub方式拼接'
        let id = config.id;
        if (!id) {
            id = `${config.name}-${config.group}-${config.sub}`;
        }
        if (idCache[id]) {
            // 重复匹配,给出警告
            throw new Error(`error!widget id duplicated.maybe you have the same name widget with same index.widget name is ${config.name},index is ${config.index}`);
        }
        config.id = id;
        config.params = config.params || {};
        idCache[id] = true;
        /*
            引入组件的方式分为两种
            1.动态引入
            2.从组件池中引入
         */
        const isDynamicImport = !!config.dynamicImportPath;
        let widget = null;
        try {
            widget = isDynamicImport ? require(config.dynamicImportPath) : widgetsPool.getWidgetByName(config.name);
        } catch (e) {
            console.error(e);
        }

        if (!(widget && _.isObject(widget))) {
            // 没有获取到对应的widget,那么提示错误
            console.error(`Invalid widget configs!Widget\'s name is ${config.name}`);
            widget = {
                renderType: RENDER_TYPE.RENDER_TYPE_VUE
            };
        }

        return _.extend(config, widget);
    });
}

/**
 * 计算当前页面上,使用的组件的渲染类型
 *
 * @param  {Array} widgets - 组件列表
 * @return {Object}
 */
function addupRenderTypeCount(widgets) {
    let reactCount = 0;
    let vueCount = 0;

    widgets.forEach((widget) => {
        const renderType = widget.renderType;
        if (renderType == RENDER_TYPE.RENDER_TYPE_VUE) {
            vueCount++;
        } else {
            reactCount++;
        }
    });

    return {
        react: reactCount,
        vue: vueCount
    };
}

module.exports = {
    convertWidgets,
    addupRenderTypeCount
};
