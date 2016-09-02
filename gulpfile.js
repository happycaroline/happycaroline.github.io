var gulp = require('gulp');
var gutil = require('gulp-util');

//配置js
var uglify = require('gulp-uglify');
var combiner = require('stream-combiner2')//当js报错时，命令行无法继续，添加处理错误的方法，报错时显示文件信息
var minifycss = require('gulp-minify-css')
var watchPath = require('gulp-watch-path')
var sass = require('gulp-ruby-sass')
var less = require('gulp-less')
var del = require('del');
// server
var browserSync = require('browser-sync');


var handleError = function (err) {
    var colors = gutil.colors;
    console.log('\n')
    gutil.log(colors.red('Error!'))
    gutil.log('fileName: ' + colors.red(err.fileName))
    gutil.log('lineNumber: ' + colors.red(err.lineNumber))
    gutil.log('message: ' + err.message)
    gutil.log('plugin: ' + colors.yellow(err.plugin))
}

gulp.task('buildjs',function(){
    gulp.src('src/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
})

gulp.task('watchjs',['buildjs'], function () {
    gulp.watch('src/js/**/*.js', function (event) {
        var paths = watchPath(event, 'src/', 'dist/')
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(uglify())
            .pipe(gulp.dest(paths.distDir))
    })
})

gulp.task('buildcss',function(){
    gutil.log('do build css ')
    gulp.src('src/css/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'))
})

gulp.task('watchcss',['buildcss'] ,function () {
    gulp.watch('src/css/*.css', function (event) {
        var paths = watchPath(event, 'src/', 'dist/')

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(minifycss())
            .pipe(gulp.dest(paths.distDir))
    })
})

gulp.task('buildless',function(){
    gulp.src('src/less/*.less')
        .pipe(less())
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'))
}) 
gulp.task('watchless',['buildless'], function () {
    gulp.watch('src/less/*.less', function (event) {
        var paths = watchPath(event, 'src/', 'dist/css')

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(less())
            .pipe(minifycss())
            .pipe(gulp.dest('dist/css'))
    })
})

gulp.task('watch-copy-css',function(){
    gulp.watch('src/css/*.css', function (event) {
        var paths = watchPath(event, 'src/', 'dist/css')

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(gulp.dest('dist/css'))
    })
})
gulp.task('watch-copy-js',function(){
    gulp.watch('src/css/*.js', function (event) {
        var paths = watchPath(event, 'src/', 'dist/')

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(gulp.dest('dist'))
    })
})

gulp.task('clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del(['dist']);
});

// serve
gulp.task('server', ['watch-copy-css','watch-copy-js','watchless'], function (cb) {
    browserSync({
        port: 8081,
        files: '**',
        server: {
            baseDir: './'
        }
    });
});

gulp.task('default', ['watchjs','watchcss','watchless'])
