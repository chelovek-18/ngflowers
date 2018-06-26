'use strict';

const
    express = require( 'express' ),
    router = express.Router();

// ------------------------------------- Настройки -------------------------------------
router.use( ( req, res, next ) => {
    //res.pageSettings.page = 'settings';
    //res.pageSettings.menu = res.pageSettings.menu.map( m => { if ( m.key == res.pageSettings.page ) m.actived = true; return m; });
    if ( !req.access() ) throw 401;

    next();
});


router.get( '/', ( req, res, next ) => {
    //res.send( res.pageSettings );
    res.render( 'partials/page', res.pageSettings );
});

/*router.get( '/params/cities', function( req, res, next ) {
    let cities = [ 'spb', 'msk' ];
    res.json( cities );
});*/

module.exports = router;