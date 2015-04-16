var gulp = require('gulp'),
	markdown = require('gulp-markdown'),
    jade = require('gulp-jade'),    
    notify = require('gulp-notify'),
    prettify = require('gulp-html-prettify'),
    connect = require('gulp-connect'),
	less = require('gulp-less');

var lessFiles = ['components/less/*.less'];
var jadeSource = ['./components/*.jade'];
var jadeFiles = ['./templates/*.jade', "./templates/**/*.jade"];
var markdownFiles = ['./content/*.md'];
var htmlSourcse = ["./builds/*.html"];
var imgSouce = ['./images/*'];

gulp.task('images', function() {
	gulp.src(imgSouce)
	.pipe(gulp.dest('builds/images'))
	.pipe(notify({ message: 'Images Coppied Over' }));
});

gulp.task('less', function() {
	gulp.src(lessFiles)
		.pipe(less())
		.pipe(gulp.dest('builds/css'))
		.pipe(connect.reload())    
        .pipe(notify({ message: 'Less File turned to CSS!' }));
});

// Converts Markdown to HTML
gulp.task('markdown', function () {
    return gulp.src(markdownFiles)
        .pipe(markdown())
        .pipe(gulp.dest('./html/md/'))
        .pipe(connect.reload())
        .pipe(notify({ message: 'Markdown to HTML task complete' }));
});
 
// Converts Jade to HTML (jade is including markdown files)
gulp.task('jade', ['markdown'], function() {  // ['markdown'] forces jade to wait
    return gulp.src(jadeFiles)
        .pipe(jade({
            pretty: true,  // uncompressed
        }))
        .pipe(gulp.dest('./builds/'))    
        .pipe(connect.reload())    
        .pipe(notify({ message: 'Jade to HTML task complete' }));
});

gulp.task('connect', function() {
	connect.server({
		root: 'builds/',
		port: 8000,
		livereload: true
	});
});

gulp.task("html", ['images'], function() {
	gulp.src(htmlSourcse)
		.pipe(connect.reload())
		.pipe(notify({ message: 'Watching HTML' }));
});

gulp.task('watch', function() {	
	gulp.watch(markdownFiles, ['markdown']);
	gulp.watch(lessFiles, ['less']);
	gulp.watch(jadeFiles, ['jade']);
	gulp.watch(jadeSource, ['jade']);
	gulp.watch(markdownFiles, ['jade'])	
	gulp.watch(htmlSourcse, ['html', 'images']);
});

gulp.task('default', ['html','less', 'jade', 'connect', 'watch']);