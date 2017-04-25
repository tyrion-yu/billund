'use strict';

require('../less/require-params.less');

const supportor = require('billund-supportor');
supportor.setSharedParams({
    now: `time from browser:  ${new Date().valueOf()}`
});
