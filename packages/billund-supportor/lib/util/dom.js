'use strict';

/**
 * 展示dom
 *
 * @param  {HtmlElement} div - div元素
 */
function showDiv(div) {
    if (!div) {
        return;
    }
    if (div.style.display == 'none') {
        div.style.display = '';
    }
    if (getComputedStyle(div, '').getPropertyValue('display') == 'none') {
        div.style.display = 'block';
    }
}

/**
 * 隐藏dom
 *
 * @param  {HtmlElement} div - div元素
 */
function hideDiv(div) {
    if (!div) {
        return;
    }
    if (div.style.display != 'none') {
        div.style.display = 'none';
    }
    if (getComputedStyle(div, '').getPropertyValue('display') != 'none') {
        div.style.display = 'none';
    }
}

module.exports = {
    showDiv,
    hideDiv
};
