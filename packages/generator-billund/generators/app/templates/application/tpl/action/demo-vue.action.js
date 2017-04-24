'use strict';

function* action() {
    this.legoConfig = {
        widgets: [{
            name: 'demo-vue-widget',
            params: {
                title: 'lego-widget-vue',
                desc: 'test'
            },
            weight: 100
        }],
        options: {
            staticResources: [{
                entry: '<%- PkgName %>/common.js',
                styles: '<%- PkgName %>/static/common.css'
            }, {
                entry: '<%- PkgName %>/demo-vue.js',
                styles: '<%- PkgName %>/demo-vue.css'
            }]
        }
    };
}

module.exports = {
    url: '/vue-demo.html',
    action
};
