'use strict';

const WIDGET = require('billund-enums').widget;

/**
 * 生成widget的props，传给前端
 *
 * @param  {Object} config - 配置
 * @return {Object}
 */
module.exports = function*(config) {
    const successWidgets = config.executeResults.success || [];
    const failWidgets = config.executeResults.fail || [];

    const scripts = [];
    const successWidgetIds = successWidgets.map((widget) => {
        return widget.id;
    });
    // 增加成功组件的id,以便支持组件筛选
    scripts.push(`<script class="lego-most-important-widgets">
    				window.${WIDGET.WIDGETS_IMPORTANT_SUCCESSED}=${JSON.stringify(successWidgetIds)}
    			  </script>`);
    // 增加成功组件的属性
    const successWidgetsScripts = successWidgets.map((widget) => {
        const id = widget.id;
        const data = widget.result.result.data || {};
        const meta = widget.result.result.meta || {};
        const unsafeStr = JSON.stringify({
            id,
            meta,
            props: data
        });
        const safeStr = encodeURIComponent(unsafeStr);
        return `<script class="lego-widget-props">
        			window.${WIDGET.WIDGET_PROPS} || (window.${WIDGET.WIDGET_PROPS}=[]);
        			window.${WIDGET.WIDGET_PROPS}.push(JSON.parse(decodeURIComponent("${safeStr}")));
        		</script>`;
    });
    scripts.push(successWidgetsScripts.join(''));
    // 增加fallback组件的属性
    const failWidgetScripts = failWidgets.map((widget) => {
        const failConfig = widget.result && widget.result.result || {};
        return `<script class="lego-fallback-widget" id="${WIDGET.FALLBACK_WIDGET_ID_PREFIX}${widget.id}">
        			window.${WIDGET.WIDGETS_FALLBACK} || (window.${WIDGET.WIDGETS_FALLBACK}=[]);
        			window.${WIDGET.WIDGETS_FALLBACK}.push(${JSON.stringify(failConfig)});
        		</script>`;
    });
    scripts.push(failWidgetScripts.join(''));
    return {
        result: scripts.join('')
    };
};
