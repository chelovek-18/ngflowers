'use strict';

const
    express = require( 'express' ),
    router = express.Router();

// ------------------------------------- API: города -------------------------------------
router.get( '/city/', async ( req, res, next ) => {
    res.json( await req.cities );
});

router.get( '/city/:city', async ( req, res, next ) => {
    res.json( ( await req.cities ).filter( c => c.key == req.params.city )[ 0 ] );
});

router.put( '/city/:city', async ( req, res, next ) => {
    let answ = await req.db.cities().update( req.body, { key: req.params.city } );
    res.send( answ );
});

module.exports = router;