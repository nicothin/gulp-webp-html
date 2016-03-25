# gulp-webp-html

## Example
```html
// Input
<img src="/img/tmp/catalogImage.jpg">

// Output
<picture>
    <source srcset="/img/tmp/catalogImage.webp" type="image/webp">
    <img src="/img/tmp/catalogImage.jpg">
</picture>
```
## Install
```bash
npm i --save-dev gulp-webp-html
```
## Usage
```javascript
var webpHTML = require('gulp-webp-html');

gulp.task('html',function(){
    gulp.src('./assets/**/*.html')
        .pipe(webpHTML())
        .pipe(gulp.dest('./public/'))
});
```
