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
    }
}