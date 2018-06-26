'use strict';

const
    express = require( 'express' ),
    router = express.Router();

// ------------------------------------- Админка -------------------------------------
router.use( ( req, res, next ) => {
    res.pageSettings = {
        main: global.appConf.roles[ req.session.role ].main,
        menu: global.appConf.location.pages,
        math( a, op, b ) {
            if ( !!~'==!='.indexOf( op ) ) return eval( '"' + a + '"' + ( op ? op : '+' ) + '"' + b + '"' );
            if ( !!~'+-*/'.indexOf( op ) ) return eval( a + op + b );
        }
    }

    next();
});

router.use( '/', ( req, res, next ) => {
    req.url += res.pageSettings.main;

    next();
});

router.use( '/settings/', require( './settings' ) );

/*router.get( '/params/cities', function( req, res, next ) {
    let cities = [ 'spb', 'msk' ];
    res.json( cities );
});*/

module.exports = router;