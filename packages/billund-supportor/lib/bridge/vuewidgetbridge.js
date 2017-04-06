'use strict';

const render = require('./render.js');
const BaseWidgetBridge = require('./basewidgetbridge.js');
const Util = require('../util/index.js');

const Enums = require('billund-enums');
const StateEnums = Enums.state;

/**
 * vue的桥接组件
 */
class VueWidgetBridge extends BaseWidgetBridge {
    /**
     * 初始化组件的属性
     *
     * @param  {Object} props - 对应的内容
     */
    initProps(props) {
        if (!Util.isObject(props)) return;

        this.initialProps = props;
        this.prevProps = props;
        // 尝试启动
        this.shouldStart();
    }

    /**
     * 校验启动条件,满足条件就启动
     */
    shouldStart() {
        // 已经启动了,就不要重复启动
        if (this.isStarted) return;

        // props是否已经到达?
        if (!this.initialProps) return;
        // 检查模板是否到达?
        const tpl = this.template;
        if (!tpl) return;

        const self = this;
        // 因为vue的特性,所以我们还需要从模板里拿取props,拼接一下
        const declareProps = tpl.props || {};
        const tplProps = {};

        Object.keys(declareProps).forEach((propKey) => {
            const prop = declareProps[propKey];
            if (!(Util.isObject(prop) && prop.default)) {
                tplProps[propKey] = null;
                return true;
            }
            let defaultProp = prop.default;
            if (Util.isFunction(defaultProp)) {
                defaultProp = defaultProp();
            }
            tplProps[propKey] = defaultProp;
        });

        const props = Util.extend({}, tplProps, this.initialProps);

        // 这里可以尝试注册自己的module,module名称就是
        this.store.registerModule(StateEnums.PREFIX_WIDGET_OWN_STATE_KEY + this.widgetId, {
            state: props,
            getters: {
                [StateEnums.WIDGET_VUEX_GETTERS_PREFIX + self.widgetId](state, getters, rootState) {
                    return self.mapStateToProps(rootState);
                }
            }
        });
        render(this);
    }

    /**
     * 获取组件的私有state
     *
     * @return {Object}
     */
    getOwnState() {
        const widgetId = this.widgetId;
        const store = this.store;
        const state = store.state || {};
        return state[StateEnums.PREFIX_WIDGET_OWN_STATE_KEY + widgetId] || {};
    }
}

module.exports = VueWidgetBridge;
