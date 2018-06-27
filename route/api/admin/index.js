'use strict';

const
    express = require( 'express' ),
    router = express.Router();

// ------------------------------------- Админка -------------------------------------
router.use( ( req, res, next ) => {
    res.pageSettings = {
        main: global.appConf.roles[ req.session.role ].main,
        menu: global.appConf.location.pages
    }

    next();
});

router.use( '/', ( req, res, next ) => {
    req.url = '/' + res.pageSettings.main + '/';

    next();
});

Object.keys( global.appConf.location.pages ).forEach( p => router.use( `/${ p }/`, require( `./${ p }` ) ) );

/*router.get( '/params/cities', function( req, res, next ) {
    let cities = [ 'spb', 'msk' ];
    res.json( cities );
});*/

module.exports = router;