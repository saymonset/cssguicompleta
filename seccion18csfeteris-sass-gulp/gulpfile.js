const { src, dest, watch, series, parallel } = require('gulp');

// CSS y SASS
// Estoy importando gulp-sass y sass y queda en la constante sass
const sass = require('gulp-sass')(require('sass'));
// Con postcss, autoprefixer   estas dos dependencias, podemos escribir codigo de ultima generacion de css y va a crear versiones comatibles con naveadores que no la soportan
//npm -i --save-dev autoprefixer gulp-postcss
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

// Imagenes
// Hacer imagenes mas ligeras
// Instalamos el minificado de imagen con gulp
// npm i --save-dev gulp-imagemin
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');
const gulpWebp = require('gulp-webp');

// con gulp css ejecuta toda esta funcion
function css( done ) {
    // Para compilar scss
    // sass tienen todo lo de sass y gulp-sass permite conectarlo con gulp para compilarlo y sacar el css
    // npm i --save-dev sass gulp-sass
    // src es una funcion de gulp que nos permite identificar un archivo
    // Le indicamos donde esta la hoja de estilo de scss
    // Compilar sass
    // Pasos: 1 - Identificar archivo, 2 - Compilarla, 3 - Guardar el .css
    // src que identifica un archivo y es de gulo
    src('src/scss/app.scss')
        // Compilamos el app.scss
        .pipe( sourcemaps.init() )
        //llamo al la funcion de sass() que la importe con require('gulp-sass')(require('sass'))
        // Con esto minficamos el css que es originado por sass
        .pipe( sass({outputStyle:'compressed'}) )
       // Crea codigo que va  a hacer soportado por otros navegqdores  que tal ves no soporte
       //las nuevas caracteristicas
        .pipe( postcss([ autoprefixer(), cssnano() ]) )
        .pipe( sourcemaps.write('.'))
        // aqui almacenamos la hoja de estilo cmpilada
        .pipe( dest('build/css') )

    done();
}
// Fuentes de las imagenes
function imagenes() {
    // Todos los archivos que esten en la carpeta src/img
    // Con colocar return, ya no es necesario colocar done
    return src('src/img/**/*')
    //Ejecutamos gulp imagenes
    // Aqui con la libreria de minificar imagenes, minifico cada imagen encontrada con  imagemin({ optimizationLevel: 3 })
        .pipe( imagemin({ optimizationLevel: 3 }) )
        // Muevelos a esta carpeta
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
    // Cualquier cambio que hagas, el watch lo vuelve a compilar
    //Atentos a estos arhcivos *.css, en caso que ocurra un cambio, llama a la funcion css
    //Con estos comodines **, buscate todos lo archivos con extension scss dentro de cualquier 
    //carpeta scss
    watch( 'src/scss/**/*.scss', css );
    // En caso que halla una nueva imagenes, llamo nuevamente a la tarea de imagenes pra cargarla
    // con watch automaticamente
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
// Aqui extportamos dev que tiene watch
//Lo mantenemos ejecutandolo con gulp dev
exports.dev = dev;
// Aqui tambien puedo cargar las imagenes
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
// Ejecuta las tareas con solo tipear gulpWebp. Se ejecuta cada tarea seacuencialmente
// series - Se inicia una tarea, y hasta que finaliza, inicia la siguiente
// parallel - Todas inician al mismo tiempo
//Siempre dejas las que tenga los watxh hasta el final
// Aca llamos las imagenes cargadas
exports.default = series( imagenes, versionWebp, versionAvif, css, dev  );

