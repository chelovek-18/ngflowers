// Функционал
var Ajax = function() {
    var self = this;
    this.method = 'GET';
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

function addUser( elm, tr ) {
    ( new Ajax ).post().data( { u: 77 } ).path( '/users/create' ).send().then( function( r ) {
        console.log( r );
        alert( r );
    });
    //alert( ( new Ajax ).post().data( { u: 77 } ).path( '/users/create' ).send() );

    //var tr = document.createElement('tr'); tr.innerHTML = `{{getTr}}`; this.parentNode.parentNode.parentNode.insertBefore( tr, this.parentNode.parentNode );
}
document.addEventListener( "DOMContentLoaded", function() {

    document.querySelectorAll( '.use-switcher' ).forEach( e => e.onclick = function() {
        this.classList.toggle( 'use-true' );
        this.classList.toggle( 'use-false' );
        var xhr = new XMLHttpRequest();
        xhr.open( 'PUT', location.origin + '/' + this.getAttribute( 'type' ) + '/' + this.getAttribute( 'key' ) );
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send( dataSerialize( { use: this.classList.contains( 'use-true' ) } ) );
    });

});