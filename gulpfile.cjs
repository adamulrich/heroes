

    var gulp =  require("gulp");
    var ts = require("gulp-typescript");
    console.log((ts));
    var tsProject = ts.createProject("tsconfig.json");

    // Task which would just create a copy of the current views directory in dist directory
    gulp.task("views", function () {
        return gulp.src("./src/views/**/*.ejs").pipe(gulp.dest("./dist/views"));
    });

    // Task which would just create a copy of the current static assets directory in dist directory
    gulp.task("public", function () {
        return gulp.src("./public/**/*").pipe(gulp.dest("./dist/public"));
    });

    // The default task which runs at start of the gulpfile.js
    gulp.task("default", gulp.series("views", "public"), () => {
        console.log("Done");
    });
