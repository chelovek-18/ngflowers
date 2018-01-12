let
    obj = {
        lang: 'ru'
    }
    loc = require( './loc/localization.json' );

obj.prototypes = ( function() {
    String.prototype.t = function() {
        return ( loc[ obj.lang ] && loc[ obj.lang ][ this.toString() ] )
                    ? loc[ obj.lang ][ this.toString() ]
                    : this;
    }
})();

module.export = obj;