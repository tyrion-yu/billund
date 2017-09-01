'use strict';
const node_path = require("path");

function* action() {
    this.legoConfig = {
        htmlConfig:{
            path:node_path.join(process.cwd(),"/template/test.html"),
            data:{
                test:1
            }
        },
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
