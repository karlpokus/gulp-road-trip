var gulp = require('gulp'),
    fs = require('fs'),
    marked = require('gulp-marked'),
    Transformer = require('stream').Transform;

var sortByMtime = new Transformer({
  objectMode: true,
  transform: function(file, enc, cb) {
    file.ts = fs.statSync(file.path).mtime.getTime();
    
    if (!this.files) {
      this.files = []; 
    }
    this.files.push(file);
    cb(); // wait for flush to push
  },
  flush: function(cb) {
    this.files
      .sort(function(a, b){
        return b.ts - a.ts;
      })
      .forEach(function(file) {
        this.push(file);
      }, this);
    cb();
  }
});

var logger = new Transformer({
  objectMode: true,
  transform: function(file, enc, cb) {
    console.log(file.path);
    cb(null, file);
  }
});

gulp.task('foo', function() {
  return gulp.src('./src/*.md')
    .pipe(sortByMtime)
    .pipe(logger);
    //.pipe(marked())
    //.pipe(gulp.dest('./html/'));
});

