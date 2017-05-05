'use strict';

function* action() {
    this.legoConfig = {
        widgets: [{
            name: 'simple-vue-widget',
            params: {
                title: 'simple-vue-widget',
                desc: 'test',
                now: new Date().valueOf() + ''
            },
            weight: 100
        }],
        options: {
            staticResources: [{
                entry: '<%- PkgName %>/common.js'
            }, {
                entry: '<%- PkgName %>/simple-vue.js',
                styles: '<%- PkgName %>/simple-vue.css'
            }]
        }
    };
}

module.exports = {
    url: '/simple-vue.html',
    action
};
