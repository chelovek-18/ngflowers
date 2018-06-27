'use strict';

let
    page = '',
    roles = [];

let obj = {
    math: function( a, op, b ) {
        if ( !!~'==!='.indexOf( op ) ) return eval( '"' + a + '"' + ( op ? op : '+' ) + '"' + b + '"' );
        if ( !!~'+-*/'.indexOf( op ) ) return eval( a + op + b );
    },

    setPage( pageName ) {
        page = pageName;
    },

    setRoles( croles ) {
        roles = croles;
    },

    changePage( pageName ) {
        return pageName == page;
    },

    getRoleSelect( role ) {
        let getOptions = () => Object.keys( roles ).map( r => `<option${ r == role ? ' checked="checked"' : '' }>${ roles[ r ].name }</option>` ).join( '' );
        return `<select name="role">${ getOptions() }</select>`;
    },

    getTr() {
        return `<td><input type="text" name="name" /></td>
        <td><input type="text" name="login" /></td>
        <td><input type="password" name="password" /></td>
        <td>${ obj.getRoleSelect() }</td>
        <td><img onClick="this.parentNode.parentNode.style.display = 'none';" class="del-tr" src="/img/red-cross.png" /></td>`;
    }
}

module.exports = obj;