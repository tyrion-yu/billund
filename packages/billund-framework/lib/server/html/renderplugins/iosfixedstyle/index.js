'use strict';

module.exports = function*() {
    /*
    	在ios情况下,可能有些全局click不可用，是因为没有给body增加cursor: pointer;
     */
    return {
        result: `
        		<style>
        			body {
    					-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    					cursor: pointer;
					}
				</style>`
    };
};
