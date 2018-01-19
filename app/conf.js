module.export = {
    lang: 'ru',
    prototypes: ( function() {
        let lang = this.lang;
        String.prototype.t = function() {
            return lang;
        }
    })()
}