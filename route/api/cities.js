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
    req.body.use = req.body.use == 'true';
    let answ = await req.db.cities().update( /*req.body*/ { use: false }, { key: 'spb' /*req.params.city*/ } ).exec();
    req.citiesRefresh();
    console.log( await req.db.cities().find() );
    res.send( answ );
});

module.exports = router;