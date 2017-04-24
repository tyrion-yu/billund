'use strict';

module.exports = function*(params) {
    const now = params.now;
    return Object.assign({}, params, {
        now
    });
};
