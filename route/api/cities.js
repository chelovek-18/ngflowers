'use strict';

const
    express = require( 'express' ),
    router = express.Router();

// ------------------------------------- API: города -------------------------------------
router.get( '/city/:city', ( req, res, next ) => {
    if ( !req.params.city )
        res.send( req.cities );
    else {
        res.send( 'Maza-faka-city' );
    }
});

module.exports = router;