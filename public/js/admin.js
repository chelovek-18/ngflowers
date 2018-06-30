document.addEventListener( "DOMContentLoaded", function() {
    var dataSerialize = function( obj ) { return Object.keys( obj ).map( k => k + '=' + obj[ k ] ).join( '&' ); };

    document.querySelectorAll( '.use-switcher' ).forEach( e => e.onclick = function() {
        this.classList.toggle( 'use-true' );
        this.classList.toggle( 'use-false' );
        var xhr = new XMLHttpRequest();
        xhr.open( 'POST', location.origin + '/' + this.getAttribute( 'type' ) + '/' + this.getAttribute( 'key' ) );
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send( dataSerialize( { use: this.classList.contains( 'use-true' ) } ) );
    });
});