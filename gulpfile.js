var gulp = require('gulp'),
	markdown = require('gulp-markdown'),
  jade = require('gulp-jade'),
  notify = require('gulp-notify'),
  prettify = require('gulp-html-prettify'),
  connect = require('gulp-connect'),
	less = require('gulp-less');

var replace = require('gulp-replace');
var prettify = require('gulp-prettify');
var markdownpdf = require('gulp-markdown-pdf');
var imageResize = require('gulp-image-resize');

var lessFiles = ['components/less/*.less'];
var jadeSource = ['./components/*.jade'];
var jadeFiles = ['./templates/*.jade', "./templates/**/*.jade"];
var markdownFiles = ['./content/*.md'];
var htmlSourcse = ["./builds/*/*.html"];
var imgSouce = ['./images/*'];

gulp.task('screenshots', function () {
  gulp.src(['./dist/pages/*.png'])
    .pipe(imageResize({
      width : 200,
      height : 200,
      crop : true,
      upscale : false,
			gravity: 'north'
    }))
    .pipe(gulp.dest('./dist/pages/sm/'));
});

gulp.task('images', function() {
	gulp.src(imgSouce)
	.pipe(gulp.dest('builds/images'))
	.pipe(notify({ message: 'Images Coppied Over' }));
});

gulp.task('pdf-less', () => {
	gulp.src('./components/pdf-less/pdf.less')
		.pipe(less())
		.pipe(gulp.dest('dist/css'));
});

gulp.task('pdf', ['pdf-less'], () => {
	return gulp.src('./content/final-content.md')
		.pipe(markdownpdf({
			cssPath: './dist/css/pdf.css'
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('replace', function() {
	gulp.src(htmlSourcse)
	.pipe(replace(/(<h[1,2,3]) id="[a-z\-]*">/g, '$1>'))
	.pipe(replace(/(The Empire State)\s*/g, '$1'))
	.pipe(replace(/(css".)\s*\</g, '$1\n\t<'))
	.pipe(gulp.dest('builds'));
});

gulp.task('format', function() {
  gulp.src('builds/*/*.html')
    .pipe(prettify({indent_size: 4}))
    .pipe(gulp.dest('builds'))
});

gulp.task('less', () => {
	gulp.src(lessFiles)
		.pipe(less())
		.pipe(gulp.dest('builds/css'))
		.pipe(connect.reload())
    .pipe(notify({ message: 'Less File turned to CSS!' }));
});

// Converts Markdown to HTML
gulp.task('markdown', () => {
    return gulp.src(markdownFiles)
	    .pipe(markdown())
			.pipe(prettify({indent_size: 4}))
			.pipe(replace(/(<h[\d]) id="[\d\w\w\-]*">/g, '$1>'))
			.pipe(replace(/([\w\.\,\)\;])[\r\n][ \t]+/g, '$1 '))
			.pipe(replace(/(<\/\w[1,2,3,p,l,e]*>)/g, '$1\r\r'))
	    .pipe(gulp.dest('./html/md/'))
	    .pipe(connect.reload())
	    .pipe(notify({ message: 'Markdown to HTML task complete' }));
});

// Converts Jade to HTML (jade is including markdown files)
gulp.task('jade', ['less'], () => {  // ['markdown'] forces jade to wait
    return gulp.src(jadeFiles)
        .pipe(jade({
            pretty: true,  // uncompressed
        }))
				.pipe(prettify({indent_size: 4}))
				.pipe(replace(/(<h[\d]) id="[\d\w\w\-]*">/g, '$1>'))
				.pipe(replace(/([\w\.\,\)\;])[\r\n][ \t]+/g, '$1 '))
        .pipe(gulp.dest('./builds/'))
        .pipe(connect.reload())
        .pipe(notify({ message: 'Jade to HTML task complete' }));
});

gulp.task('connect', () => {
	connect.server({
		root: 'builds/',
		port: 8000,
		livereload: true
	});
});

gulp.task("html", () => {
	gulp.src(htmlSourcse)
		.pipe(connect.reload())
		.pipe(notify({ message: 'Watching HTML' }));
});

gulp.task('watch', () => {
	gulp.watch(lessFiles, ['less']);
	gulp.watch(jadeFiles, ['jade']);
	gulp.watch(jadeSource, ['jade']);
	gulp.watch(markdownFiles, ['jade']);
	gulp.watch(imgSouce, ['images']);
	gulp.watch(['./content/final-content.md', './components/pdf-less/pdf.less'], ['pdf']);
});

gulp.task('default', ['images', 'jade', 'connect', 'watch']);
