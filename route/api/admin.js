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

router.use( '/', require( './admin/settings' ) );

router.use( '/settings/', require( './admin/settings' ) );

/*router.get( '/', ( req, res, next ) => {
    res.render( 'partials/page', req.pageSettings( 'settings' ) );
});*/

/*router.get( '/params/cities', function( req, res, next ) {
    let cities = [ 'spb', 'msk' ];
    res.json( cities );
});*/

module.exports = router;