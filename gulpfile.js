var gulp = require('gulp');
var gutil = require('gulp-util');

//配置js
var uglify = require('gulp-uglify');
var combiner = require('stream-combiner2')//当js报错时，命令行无法继续，添加处理错误的方法，报错时显示文件信息
var minifycss = require('gulp-minify-css')
var watchPath = require('gulp-watch-path')
var sass = require('gulp-ruby-sass')



var handleError = function (err) {
    var colors = gutil.colors;
    console.log('\n')
    gutil.log(colors.red('Error!'))
    gutil.log('fileName: ' + colors.red(err.fileName))
    gutil.log('lineNumber: ' + colors.red(err.lineNumber))
    gutil.log('message: ' + err.message)
    gutil.log('plugin: ' + colors.yellow(err.plugin))
}


gulp.task('watchjs', function () {
    gulp.watch('src/js/**/*.js', function (event) {
        var paths = watchPath(event, 'src/', 'dist/')
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(uglify())
            .pipe(gulp.dest(paths.distDir))
    })
})

gulp.task('watchcss', function () {
    gulp.watch('src/css/**/*.css', function (event) {
        var paths = watchPath(event, 'src/', 'dist/')

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(minifycss())
            .pipe(gulp.dest(paths.distDir))
    })
})



//sass
gulp.task('sass', function () {
    gutil.log('do sass');
    sass('src/sass/')
        .on('error', function (err) {
            console.error('Error!!', err.message);
        })
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'))
});

//sass-watch
gulp.task('watchsass', function () {
    gulp.watch('src/sass/*', ['sass']);
});

gulp.task('default', ['watchjs','watchcss','watchsass'])
