'use strict';

let
    sett = '';

module.exports = {
    math: function( a, op, b ) {
        if ( !!~'==!='.indexOf( op ) ) return eval( '"' + a + '"' + ( op ? op : '+' ) + '"' + b + '"' );
        if ( !!~'+-*/'.indexOf( op ) ) return eval( a + op + b );
    },

    setSettings( settings ) {
        sett = settings;
    },

    changePage( pageName ) {
        return pageName == sett; //this.renderSetngs;
    }
}