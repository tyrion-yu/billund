'use strict';

const BaseWidgetBridge = require('./basewidgetbridge.js');
const Util = require('../util/index.js');

const Enums = require('billund-enums');
const StateEnums = Enums.state;

/**
 * react-widget的桥接类
 */
class ReactWidgetBridge extends BaseWidgetBridge {
    /**
     * 初始化组件的属性
     *
     * @param  {Object} props - 对应的内容
     */
    initProps(props) {
        if (!Util.isObject(props)) return;

        const self = this;
        this.initialProps = props;
        this.prevProps = props;
        // 将自身的小属性放入store
        this.store.dispatch({
            type: StateEnums.LEGO_ACTION_TYPE_SET_OWN_STATE,
            id: self.widgetId,
            data: props
        });
        // 尝试启动
        this.shouldStart();
    }

    /**
     * 获取组件的私有state
     *
     * @return {Object}
     */
    getOwnState() {
        const widgetId = this.widgetId;
        const store = this.store;
        return store.getState()[StateEnums.PREFIX_WIDGET_OWN_STATE_KEY + widgetId] || {};
    }
}

module.exports = ReactWidgetBridge;
