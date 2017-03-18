'use strict';

// widgets配置
const WIDGET_CONFIGS = '__LEGO_WIDGET_CONFIGS__';
// widgets的属性
const WIDGET_PROPS = '__LEGO_WIDGET_PROPS__';
// 最重要的模块列表
const WIDGETS_IMPORTANT = '__LEGO_WIDGETS_IMPORTANT__';
// 分组时小组的className
const CLASS_WIDGET_SUB = 'lego-widget-sub';
// 分组时的大组className
const CLASS_WIDGET_GROUP = 'lego-widget-group';
// 最重要的模块成功列表
const WIDGETS_IMPORTANT_SUCCESSED = '__LEGO_WIDGETS_IMPORTANT_SUCCESSED__';
// 对外暴露的全局的支持工具
const WIDGETS_FALLBACK = '__LEGO_WIDGETS_FALLBACK__';
// 降级模块的前缀
const FALLBACK_WIDGET_ID_PREFIX = 'lego-widget-fallback-';

module.exports = {
    WIDGET_CONFIGS,
    WIDGET_PROPS,
    WIDGETS_IMPORTANT,
    CLASS_WIDGET_SUB,
    CLASS_WIDGET_GROUP,
    WIDGETS_IMPORTANT_SUCCESSED,
    WIDGETS_FALLBACK,
    FALLBACK_WIDGET_ID_PREFIX
};
