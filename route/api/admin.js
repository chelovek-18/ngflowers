'use strict';

const
    express = require( 'express' ),
    router = express.Router();

// ------------------------------------- Админка -------------------------------------
router.use( ( req, res, next ) => {
    req.pageSettings = pagename => {
        return {
            page: pagename
        }
    }
});

router.use( '/', require( './admin0/settings' ) );

router.use( '/settings/', require( './admin0/settings' ) );

/*router.get( '/', ( req, res, next ) => {
    res.render( 'partials/page', req.pageSettings( 'settings' ) );
});*/

/*router.get( '/params/cities', function( req, res, next ) {
    let cities = [ 'spb', 'msk' ];
    res.json( cities );
});*/

module.exports = router;