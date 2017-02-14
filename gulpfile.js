/**
 * Created by linxin on 2017/2/4.
 */
var gulp = require('gulp');

// 文件操作
var del = require('del'),                                       // 删除文件
    concat = require('gulp-concat'),                            // 合并文件
    rename = require('gulp-rename'),                            // 重命名文件
    filter = require('gulp-filter');                            // 过滤文件

gulp.task('fo', ['fo-del'], function () {
    var f = filter(['*/**','!FileOperations/**/common.css']);
    gulp.src('FileOperations/css/*.css')
        .pipe(f)
        .pipe(concat('all.css'))
        .pipe(rename('main.css'))
        .pipe(gulp.dest('FileOperations/dist'))
});
gulp.task('fo-del',function (cb) {
    return del('FileOperations/dist',cb)
});


// 压缩
var uglify = require('gulp-uglify'),                            // 压缩js
    csso = require('gulp-csso'),                                // 压缩css
    htmlmin = require('gulp-html-minify'),                      // 压缩html
    imagemin = require('gulp-imagemin'),                        // 压缩图片
    zip = require('gulp-zip');                                  // 打包成压缩文件

gulp.task('com', ['uglify','csso','htmlmin','imagemin','zip'], function () {
    console.log('完成！')
});
gulp.task('uglify',function () {
    gulp.src('Compression/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('Compression/dist/js'))
});
gulp.task('csso',function () {
    gulp.src('Compression/css/*.css')
        .pipe(csso())
        .pipe(gulp.dest('Compression/dist/css'))
});
gulp.task('htmlmin',function () {
    gulp.src('Compression/*.html')
        .pipe(htmlmin())
        .pipe(gulp.dest('Compression/dist'))
});
gulp.task('imagemin',function () {
    gulp.src('Compression/img/*.{jpg,png,gif,ico}')
        .pipe(imagemin())
        .pipe(gulp.dest('Compression/dist/img'))
});
gulp.task('zip',function () {
    gulp.src('Compression/**')
        .pipe(zip('backup.zip'))
        .pipe(gulp.dest('Compression/dist'))
});


// JS/CSS自动注入
var autoprefixer = require('gulp-autoprefixer'),                // 为css添加浏览器前缀
    useref = require('gulp-useref'),                            // 解析构建块在HTML文件来代替引用未经优化的js和css
    rev = require('gulp-rev'),                                  // 给文件添加版本号
    revReplace = require('gulp-rev-replace'),                   // 替换被gulp-rev改名的文件名
    htmlReplace = require('gulp-html-replace');                 // 替换html中的构建块

gulp.task('ai', function () {
    gulp.src('AutoInjection/demo.html')
        .pipe(useref())
        .pipe(rev())
        .pipe(revReplace())
        .pipe(gulp.dest('AutoInjection/dist'))
});
gulp.task('htmlreplace', function () {
    gulp.src('AutoInjection/demo.html')
        .pipe(htmlReplace({
            'css': 'css/main.css',
            'js': 'js/main.js'
        }))
        .pipe(gulp.dest('AutoInjection/dist'))
});
gulp.task('autoprefixer', function () {
    gulp.src('AutoInjection/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],       // 浏览器版本
            cascade: true,                       // 美化属性，默认true
            add: true,                           // 是否添加前缀，默认true
            remove: true,                        // 删除过时前缀，默认true
            flexbox: true,                       // 为flexbox属性添加前缀，默认true
        }))
        .pipe(gulp.dest('AutoInjection/dist'))
});

// 流控制
var gulpif = require('gulp-if');                                // if条件判断

gulp.task('fc',function () {
    var condition = false;
    gulp.src('FlowControl/js/*.js')
        .pipe(gulpif(condition, uglify(), concat('main.js')))   // condition为true时执行uglify(), else 执行concat('main.js')
        .pipe(gulp.dest('FlowControl/dist/js'))
});

// 工具
var $ = require('gulp-load-plugins')();                         // 插件加载
var sass = require('gulp-sass');                                // 编译sass
var babel = require('gulp-babel');                              // 编译es6

gulp.task('load',function () {
    gulp.src('Instrument/js/*.js')
        .pipe($.concat('all.js'))                               // 使用插件就可以用$.PluginsName()
        .pipe(gulp.dest('Instrument/dist/js'))
});
gulp.task('sass', function () {
    gulp.src('Instrument/sass/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'                           // 配置输出方式,默认为nested
        }).on('error', sass.logError))
        .pipe(gulp.dest('Instrument/dist/css'));
});
gulp.task('sass:watch', function () {
    gulp.watch('Instrument/sass/*.scss', ['sass']);             // 实时监听sass文件变动,执行sass任务
});
gulp.task('babel',function () {
    gulp.src('Instrument/js/*.js')
        .pipe(babel({
            presets: ['es2015']                                 // 将es6代码编译成es5
        }))
        .pipe(gulp.dest('Instrument/dist/js'))
});