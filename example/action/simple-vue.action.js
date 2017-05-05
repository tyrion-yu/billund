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
                entry: 'billund-example/common.js'
            }, {
                entry: 'billund-example/simple-vue.js',
                styles: 'billund-example/simple-vue.css'
            }]
        }
    };
}

module.exports = {
    url: '/simple-vue.html',
    action
};
