'use strict';

const
    express = require( 'express' ),
    router = express.Router();

// ------------------------------------- API: города -------------------------------------
router.get( '/city/', ( req, res, next ) => {
    console.log( Object.keys( req.api ).join( '###' ) );
    res.send( req.api.cities );
});

router.get( '/city/:city', ( req, res, next ) => {
    res.send( 'Maza-faka-city-' + req.params.city );
});

module.exports = router;