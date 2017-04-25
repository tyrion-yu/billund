'use strict';

const gulp = require('gulp');
const del = require('del');
const webpack = require('webpack');
const runSequence = require('run-sequence').use(gulp);

gulp.task('clean', () => {
    return del([
        './dist/**/**'
    ]);
});

gulp.task('serverwidget', (cb) => {
    webpack(require('./webpack/server/widget.config.js'), (err, stats) => {
        console.info(stats.toString());
        cb(err);
    });
});

gulp.task('browservendor', (cb) => {
    webpack(require('./webpack/browser/vendors.config.js'), (err, stats) => {
        console.info(stats.toString());
        cb(err);
    });
});

gulp.task('browserresource', (cb) => {
    webpack(require('./webpack/browser/resource.config.js'), (err, stats) => {
        console.info(stats.toString());
        cb(err);
    });
});

/*
	when in postinstall,try to run vendor & serverwidget
 */
gulp.task('postinstall', () => {
    runSequence('clean', 'browservendor', 'serverwidget');
});

gulp.task('default', () => {
    runSequence('browserresource');
});
