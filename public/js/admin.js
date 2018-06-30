document.querySelectorAll( '.use-switcher' ).forEach( e => e.onclick = function() {
    if ( this.classList.contains( 'use-true' ) )
        this.classList.remove( 'use-true' ).add( 'use-false' );
});