'use strict';

module.exports = {
    math: function( a, op, b ) {
        if ( !!~'==!='.indexOf( op ) ) return eval( '"' + a + '"' + ( op ? op : '+' ) + '"' + b + '"' );
        if ( !!~'+-*/'.indexOf( op ) ) return eval( a + op + b );
    },

    setSettings( settings ) {
        this.renderSetngs = 'settings'; //settings;
    },

    changePage( pageName ) {
        this.renderSetngs = 'settings';
        return pageName == this.renderSetngs;
    }
}