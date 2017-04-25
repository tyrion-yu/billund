'use strict';

function* action() {
    this.legoConfig = {
        widgets: [{
            name: 'simple-react-widget',
            params: {
                title: 'simple-react-widget',
                desc: 'test',
                now: new Date().valueOf() + ''
            },
            weight: 100
        }],
        options: {
            staticResources: [{
                entry: 'billund-example/common.js',
                styles: 'billund-example/common.css'
            }, {
                entry: 'billund-example/simple-react.js',
                styles: 'billund-example/simple-react.css'
            }]
        }
    };
}

module.exports = {
    url: '/simple-react.html',
    action
};
