let obj = {
    lang: 'ru',
    prototypes: ( function() {
        String.prototype.t = function() {
            return obj.lang;
        }
    })()
}

module.export = obj;