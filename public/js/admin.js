document.addEventListener( "DOMContentLoaded", function() {
    document.querySelectorAll( '.use-switcher' ).forEach( e => e.onclick = function() {
        this.classList.toggle( 'use-true' );
        this.classList.toggle( 'use-false' );
        var xhr = new XMLHttpRequest();
        xhr.open( 'POST', location.origin + '/' + this.type + '/' + this.key );
        xhr.send( { use: this.classList.contains( 'use-true' ) } );
    });
});