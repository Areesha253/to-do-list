import { src, dest, watch, series, parallel } from "gulp";
import * as sass from "sass";
import gulpSass from "gulp-sass";
import cleanCSS from "gulp-clean-css";
import uglify from "gulp-uglify";
import concat from "gulp-concat";
import autoprefixer from "gulp-autoprefixer";
import imagemin from "gulp-imagemin";
import imageminOptipng from "imagemin-optipng";
import Toastify from "toastify-js";

const sassWithCompiler = gulpSass(sass);

const paths = {
  sass: {
    src: "assets/css/style.scss",
    dest: "dist/css",
  },
  css: {
    vendors: {
      list: [
        "node_modules/bootstrap/dist/css/bootstrap.min.css",
        "node_modules/toastify-js/src/toastify.css",
        "node_modules/@fancyapps/ui/dist/fancybox/fancybox.css",
        "node_modules/owl.carousel/dist/assets/owl.carousel.css",
        "node_modules/@fortawesome/fontawesome-free/css/fontawesome.min.css",
      ],
      dest: "dist/css",
      filename: "vendors.min.css",
    },
  },
  js: {
    vendors: {
      list: [
        "node_modules/jquery/dist/jquery.min.js",
        "node_modules/owl.carousel/dist/owl.carousel.min.js",
        "node_modules/toastify-js/src/toastify.js",
        "node_modules/bootstrap/dist/js/bootstrap.js",
        "node_modules/@fortawesome/fontawesome-free/js/all.min.js",
        "node_modules/@fancyapps/ui/dist/fancybox/fancybox.umd.js",
      ],
      dest: "dist/js",
      filename: "vendors.min.js",
    },
    main: {
      src: "assets/js/script.js",
      dest: "dist/js",
      filename: "script.min.js",
    },
  },
  img: {
    src: "assets/img/**/*",
    dest: "dist/img",
  },
};

const sassTask = () =>
  src(paths.sass.src)
    .pipe(sassWithCompiler({ outputStyle: "compressed" }))
    .on("error", (err) => {
      console.error("Sass Error:", err.message);
      this.emit("end");
    })
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(dest(paths.sass.dest));

const cssVendorTask = () => src(paths.css.vendors.list).pipe(concat(paths.css.vendors.filename)).pipe(cleanCSS()).pipe(dest(paths.css.vendors.dest));

const vendorScriptsTask = () => src(paths.js.vendors.list).pipe(concat(paths.js.vendors.filename)).pipe(uglify()).pipe(dest(paths.js.vendors.dest));

const mainScriptTask = () => src(paths.js.main.src).pipe(concat(paths.js.main.filename)).pipe(uglify()).pipe(dest(paths.js.main.dest));

const imageOptimization = () =>
  src(paths.img.src, { encoding: false })
    .pipe(
      imagemin(
        [
          imageminOptipng({
            optimizationLevel: 1,
          }),
        ],
        {
          verbose: true,
        }
      )
    )
    .pipe(dest(paths.img.dest));

const watchFiles = () => {
  watch("assets/css/**/*.scss", sassTask);
  watch("assets/js/**/*.js", mainScriptTask);
};

const watchTasks = series(sassTask, cssVendorTask, vendorScriptsTask, mainScriptTask, imageOptimization);

export default parallel(watchTasks, watchFiles);
