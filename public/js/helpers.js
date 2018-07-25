var Ajax = function() {
    var self = this;
    this.method = 'GET';
    this._data = {};
    [ 'get', 'post', 'put', 'delete' ].forEach( function( m ) {
        self[ m ] = function() {
            self.method = m.toUpperCase();
            return self;
        }
    });
    [ 'data', 'path' ].forEach( function( m ) {
        self[ m ] = function( data ) {
            self[ '_' + m ] = data;
            return self;
        }
    });
    this.send = function() {
        var xhr = new XMLHttpRequest();
        xhr.open(
            self.method,
            location.origin + self._path,
            true
        );
        xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
        xhr.send( dataSerialize( self._data ) );
        return new Promise( function( r, j ) {
            xhr.onreadystatechange = function() {
                if ( xhr.readyState != 4 ) return;

                if ( xhr.status != 200 ) {
                    j( xhr );
                } else r( xhr );
            }
        });
    }
}
var dataSerialize = function( obj ) { return Object.keys( obj ).map( k => k + '=' + obj[ k ] ).join( '&' ); };