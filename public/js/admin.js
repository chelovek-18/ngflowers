function addUser( elm, newtr ) {
    ( new Ajax ).put().path( '/settings/users/' ).send().then( function( r ) {
        var res = JSON.parse( r.responseText );
        var tr = document.createElement( 'tr' );
        tr.innerHTML = newtr.replace( /%%_id%%/g, res._id );
        elm.parentNode.parentNode.parentNode.insertBefore( tr, elm.parentNode.parentNode );
        document.querySelector( '[name="' + res._id + ':login"]' ).value = res.login;
    }).catch( function( e ) { alert( 'Error ' + e.status + ':' + e.statusText ); } );
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