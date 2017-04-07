'use strict';

require('es6-promise').polyfill();
import vue from 'vue';
import vuex from 'vuex';
window['Vue'] = window['lego-vue'] = vue;
window['Vuex'] = window['lego-vuex'] = vuex;
