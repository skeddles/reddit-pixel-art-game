var gulp = require('gulp');
var path = require('path');
var fs = require('fs');

//██████████ GULP PLUGINS ███████████████

var gutil = require('gulp-util');
var uglifyjs = require('uglify-es');
var composer = require('gulp-uglify/composer');
var uglify = composer(uglifyjs, console);
var sourcemaps = require('gulp-sourcemaps');
var include = require('gulp-include');
var sass = require('gulp-sass')(require('sass'));
var handlebars = require('gulp-hb');
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var through = require('through2');


//████████████████████████████████████████████████████████████████████████████████
//██████████████████████████████ ENVIRONMENT █████████████████████████████████████
//████████████████████████████████████████████████████████████████████████████████

const LIVE = process.env.LIVE;
console.log('ENV:',LIVE?'live':'dev');
const environments = require('gulp-environments');
const liveOnly = environments.make('live');
environments.current(LIVE?'live':'dev');
const cssStyle = LIVE?'compressed':'compressed';

//████████████████████████████████████████████████████████████████████████████████
//████████████████████████████████ TASKS █████████████████████████████████████████
//████████████████████████████████████████████████████████████████████████████████

//html task - copies static files
gulp.task("files", function () {
	return gulp.src('files/**/*.*')
		.pipe(gulp.dest("./build"));
});


//music task - copies music files
gulp.task("music", function () {

	let levelList = fs.readdirSync('./music', {withFileTypes: true}).map(item => item.name.replace('.mp3',''))
	fs.writeFileSync('./build/music-list.json', JSON.stringify(levelList), 'utf-8');

	return gulp.src('music/**/*.*')
		.pipe(gulp.dest("./build/music"));
});

//levels task - copies level data files
gulp.task("levels", function () {

	let levelList = fs.readdirSync('./levels', {withFileTypes: true}).map(item => item.name)
	fs.writeFileSync('./build/level-list.json', JSON.stringify(levelList), 'utf-8');
	console.log('levelList',levelList);

	return gulp.src('levels/*.json')
		.pipe(gulp.dest("./build/levels"))

});
 
//js task - combines and minimizes js files in /scripts directory
gulp.task("js", function() {
	return gulp.src(['js/*.js','!js/_*.js'])

		.pipe(include({includePaths: ['js']})).on('error', console.log)
		//.pipe(sourcemaps.init())
		.pipe(liveOnly(uglify({compress: {drop_console: true }}))).on('error', console.log)
		//.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest("./build"));
});

//css task - processes sass and minimizes scss files in /sass directory
gulp.task("css", function() {
	return gulp.src(['css/*.scss','!css/_*.scss'])
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: cssStyle}).on('error', sass.logError))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest("./build"));
});

//img project task - minimizes gif,png,jpg,svg files for projects - in /img
gulp.task("image", function() {
	return gulp.src('images/**/*.*')
		//minify
		.pipe(imagemin())
		//out
		.pipe(gulp.dest('build/images'));
});


//████████████████████████████████████████████████████████████████████████████████
//████████████████████████████████ WATCHER / MASTER ██████████████████████████████
//████████████████████████████████████████████████████████████████████████████████


//the one task to rule them all
gulp.task('default',
	gulp.series(
		'files',
		'music',
		'levels',
		'css',
		'image',
		'js'
	)
);

//start watchers
gulp.task('watch', function(){

	console.log('\n███ STARTING WATCH ██████████████████████\n\n');

    //watch scripts folder for changes in any files
    gulp.watch(['files/**/*.*'], gulp.series('files'));
    gulp.watch(['music/*.mp3'], gulp.series('music'));
    gulp.watch(['levels/*.json'], gulp.series('levels'));

    //watch scripts folder for changes in any files
    gulp.watch(['js/**/*.js*'], gulp.series('js'));

    //watch sass folder for changes in any files 
    gulp.watch(['css/**/*.scss'], gulp.series('css'));

    //watch image folder for changes in any files 
    gulp.watch(['images/**/*.*'], gulp.series('image'));


});

/*global done*/