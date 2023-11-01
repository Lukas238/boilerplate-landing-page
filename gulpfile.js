
const { readFileSync } = require('fs');
const { src, dest, series, parallel, watch } = require('gulp');
const twig = require('gulp-twig');
const browserSync = require('browser-sync').create();

function markup() {

  var data_json = readFileSync('./src/twig_data.json');
  data_json = JSON.parse(data_json);

  return src('src/markup/pages/*.twig')
    .pipe(twig({
      base: 'src/markup',
      data: data_json,
      functions: [
        {
          name: "format_currency",
          func: function (value, locale) {
            value = value || 0;
            locale = locale || 'en-US';

            let currency = new Intl.NumberFormat(locale, {
              style: 'currency',
              currency: 'USD',
            });

            return currency.format(value);
          }
        }
      ]
    }))
    .pipe(dest('dev'));
}

function css() {
  return src('src/scss/**/*.css')
    .pipe(dest('dev/css'))
    .pipe(browserSync.stream());
}


function watcher() {
  browserSync.init({
    watch: true,
    server: {
      baseDir: 'dev'
    }
  });

  watch([
    'src/markup/**/*.twig',
    'src/twig_data.json'
  ], markup);
  watch('src/scss/**/*.css', css);

}




exports.default = series(parallel(markup, css), watcher);
