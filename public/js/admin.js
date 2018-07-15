function addUser( elm, tr ) {
    ( new Ajax ).post().path( '/settings/users/create/' ).send().then( function( r ) {
        console.log( r.responseText );
        alert( r.responseText );
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