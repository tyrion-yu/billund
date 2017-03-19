'use strict';

const configParser = require('./config.js');
const actionParser = require('./action.js');

module.exports = {
    config: configParser,
    action: actionParser
};
