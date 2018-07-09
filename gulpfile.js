var gulp = require('gulp');
var pug = require('gulp-pug');
var stylus = require('gulp-stylus');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

// var moduleBgFix = require('./moduleBgFix/');

var concat = require('gulp-concat');
var del = require('del');

var browserSync = require('browser-sync');
var server = browserSync.create();

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: './ready'
    }
  });
  done();
}

var pugFiles = [
	'src/**/*.pug',
	'!src/layouts/**',
	'!src/blocks/**'
];
var stylFiles = [
	'src/layouts/**/*.styl',
	'src/blocks/**/*.styl',
];

gulp.task('pug', function() {
	return gulp.src(pugFiles)
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('ready/'))

});

gulp.task('stylus', function() {
    var postCSSplugins = [
        autoprefixer({browsers: ['last 10 version']}),
    ];
	return gulp.src(stylFiles)
		.pipe(stylus())
		.pipe(postcss(postCSSplugins))
    	.pipe(concat('all.css'))
		.pipe(gulp.dest('ready/'))
		.pipe(server.stream())
});


gulp.task('watch', function(){
	gulp.watch('src/**/*.styl', gulp.series('stylus'));
	gulp.watch('src/**/*.pug', gulp.series('pug', reload));
});

gulp.task('clean', function(){
	return del('./build');	
});

gulp.task('build', gulp.parallel('stylus', 'pug'));

gulp.task('serve', gulp.parallel('watch', serve));

gulp.task('default', gulp.series('clean','build', 'serve'));