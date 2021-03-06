var gulp = require('gulp'),
	markdown = require('gulp-markdown'),
  jade = require('gulp-jade'),
  notify = require('gulp-notify'),
  connect = require('gulp-connect'),
	less = require('gulp-less');

var replace = require('gulp-replace');
var prettify = require('gulp-prettify');
var markdownpdf = require('gulp-markdown-pdf');
var rename = require("gulp-rename");

var lessFiles = ['components/less/*.less'];
var jadeSource = ['./components/*.jade'];
var jadeFiles = ['./templates/*.jade', "./templates/**/*.jade"];
var markdownFiles = ['./content/*.md'];
var htmlSourcse = ["./builds/*/*.html"];
var imgSouce = ['./images/*'];
const localJs = ['./components/js/*'];

gulp.task('images', function() {
	gulp.src(imgSouce)
	.pipe(gulp.dest('builds/images'))
	.pipe(notify({ message: 'Images Copied Over' }));
});

gulp.task('js', function() {
	gulp.src(localJs)
		.pipe(gulp.dest('builds/js'))
		.pipe(notify({ message: 'js Copied Over' }));
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
		.pipe(rename(function (path) {
	    path.extname = ".pdf";
	  }))
		.pipe(gulp.dest('dist'));
});

// gulp.task('replace', function() {
// 	gulp.src(htmlSourcse)
// 	.pipe(replace(/(<h[1,2,3]) id="[a-z\-]*">/g, '$1>'))
// 	.pipe(replace(/(The Empire State)\s*/g, '$1'))
// 	.pipe(replace(/(css".)\s*\</g, '$1\n\t<'))
// 	.pipe(gulp.dest('builds'));
// });
//
// gulp.task('format', function() {
//   gulp.src('builds/*/*.html')
//     .pipe(prettify({indent_size: 4}))
//     .pipe(gulp.dest('builds'))
// });

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
	gulp.watch(localJs, ['js']);
	gulp.watch(['./content/final-content.md', './components/pdf-less/pdf.less'], ['pdf']);
});

gulp.task('default', ['images', 'js', 'jade', 'connect', 'watch']);
