'use strict';

const
    express = require( 'express' ),
    router = express.Router(),
    reqs = { settings: require( './settings' ) },
    pages = Object.keys( global.appConf.location.pages ).reduce( ( o, p ) => {
        o[ p ] = require( `./${ p }` );
        return o;
    }, {});

let
    mainPage = 'admin';

// ------------------------------------- Админка -------------------------------------
router.use( ( req, res, next ) => {
    res.pageSettings = {
        main: global.appConf.roles[ req.session.role ].main
    }
    //mainPage = 'settings'; //res.pageSettings.main;

    next();
});

//router.use( '/', require( './' + res.pageSettings.main ) );
router.use( '/', reqs[ mainPage ] );

router.use( '/settings/', require( './settings' ) );

/*router.get( '/params/cities', function( req, res, next ) {
    let cities = [ 'spb', 'msk' ];
    res.json( cities );
});*/

module.exports = router;