'use strict';

require('../less/require-params.less');

const Billund = require('billund');
Billund.setSharedParams({
    now: `time from browser:  ${new Date().valueOf()}`
});
