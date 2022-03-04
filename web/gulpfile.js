/*************************************************************
v2.1
Copyright (c) Gregorio Bolivar 2022 - https://github.com/grbolivar
Usage prohibited without prior authorization.
Docs and lastest version on GitHub.
*************************************************************/

const { src, dest, series, parallel, watch } = require('gulp');
const concat = require('gulp-concat');
const terser = require("gulp-terser")
const order = require("gulp-order");
const sass = require('gulp-dart-sass');
const pug = require('gulp-pug')
const csso = require('gulp-csso');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();
const package = require('./package.json');

let SHOULD_MINIFY = false;

let sourceFolder = "./src/";
let buildFolder = "./dist/";

async function setMinify(done) {
	SHOULD_MINIFY = true;
}

async function js(done) {
	let build = src([
		sourceFolder + "*.js",
		sourceFolder + "app/**/*.js",
	])
		.pipe(order([
			"Env.js",
			"app/**/*.js",
			"Routes.js",
			"Main.js",
		], { base: sourceFolder }))
		.pipe(concat("build.js"))

	if (SHOULD_MINIFY) {
		build.pipe(terser({
			compress: { drop_console: true, },
			mangle: { properties: { regex: /^__/ }, }
		}))
	}

	build.pipe(dest(buildFolder))
}

async function css(done) {
	let build = src([
		sourceFolder + "*.s{c,a}ss",
		sourceFolder + "app/**/*.s{c,a}ss",
	])
		.pipe(sass())
		.pipe(src([
			sourceFolder + "*.css",
			sourceFolder + "app/**/*.css",
		]))
		.pipe(concat("build.css"))

	if (SHOULD_MINIFY) {
		build.pipe(csso())
	}

	build.pipe(dest(buildFolder))
}

async function html(done) {
	let build = src([
		sourceFolder + "*.pug",
		sourceFolder + "app/**/*.pug",
	])
		.pipe(pug({ pretty: true }))
		.pipe(src([
			sourceFolder + "*.html",
			sourceFolder + "app/**/*.html"
		]))
		.pipe(order([
			'index.*',
			'*'
		]))
		.pipe(concat("index.html"))

	if (SHOULD_MINIFY) {
		build.pipe(htmlmin({ 
			collapseWhitespace: true,
			collapseInlineTagWhitespace: true,
			minifyCSS: true,
			removeComments: true,
			removeEmptyAttributes: true,
			useShortDoctype: true,
		}))
	}

	build.pipe(dest(buildFolder))
}

async function res() {
	src([sourceFolder + "res/**/*"]).pipe(dest(buildFolder + "res"))
}

async function browser(done) {
	if (browserSync.active) {
		browserSync.reload()
	} else {
		browserSync.init({
			server: {
				baseDir: "./dist/"
			}
		});
	}
	done();
}

function help(done) {
	console.log("Gulp build tasks:\n- Run 'dev' to start browserSync and start watching for source changes.\n- Run 'build' to just build without browserSync and no watching.\n- Run 'prod' to build and minify for production.\n- Run 'prod-run' to build, minify then run on browser for quick test.");
	done();
}


exports.default = help

exports.dev = _ => watch(
	sourceFolder + "**/*.{js,ts,css,scss,sass,pug,html}",
	{ ignoreInitial: false },
	series(
		parallel(
			js,
			css,
			html,
			res,
		),
		browser
	),
);

exports.build = series(
	parallel(
		js,
		css,
		html,
		res,
	)
)

exports.prod = series(
	setMinify,
	parallel(
		js,
		css,
		html,
		res,
	)
)

exports["prod-run"] = series(
	setMinify,
	parallel(
		js,
		css,
		html,
		res,
	),
	browser
)