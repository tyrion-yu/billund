'use strict';

const _ = require('lodash');
const co = require('co');

const OPT_DEFAULT = {
    timeout: 5000,
    fallback: null
};

/*
	ReadMe.MD
	task元素支持的类型:
	1.GenertatorFunction
	2.Object类型,字段如下:
	{
		gen: [GenertatorFunction], // 执行函数的入口
		fallback: [*], // 失败后降级返回的结果,没有传入默认为null
		timeout: [Number] // 当前任务的超时时间,默认为5000
	}

	tasks参数支持的类型
	1.数组，每一个都是一个task元素
	2.Object,value都是一个task元素
	3.GenertatorFunction,执行函数
 */

/**
 * 并发执行的入口方法,返回结果的格式取决于传入的tasks参数的格式,请参考Readme.MD
 *
 * @param {Function|Object|Array} tasks - 批量执行的tasks数据结构,目前支持传入的类型请参考Readme.MD
 * @param  {Object} options - 配置的对象,目前支持 timeout超时时间字段,与fallback错误返回字段
 * @return {Object|Array} 执行的结果,格式取决于传入的tasks参数的格式,请参考Readme.MD
 */
function* execute(tasks, options) {
    /*
    	tasks有三种不同的类型,按不同的情况进行处理
     */
    if (_.isPlainObject(tasks)) {
        return yield objectExecute(tasks, options);
    }
    if (_.isArray(tasks)) {
        return yield arrayExecute(tasks, options);
    }
    return yield functionExecute(tasks, options);
}

/**
 * 当tasks参数是一个函数时的执行方法
 *
 * @param {Function} tasks - 批量执行的tasks数据结构
 * @param  {Object} options - 配置的对象,目前支持 timeout超时时间字段,与fallback错误返回字段
 * @return {Object} 执行的结果
 */
function* functionExecute(tasks, options) {
    return yield taskToPromise(tasks, options);
}

/**
 * 当tasks参数是一个对象时的执行方法
 *
 * @param {Object} tasks - 批量执行的tasks数据结构
 * @param  {Object} options - 配置的对象,目前支持 timeout超时时间字段,与fallback错误返回字段
 * @return {Object} 执行的结果Map,以键值对的方式一一对应
 */
function* objectExecute(tasks, options) {
    const taskNames = Object.keys(tasks);
    taskNames.forEach((name) => {
        const task = tasks[name];
        tasks[name] = taskToPromise(task, options);
    });
    return yield tasks;
}

/**
 * 当tasks参数是一个数组时的执行方法
 *
 * @param {Array} tasks - 批量执行的tasks数据结构
 * @param  {Object} options - 配置的对象,目前支持 timeout超时时间字段,与fallback错误返回字段
 * @return {Array} 执行的结果数组,顺序就是传进来时的顺序
 */
function* arrayExecute(tasks, options) {
    return yield tasks.map((task) => {
        return taskToPromise(task, options);
    });
}

/**
 * 将task对象转换成为Promise,以便co与yield支持并发
 *
 * @param  {Object|Function} task - task对象,请参考Readme.MD
 * @param  {Object} options - 配置的对象,目前支持 timeout超时时间字段,与fallback错误返回字段
 * @return {Promise} 经过包装后的task Promise
 */
function taskToPromise(task, options) {
    return co(toGenerator(task, options));
}

/**
 * 将task对象转换成为Generator函数,方便co包装
 *
 * @param  {Object|Function} task - task对象,请参考Readme.MD
 * @param  {Object} options - 配置的对象,目前支持 timeout超时时间字段,与fallback错误返回字段
 * @return {GeneratorFunction} 经过包装后的task GeneratorFunction
 */
function toGenerator(task, options) {
    task = wrapToTaskObj(task, options);

    return function*() {
        let res;
        try {
            const result = yield toTimeoutPromise(task);
            res = _.extend({
                result
            });
        } catch (e) {
            console.warn(e.stack);
            res = _.extend({
                result: task.fallback,
                error: e
            });
        } finally {
            return res;
        }
    };
}

/**
 * 将传进来的task参数包装成标准的task对象
 *
 * @param  {Object|Function} task - task对象,请参考Readme.MD
 * @param  {Object} options - 配置的对象,目前支持 timeout超时时间字段,与fallback错误返回字段
 * @return {Object} 经过包装后的task对象
 */
function wrapToTaskObj(task, options) {
    options = _.extend({}, OPT_DEFAULT, options);
    /*
    	task有两种情况，分别是纯对象与GeneratorFunction,按不同情况处理
     */
    if (_.isPlainObject(task)) {
        task = _.extend({}, options, task);
    } else {
        task = _.extend({}, options, {
            gen: task
        });
    }
    return task;
}

/**
 * 生成带有超时的任务Promise
 *
 * @param  {Object} task - 标准的task执行对象
 * @return {Promise}      带有超时的任务Promise
 */
function toTimeoutPromise(task) {
    const gen = task.gen();
    const timeout = task.timeout;
    let timeoutId;

    return Promise.race([
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => {
                try {
                    // 中断generator的执行
                    gen.throw(new Error('execute gen timeout,now limit time is ' + timeout + 'ms'));
                } catch (e) {
                    reject(e);
                }
            }, timeout);
        }),
        co(gen)
    ]).then((value) => {
        clearTimeout(timeoutId);
        return value;
    });
}

module.exports = execute;
