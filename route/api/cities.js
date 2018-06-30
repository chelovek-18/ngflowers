'use strict';

const
    express = require( 'express' ),
    router = express.Router();

// ------------------------------------- API: города -------------------------------------
router.get( '/city/', ( req, res, next ) => {
    res.json( req.cities );
});

router.get( '/city/:city', ( req, res, next ) => {
    res.send( 'Maza-faka-city-' + req.params.city );
});

module.exports = router;