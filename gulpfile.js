const del = require('del')
const gulp = require('gulp')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify-es').default

// Development Tasks
// -----------------

// Optimizing JavaScript
gulp.task('distribute', () => gulp.src('src/**/*')
  .pipe(babel({
    presets: ['@babel/preset-env']
  }))
  .pipe(uglify())
  .pipe(gulp.dest('dist'))
)

// Cleaning
gulp.task('clean:dist', () => del('dist'))

gulp.task('clean:browser', () => del('browser'))

gulp.task('clean', gulp.series('clean:dist', 'clean:browser'))

gulp.task('default', gulp.series('distribute'))

gulp.task('build', gulp.series('clean', 'distribute'))
