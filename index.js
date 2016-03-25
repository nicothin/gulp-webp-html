const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const through = require('through2');

const pluginName = 'gulp-webp-css';

module.exports = function(extensions){
    var extensions = extensions || ['.jpg','.png','.jpeg','JPG'];
    return through.obj(function(file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(new PluginError(pluginName, 'Streaming not supported'));
            return;
        }

        try {
            var pictureRender = function (url, imgTag) {
                return '<picture><source srcset="' + url + '" type="image/webp">' + imgTag + '</picture>';
            }

            var inPicture = false;


            const data = file.contents.toString()
                    .split('\n')
                    .map(function(line){
                        // Вне <picture/>?
                        if (line.indexOf('<picture') + 1) inPicture = true;
                        if (line.indexOf('</picture') + 1) inPicture = false;

                        // Проверяем есть ли <img/>
                        if((line.indexOf('<img') + 1) && !inPicture){
                            // Новый урл с .webp
                            var Re = /<img([^>]*)src=\"(\S+)\"([^>]*)>/ig;
                            var regexpArray = Re.exec(line);
                            var imgTag = regexpArray[0];
                            var newUrl = regexpArray[2];
                            // Если в урле есть .webp, пропускаем
                            if (newUrl.indexOf('.webp') + 1) return line;
                            // Заменяем все расширения на .webp
                            for(k in extensions){
                                newUrl = newUrl.replace(extensions[k],'.webp')
                            }
                            // Компилим <picture/>
                            var newHTML = pictureRender(newUrl,imgTag);
                            return line.replace(imgTag,newHTML);
                        }
                        return line;
                    })
                    .join('');
            file.contents = new Buffer(data);
            this.push(file);
        } catch (err) {
            this.emit('error', new PluginError(pluginName, err));
        }

        cb();
    });
};