## For JAMStack web apps/sites
v2.1

## Licencing
UNLICENSED.
Usage prohibited without prior authorization.

## Usage
Use the file structure indicated below to organize your source code. Building generates just three files with your site/app ready to be deployed: index.html, build.css and build.js.

## Compatible languages
Write your code on any of these languages: HTML, PUG, JavaScript, TypeScript, CSS, SASS.

## Dependencies
```npm
npm i browser-sync gulp --save-dev
npm i gulp-concat gulp-csso gulp-dart-sass gulp-htmlmin gulp-order gulp-pug gulp-terser
```

## Build options
```
default
    Presents all available build options.
dev
    Starts browserSync and starts watching for files changes on src/.
build
    Just builds without browserSync and no watching.
prod
    Builds and minifies output for production.
prod-run
    Builds, minifies then run on browser for quick test.
```

## Folder/files structures
```
dist/
	Output folder
src/
	app/
		Main code here. Structure pages/components with folders and sub-folders as needed. Keep html/js/css files separated for maintainability. Sample structure:
		app/
			components/
				<one folder per component>/
					markup.pug
					js.js
					styles.sass
			pages/
				<one folder per page>/
					markup.html
					js.js
					styles.sass
					more_styles.css
					<internal component>/
						markup.pug
						js.ts
	res/
		Resources. Files here will just be copied over to dist/res/ and NOT added to any of the builds. Add here data files (JSON, XML, text), images, documents, even other HTML/JS/CSS files like third-party libraries. Use as many sub-directories as needed for organization.
	Env.js
		Define any environmental variables. This file will be added at the very top of build.js
	Main.js
		Setup and start framework/api here. This file will be added at the very end of build.js
	Routes.js
		Define Framework Routes here
	index.html
		Main index file. Include build.css and build.js (as defer)
	Other Files
		Any other JS(TS) or CSS(SASS) files will be added at the bottom of each build.
```
