var fs = require('fs'),
    path = require('path'),
    gulp = require('gulp'),
    nodemon = require('nodemon'),
    del = require('del'),
    // cleancss = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    // autoprefixer = require('gulp-autoprefixer'),
    // rename = require('gulp-rename'),
    // cache = require('gulp-cache'),
    // expect = require('gulp-expect-file'),
    pug = require('gulp-pug'),
    // concat = require('gulp-concat'),
    // uglify = require('gulp-uglify'),
    // gulpif = require('gulp-if'),
    // bump = require('gulp-bump'),
    // wrap = require('gulp-wrap'),
    // replace = require('gulp-replace'),
    livereload = require('gulp-livereload'),
    ngAnnotate = require('gulp-ng-annotate'),
    changed = require('gulp-changed'),
    // beep = require('beepbeep'),
    // sourcemaps = require('gulp-sourcemaps'),
    // filter = require('gulp-filter'),
    babel = require('gulp-babel'),
    build = false;

function outputErrorAndContinue(error) {
    console.error(error.toString());
    this.emit('end');
}

gulp.task('templates', () => {
    return gulp.src('client/templates/**/!(_)*.pug')
        .pipe(changed('public/', {extension: '.html'}))
        .pipe(pug({doctype: 'html', pretty: !build, basedir: path.resolve('./shared')}).on('error', outputErrorAndContinue))
        .pipe(gulp.dest('public/'))
        .pipe(livereload());
});

gulp.task('scripts', () => {
    return gulp.src('client/scripts/**/!(_)*.js')
        // .pipe(changed('public/'))
        .pipe(babel({
            presets: ['es2016']
        }).on('error', outputErrorAndContinue))
        .pipe(ngAnnotate())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('public/'))
        .pipe(livereload());
});

gulp.task('styles', () => {
    return gulp.src('client/styles/**/*.scss')
        .pipe(sass().on('error', outputErrorAndContinue))
        .pipe(gulp.dest('public/'))
        .pipe(livereload());
});

gulp.task('serve', (cb) => {
    nodemon({
        script: 'server.js',
        watch: ['server.js', 'server/**/*'],
        nodeArgs: ['--debug=5858']
        //..or nodeArgs: ['--debug-brk=5858'] to debug at server start
    }).on('start', function () {
        setTimeout(function () {
            livereload.changed();
        }, 2000); // wait for the server to finish loading before restarting the browsers
    });
});

gulp.task('watch', () => {
    livereload.listen(35729);
    gulp.watch('client/templates/**/*.pug', ['templates']);
    gulp.watch('client/scripts/**/*.js', ['scripts']);
    gulp.watch('client/styles/**/*.scss', ['styles']);
});

gulp.task('clean', () => {
    return del(['public/*']);
});

gulp.task('build', () => {
    build = true;
    return gulp.start('default');
});

gulp.task('default', ['clean'], () => {
    var tasks = ['templates', 'scripts', 'styles', 'serve']; // ['bower', 'fonts', 'styles', 'images', 'assets', 'scripts', 'templates'];
    if ( ! build ) tasks.push('watch');
    return gulp.start.apply(gulp, tasks);
});
