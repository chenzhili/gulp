var gulp = require('gulp');
var $ = require('gulp-load-plugins')();/*这个代替所有的加载*/
/*var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var ngmin = require('gulp-ngmin');*/


var paths = {
    jsSource:"js/",
    libSource:["lib/jquery/**/*.js","lib/clipboard/**/*.js","lib/goalProgress/**/*.js",
      "lib/ion-rangeSlider/**/*.js","lib/leancloud-javascript-sdk/**/*.js","lib/moment/**/*.js","lib/ng-upload/**/*.js","lib/swiper/**/*.js"
      ,"lib/angular-local-storage/**/*.js"],
    imgSource:"img/",
    cssSource:["css/**/*.css","css/**/*.min.css","lib/**/*.css","lib/**/*.min.css"],
    prodPath:"lib/yike/"
};
gulp.task('ajs', function () {
  gulp.src(paths.jsSource+"**/*.js")
      .pipe($.concat('release.js'))
      /*.pipe($.uglify())*/
      .pipe(gulp.dest(paths.prodPath))
});
gulp.task('bjs', function () {
    gulp.src(paths.libSource)
        .pipe($.concat('release1.js'))
        /*.pipe($.uglify())*/
        .pipe(gulp.dest(paths.prodPath))
});
gulp.task("img",function(){
    gulp.src(paths.imgSource+"**/*")
        .pipe($.imagemin())
        .pipe(gulp.dest(paths.prodPath+"img"))
});
gulp.task("css",function(){/*这里的压缩有问题还需要看看*/
    gulp.src(paths.cssSource)
        .pipe($.cssmin())
        .pipe(gulp.dest(paths.prodPath))
});
gulp.task('watch', function () {
  gulp.watch(paths.jsSource+"**/*.js",['ajs']);
  gulp.watch(paths.libSource,['bjs']);
  gulp.watch(paths.imgSource,['img']);
  gulp.watch(paths.cssSource,['css']);
});

