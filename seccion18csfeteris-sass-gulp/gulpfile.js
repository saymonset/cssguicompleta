const { src, dest, watch, series, parallel } = require('gulp');

// CSS y SASS
// Estoy importando gulp-sass y sass y queda en la constante sass
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

// Imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// con gulp css ejecuta toda esta funcion
function css( done ) {
    // Para compilar scss
    // sass tienen todo lo de sass y gulp-sass permite conectarlo con gulp para compilarlo y sacar el css
    // npm i --save-dev sass gulp-sass
    // src es una funcion de gulp que nos permite identificar un archivo
    // Le indicamos donde esta la hoja de estilo de scss
    // Compilar sass
    // Pasos: 1 - Identificar archivo, 2 - Compilarla, 3 - Guardar el .css
    src('src/scss/app.scss')
        // Compilamos el app.scss
        .pipe( sourcemaps.init() )
        //llamo al la funcion de sass() que la importe con require('gulp-sass')(require('sass'))
        .pipe( sass() )

        .pipe( postcss([ autoprefixer(), cssnano() ]) )
        .pipe( sourcemaps.write('.'))
        // aqui almacenamos la hoja de estilo cmpilada
        .pipe( dest('build/css') )

    done();
}

function imagenes() {
    return src('src/img/**/*')
        .pipe( imagemin({ optimizationLevel: 3 }) )
        .pipe( dest('build/img') )
}

function versionWebp() {
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
        .pipe( webp( opciones ) )
        .pipe( dest('build/img') )
}
function versionAvif() {
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
        .pipe( avif( opciones ) )
        .pipe( dest('build/img'))
}

function dev() {
    watch( 'src/scss/**/*.scss', css );
    watch( 'src/img/**/*', imagenes );
}
function tarea(done) {
    console.log('Primera tarea saymon');
    //Estamos diciendole a gulp que ya la funcion a finalizado con done
    // Cuano llegue  a la linea de done, ya gulp sabe que termino la tarea
    done();
}

exports.simonTarea = tarea;
exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series( imagenes, versionWebp, versionAvif, css, dev  );

// series - Se inicia una tarea, y hasta que finaliza, inicia la siguiente
// parallel - Todas inician al mismo tiempo