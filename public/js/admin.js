// Добавить пользователя в таблицу
function addUser( elm, newtr ) {
    ( new Ajax ).put().path( '/settings/users/' ).send().then( function( r ) {
        var res = JSON.parse( r.responseText );
        var tr = document.createElement( 'tr' );
        tr.innerHTML = newtr.replace( /%%_id%%/g, res._id );
        elm.parentNode.parentNode.parentNode.insertBefore( tr, elm.parentNode.parentNode );
        document.querySelector( '[name="' + res._id + ':login"]' ).value = res.login;
    }).catch( function( e ) { alert( 'Error ' + e.status + ':' + e.statusText ); } );
}

// Удалить пользователя из таблицы
function delUser( elm, id ) {
    ( new Ajax ).delete().path( '/settings/users/' ).data( { id: id } ).send().then( function( r ) {
        elm.parentNode.parentNode.remove();
    }).catch( function( e ) { alert( 'Error ' + e.status + ':' + e.statusText ); } );
}

// Вкл/выкл город
function switchCity( elm, key ) {
    ( new Ajax ).post().path( '/pages/cities/' ).data( { key: key, use: elm.checked } ).send();
}

// Вкл/выкл баннер
function switchBanner( elm, id ) {
    var city = elm.parentNode.parentNode.parentNode.getAttribute( 'city' );
    console.log( 'Banner data:', city, id, elm.checked );
    ( new Ajax ).post().path( '/pages/banners/' ).data( { key: city, id: id, use: elm.checked } ).send();
}

// Открыть блок редактирования баннеров, категорий, товаров города
function openProps( elm ) {
    if ( elm.parentNode.querySelector( '.propmenu' ).style.height == '1px' ) {
        elm.parentNode.querySelector( '.propmenu' ).style.height = '90px';
        setTimeout( function() {
            elm.parentNode.querySelector( '.propmenu' ).style.height = 'inherit';
        }, 700);
    } else
        elm.parentNode.querySelector( '.propmenu' ).style.height = '1px';
}

// Открыть список элементов списка баннеров, категорий или товаров
function openPropsSub( elm ) {
    elm.querySelector( '.arrowprop' ).classList.toggle( 'arrowpropact' );
    if ( elm.parentNode.querySelector( '.propmenusub' ).style.display == 'none' ) {
        elm.parentNode.querySelector( '.propmenusub' ).style.display = 'block';
    } else {
        elm.parentNode.querySelector( '.propmenusub' ).style.display = 'none';
    }
}

/*document.addEventListener( "DOMContentLoaded", function() {

    document.querySelectorAll( '.use-switcher' ).forEach( e => e.onclick = function() {
        this.classList.toggle( 'use-true' );
        this.classList.toggle( 'use-false' );
        var xhr = new XMLHttpRequest();
        xhr.open( 'PUT', location.origin + '/' + this.getAttribute( 'type' ) + '/' + this.getAttribute( 'key' ) );
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send( dataSerialize( { use: this.classList.contains( 'use-true' ) } ) );
    });

});*/