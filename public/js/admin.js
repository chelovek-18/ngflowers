document.addEventListener( "DOMContentLoaded", function() {
    document.querySelectorAll( '.use-switcher' ).forEach( e => e.onclick = function() {
        this.classList.toggle( 'use-true' );
        this.classList.toggle( 'use-false' );
        if ( this.classList.contains( 'use-true' ) ) {
        } else {
        }
    });
});