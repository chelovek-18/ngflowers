'use strict';

const
    express = require( 'express' ),
    router = express.Router();

// ------------------------------------- Города -------------------------------------
router.get( '/params/cities', async ( function*( req, res, next ) {
    let cities = [ 'spb', 'msk' ];
    res.json( cities );
}));

module.exports = router;