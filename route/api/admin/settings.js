'use strict';

const
    express = require( 'express' ),
    router = express.Router();

// ------------------------------------- Настройки -------------------------------------
router.get( ( req, res, next ) => {
    res.send( 'xxxz' );
    //res.render( 'partials/page', req.pageSettings( 'settings' ) );
});

/*router.get( '/params/cities', function( req, res, next ) {
    let cities = [ 'spb', 'msk' ];
    res.json( cities );
});*/

module.exports = router;