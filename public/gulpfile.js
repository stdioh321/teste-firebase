var concat = require('gulp-concat');
var minify = require('gulp-minify');
var gulp = require('gulp');
var runSequence = require('gulp4-run-sequence');
// var sassCompile = require("gulp-sass");
var sassCompile = require('gulp-sass')(require('sass'));

gulp.task("dev", function(cb) {
    runSequence(['styles', "defaultTask"], function() {
        console.log('Run something else');
        cb();
    });
});

gulp.task("defaultTask", function(cb) {
    // place code for your default task here
    console.log("defaultTask")
    cb();
});


gulp.task("styles", function(cb) {
    gulp.src(['./node_modules/bootstrap/scss/bootstrap.scss', './node_modules/bootstrap-icons/font/*.scss'])
        .pipe(sassCompile())
        .pipe(minify())
        .pipe(concat('all.css'))
        .pipe(gulp.dest('./'))
        .pipe(reload({ stream: true }));

    cb();
});

// gulp.task ('watch', function(){
//   gulp.watch('src/scripts/scss/**/*.scss', ['styles']);
//   gulp.watch('src/scripts/js/**/*.js', ['scripts']);
// });


// gulp.task('default', ['scripts', 'styles', 'watch']);