'use strict';

const
    express = require( 'express' ),
    router = express.Router();

// ------------------------------------- Настройки -------------------------------------
router.use( ( req, res, next ) => {
    res.pageSettings.page = 'settings';
    if ( !req.access() ) throw 401;

    next();
});


router.get( '/', ( req, res, next ) => {
    res.send( 'mumu' );
    //res.render( 'partials/page', res.pageSettings( 'settings' ) );
});

/*router.get( '/params/cities', function( req, res, next ) {
    let cities = [ 'spb', 'msk' ];
    res.json( cities );
});*/

module.exports = router;