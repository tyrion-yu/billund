'use strict';

const WIDGET = require('billund-enums').widget;

/**
 * 生成对应的最重要的组件的tag
 *
 * @param {Object} config - 对应的配置
 * @return {Object}
 */
module.exports = function*(config) {
    config = config || {};
    const mostImportantWidgets = config.mostImportantWidgets || [];
    const widgetIds = mostImportantWidgets.map((widget) => {
        return widget.id;
    });
    return {
        result: `<script class="lego-most-important-widgets">
                    window.${WIDGET.WIDGETS_IMPORTANT}=${JSON.stringify(widgetIds)}
                </script>`
    };
};
