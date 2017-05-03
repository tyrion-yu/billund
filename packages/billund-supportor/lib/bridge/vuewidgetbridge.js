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
        if (this.isStarted) return;

        if (!this.initialProps) return;

        const tpl = this.template;
        if (!tpl) return;

        const self = this;
        /*
            因为vue的特性，需要对存在的字段加入setter,getter,所以我们需要对那些不存在的字段做一个兼容
         */
        const declareProps = tpl.props || {};
        const tplProps = {};

        const defaultPropKeys = Util.isArray(declareProps) ? declareProps : Object.keys(declareProps);

        defaultPropKeys.forEach((propKey) => {
            const prop = declareProps[propKey];
            if (!(Util.isObject(prop) && prop.default !== undefined)) {
                tplProps[propKey] = null;
                return true;
            }
            tplProps[propKey] = undefined;
        });

        const props = Util.extend({}, tplProps, this.initialProps);

        // 这里可以尝试注册自己的module,module名称就是
        this.supportor.registOwnModule(this.widgetId, {
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
