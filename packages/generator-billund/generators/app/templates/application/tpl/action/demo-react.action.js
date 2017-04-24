'use strict';

function* action() {
    this.legoConfig = {
        widgets: [{
            name: 'demo-react-widget',
            params: {
                title: 'lego-widget-react',
                desc: 'test'
            },
            weight: 100
        }],
        options: {
            staticResources: [{
                entry: '<%- PkgName %>/common.js',
                styles: '<%- PkgName %>/static/common.css'
            }, {
                entry: '<%- PkgName %>/demo-react.js',
                styles: '<%- PkgName %>/demo-react.css'
            }]
        }
    };
}

module.exports = {
    url: '/react-demo.html',
    action
};
