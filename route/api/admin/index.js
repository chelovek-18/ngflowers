'use strict';

const
    express = require( 'express' ),
    router = express.Router(),
    pages = Object.keys( global.appConf.location.pages ).reduce( ( o, p ) => {
        o[ p ] = require( `./${ p }` );
        return o;
    }, {});

// ------------------------------------- Админка -------------------------------------
router.use( ( req, res, next ) => {
    res.pageSettings = {
        main: global.appConf.roles[ req.session.role ].main
    }

    next();
});

//router.use( '/', require( './' + res.pageSettings.main ) );
router.use( '/', pages[ res.pageSettings.main ] );

router.use( '/settings/', require( './settings' ) );

/*router.get( '/params/cities', function( req, res, next ) {
    let cities = [ 'spb', 'msk' ];
    res.json( cities );
});*/

module.exports = router;