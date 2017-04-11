'use strict';

const expect = require('expect');
const extractImportantWidgets = require('../lib/widget.js').extractImportantWidgets;

describe('extract important widgets', () => {
    it('should return empty array', () => {
        const widgets = extractImportantWidgets();
        expect(widgets.length).toEqual(0);
    });
    it('should return that array', () => {
        const widgets = [{
            name: 'widget-1',
            params: {
                paramA: 'a',
                paramB: 'b'
            },
            weight: 1
        }, {
            name: 'widget-2',
            weight: 1
        }, {
            name: 'widget-3'
        }, {
            name: 'widget-4',
            params: {
                paramD: 'd'
            },
            weight: 1
        }];
        const importantWidgets = extractImportantWidgets(widgets);
        expect(importantWidgets).toEqual([{
            name: 'widget-1',
            params: {
                paramA: 'a',
                paramB: 'b'
            },
            weight: 1
        }, {
            name: 'widget-2',
            weight: 1
        }, {
            name: 'widget-4',
            params: {
                paramD: 'd'
            },
            weight: 1
        }]);
    });
});
