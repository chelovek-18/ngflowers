'use strict';

const
    express = require( 'express' ),
    router = express.Router();

// ------------------------------------- Админка -------------------------------------
/*router.use( ( req, res, next ) => {
    req.pageSettings = pagename => {
        return {
            page: pagename
        }
    }
});*/

//router.get( '/', ( req, res, next ) => {
    //res.send( 'WTF?????' );
    //res.render( 'partials/page', req.pageSettings( 'settings' ) );
//});
router.use( '/', require( './settings' ) );

router.use( '/settings/', require( './settings' ) );

/*router.get( '/', ( req, res, next ) => {
    res.render( 'partials/page', req.pageSettings( 'settings' ) );
});*/

/*router.get( '/params/cities', function( req, res, next ) {
    let cities = [ 'spb', 'msk' ];
    res.json( cities );
});*/

module.exports = router;