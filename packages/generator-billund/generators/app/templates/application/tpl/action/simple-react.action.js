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
                entry: '<%- PkgName %>/common.js'
            }, {
                entry: '<%- PkgName %>/simple-react.js',
                styles: '<%- PkgName %>/simple-react.css'
            }]
        }
    };
}

module.exports = {
    url: '/simple-react.html',
    action
};
