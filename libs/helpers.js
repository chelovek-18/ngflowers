'use strict';

let
    page = '';

module.exports = {
    math: function( a, op, b ) {
        if ( !!~'==!='.indexOf( op ) ) return eval( '"' + a + '"' + ( op ? op : '+' ) + '"' + b + '"' );
        if ( !!~'+-*/'.indexOf( op ) ) return eval( a + op + b );
    },

    setPage( pageName ) {
        page = pageName;
    },

    changePage( pageName ) {
        return pageName == page;
    },

    getRoleSelect( roles, role ) {
        let getOptions = () => {
            Object.keys( roles ).map( r => `<option${ r == 'admin' ? 'checked="checked"' : '' }>${ roles[ r ].name }</option>` );
        }
        return `<select name="role">${ getOptions() }</select>`;
    }
}