'use strict';

require('es6-promise').polyfill();
const Vue = require('vue');
const Vuex = require('vuex');
const BaseSupportor = require('./basesupportor.js');
const Enums = require('billund-enums');
const WidgetEnums = Enums.widget;
const StateEnums = Enums.state;
const Util = require('../util/index.js');

/**
   重刷字段,以此来让整个store更新,目的是在onStart方法里 我们会将mapStateToProps方法注册,然后触发更新重新渲染一次，
   以防有漏过什么事件
 */
const KEY_REFRESH_COUNT = 'refreshCount';

/**
 * vue的前端支持组件
 */
class VueSupportor extends BaseSupportor {
    constructor() {
        super();
        /*
        	为什么放在这里执行？因为后面两项方法都依赖store的初始化
         */
        this.useVuex();
        this.initStore();
        this.parseWidgetConfigs();
        this.initWidgetProps();
        this.initExtraFunctions();

        this.tryDoSthDependentOnContext();
    }

    useVuex() {
        Vue.use(Vuex);
    }

    /**
     * 初始化vuex的store
     */
    initStore() {
        const initialState = Util.extend({}, this.initialState, {
            [KEY_REFRESH_COUNT]: 0
        });
        /**
         * 构建基础的module对象
         *
         * @return {Object}
         */
        function buildInitialModules() {
            const ret = {};
            const configs = window[WidgetEnums.WIDGET_CONFIGS] || [];
            configs.forEach((config) => {
                ret[`${StateEnums.PREFIX_WIDGET_OWN_STATE_KEY}${config.id}`] = {};
            });
            return ret;
        }

        this.store = new Vuex.Store({
            state: initialState,
            modules: buildInitialModules(),
            actions: {
                [StateEnums.LEGO_ACTION_TYPE_REFRESH](context) {
                    context.commit(StateEnums.LEGO_ACTION_TYPE_REFRESH);
                }
            },
            mutations: {
                [StateEnums.LEGO_ACTION_TYPE_REFRESH](state) {
                    state[KEY_REFRESH_COUNT]++;
                }
            }
        });
    }

    /**
     * 提供原生的向外的暴露方法
     */
    initExtraFunctions() {
        /*
         * 我们将dispatch直接暴露出来，因为好像没有什么好做的，action可能会返回promise,导致我们无法比较mutation是否成功
         * 目前根据webpack的打包方式，也不会导致js分批次到达
         */
        this.dispatch = this.store.dispatch;
    }

    /**
     * 向外层的vuex注册module,注意因为我们存在组件嵌套关系，所以可能有多个module.需要extend
     *
     * @param  {String} id - 组件id
     * @param  {Object} newModule - module内容
     */
    registOwnModule(id, newModule) {
        if (!Util.isObject(newModule)) return;

        const moduleId = StateEnums.PREFIX_WIDGET_OWN_STATE_KEY + id;
        // 不建议使用但是我还是用了,亲哥别改名啊
        const modules = this.store['_options'].modules || {};
        const hasPrevModule = !!(modules[moduleId]);
        const prevModule = hasPrevModule ? modules[moduleId] : {};

        const moduleState = Util.extend({}, prevModule.state, newModule.state);
        const moduleMutations = Util.extend({}, prevModule.mutations, newModule.mutations);
        const moduleActions = Util.extend({}, prevModule.actions, newModule.actions);
        // getters不能mixin,会默认摊平
        const moduleGetters = newModule.getters || {};
        newModule = {
            state: moduleState,
            mutations: moduleMutations,
            actions: moduleActions,
            getters: moduleGetters
        };
        if (hasPrevModule) {
            // 如果之前已经有注册过,那么是hotUpdate
            let prevModules = this.store.modules || {};
            let newModules = Util.extend({}, prevModules, {
                [moduleId]: newModule
            });
            this.store.hotUpdate({
                modules: newModules
            });
        } else {
            this.store.registerModule(moduleId, newModule);
        }
    }

    /**
     * 页面级别注册自己的配置,包括actions,mutations,getters
     *
     * @param  {Object} config - 注册对应的mutation
     */
    hotUpdate(config) {
        if (!Util.isObject(config)) return;

        const store = this.store;
        const prevOptions = store['_options'] || {};
        // 亲哥千万别改key啊...
        const prevActions = prevOptions.actions || {};
        const prevMutations = prevOptions.mutations || {};

        // mixin
        const newActions = Util.extend({}, prevActions, config.actions);
        const newMutations = Util.extend({}, prevMutations, config.mutations);
        // get不可以mixin
        const newGetters = config.getters || {};
        this.store.hotUpdate({
            actions: newActions,
            mutations: newMutations,
            getters: newGetters
        });
    }

    /**
     * 获取当前的state
     *
     * @return {Object} - 当前的state
     */
    getState() {
        if (!this.store) return null;

        return this.store.state;
    }

    /**
     * 注册store变更数据监听
     *
     * @param  {Function} onChangeListener - 改变时的监听,参数分别是mutation与state
     */
    registStoreOnChangeListener(onChangeListener) {
        if (!this.store) return;

        const store = this.store;
        store.subscribe(onChangeListener);
    }
}

module.exports = VueSupportor;
