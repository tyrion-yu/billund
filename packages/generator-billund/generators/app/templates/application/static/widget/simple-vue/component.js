'use strict';

export default {
    props: {
        title: {
            type: String,
            required: true
        },
        desc: {
            type: String,
            default: ''
        },
        currentTime: {
            type: String,
            default: ''
        }
    }
};
