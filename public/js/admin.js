function addUser( elm, newtr ) {
    ( new Ajax ).post().path( '/settings/users/create/' ).send().then( function( r ) {
        var tr = document.createElement( 'tr' );
        tr.innerHTML = newtr.replace( /%%_id%%/g, JSON.parse( r.responseText )._id );
        elm.parentNode.parentNode.parentNode.insertBefore( tr, elm.parentNode.parentNode );
    }).catch( function( e ) { alert( 'Error ' + e.status + ':' + e.statusText ); } );

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