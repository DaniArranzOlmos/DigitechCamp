const { src, dest, watch, parallel } = require('gulp');

// CSS
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

// Imágenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// JavaScript
const terser = require('gulp-terser-js');
const concat = require('gulp-concat');
const rename = require('gulp-rename');

// Webpack
const webpack = require('webpack-stream');

const paths = {
  scss: 'src/scss/**/*.scss',
  js: 'src/js/**/*.js',
  imagenes: 'src/img/**/*'
};

// Compilar SCSS
function css() {
  return src(paths.scss)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }))
    // Descomenta la siguiente línea si quieres minificar el CSS y añadir prefijos automáticamente
    // .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('public/build/css'));
}

// Compilar JS con Webpack
function javascript() {
  return src(paths.js)
    .pipe(webpack({
      mode: 'production',
      entry: './src/js/app.js',
      output: {
        filename: 'bundle.js'
      },
      module: {
        rules: [
          {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader']
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource'
          }
        ]
      }
    }))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(terser())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('public/build/js'));
}

// Optimización de imágenes
function imagenes() {
  return src(paths.imagenes)
    .pipe(cache(imagemin({ optimizationLevel: 3 })))
    .pipe(dest('public/build/img'));
}

// Conversión a WebP
function versionWebp(done) {
  const opciones = {
    quality: 50
  };
  src('src/img/**/*.{png,jpg}')
    .pipe(webp(opciones))
    .pipe(dest('public/build/img'));
  done();
}

// Conversión a AVIF
function versionAvif(done) {
  const opciones = {
    quality: 50
  };
  src('src/img/**/*.{png,jpg}')
    .pipe(avif(opciones))
    .pipe(dest('public/build/img'));
  done();
}

// Dev watcher
function dev(done) {
  watch(paths.scss, css);
  watch(paths.js, javascript);
  watch(paths.imagenes, imagenes);
  watch(paths.imagenes, versionWebp);
  watch(paths.imagenes, versionAvif);
  done();
}

// Exportar tareas
exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(css, imagenes, versionWebp, versionAvif, javascript, dev);
