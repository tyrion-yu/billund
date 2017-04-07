'use strict';

/**
 * 归一化action路径，目前暂时没有使用
 *
 * @param  {String} actionPath - action的路径
 * @return {String}
 */
function normalizeActionPath(actionPath) {
    if (!actionPath) return '';

    if (actionPath.indexOf('.') != -1) {
        actionPath = actionPath.substring(0, actionPath.lastIndexOf('.'));
    }
    return encodeURIComponent(actionPath);
}

module.exports = {
    normalizeActionPath
};
