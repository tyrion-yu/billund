'use strict';

const fs = require('fs');

/**
 * 获取所有过滤的文件
 *
 * @param  {String} rootDir - 文件夹
 * @param  {Object} options - 对应配置,字段如下:
 * {
 *      nameRegex: [Regex], // not-required,名字的正则,符合条件的才能加入
 * }
 * @return {Array}
 */
function getFilteredFiles(rootDir, options) {
    let ret = [];
    const files = fs.readdirSync(rootDir);
    files.forEach((file) => {
        const pathName = `${rootDir}/${file}`;
        const stat = fs.lstatSync(pathName);
        if (stat.isDirectory()) {
            // 是文件夹的情况，递归
            ret = ret.concat(getFilteredFiles(pathName, options));
            return true;
        }

        if (options && options.nameRegex && (!options.nameRegex.test(pathName))) return true;

        ret.push(pathName);
    });
    return ret;
}

module.exports = {
    getFilteredFiles
};
