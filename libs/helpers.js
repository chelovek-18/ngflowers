'use strict';

let
    page = '',
    roles = [];

module.exports = {
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
        let getOptions = () => Object.keys( roles ).map( r => `<option${ r == 'admin' ? ' checked="checked"' : '' }>${ roles[ r ].name }</option>` ).join( '' );
        return `<select name="role">${ getOptions() }</select>`;
    },

    getTr() {
        return `<td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td>`;
    }
}