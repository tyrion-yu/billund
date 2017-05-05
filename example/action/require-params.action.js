'use strict';

function* action() {
    this.legoConfig = {
        widgets: [{
            name: 'simple-vue-widget',
            params: {
                title: 'simple-vue-widget',
                desc: 'test',
                now: ''
            },
            requireParams: ['now!null!""'],
            weight: 100
        }],
        options: {
            staticResources: [{
                entry: 'billund-example/common.js'
            }, {
                entry: 'billund-example/require-params.js',
                styles: 'billund-example/require-params.css'
            }]
        }
    };
}

module.exports = {
    url: '/require-params.html',
    action
};
