'use strict';

const path = require('path');
const packageJSON = require('../../package.json');
const rootDir = path.dirname(path.resolve(__dirname, '../../package.json'));

const DIST = path.resolve(rootDir, './dist');
const PUBLIC_PATH = 'http://localhost:9074/';

const PREFIX_REGEX = new RegExp(`^${packageJSON.name}`);

/**
 * 将action中的staticResource的entry转为结果的绝对路径
 *
 * @param  {String} staticResource - 解析到的静态资源
 * @return {String}
 */
function transformStaticResourceToAbsolutePath(staticResource) {
    if (!staticResource) return '';
    const ret = staticResource.replace(PREFIX_REGEX, DIST);
    return ret.lastIndexOf('.js') != ret.length - 3 ? `${ret}.js` : ret;
}

/**
 * 将entry的相对路径转为结果的绝对路径
 *
 * @param  {String} relativePath - 相对的路径
 * @return {String}
 */
function transfromSourceToAbsolutePath(relativePath) {
    if (!relativePath) return '';

    return path.resolve(DIST, relativePath);
}

/**
 * 将entry的绝对路径转为结果的相对路径
 *
 * @param  {String} absolutePath - 绝对路径
 * @return {String}
 */
function transformToRelativePath(absolutePath) {
    const ext = path.parse(absolutePath).ext;
    return path.relative(DIST, absolutePath).replace(new RegExp(`${ext}$`), '');
}

module.exports = {
    transformStaticResourceToAbsolutePath,
    transfromSourceToAbsolutePath,
    transformToRelativePath,
    DIST_PATH: DIST,
    PUBLIC_PATH
};
