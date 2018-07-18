'use strict';

const
    express = require( 'express' ),
    router = express.Router(),
    ng = new ( require( './../../libs/ng' ) ),
    geo = new ( require( './../../libs/geo' ) );

// ------------------------------------- API -------------------------------------
router.get( '/cities/', ( req, res, next ) => {
    res.json(
        req.cities
            .filter( c => c.use )
            .map( c => { return { key: c.key, name: c.name, link: c.link, location: c.location, banners: c.banners }; } )
    );
});

router.get( '/products/:city', async ( req, res, next ) => {
    res.json( await ng.getProducts( req.params.city ) );
});

/*router.get( '/citiesgeo/', async ( req, res, next ) => {
    res.json( ( await geo.getCoords() ).results[ 0 ].geometry.location );
});*/

/*router.get( '/city/:city', async ( req, res, next ) => {
    res.json( ( await req.cities ).filter( c => c.key == req.params.city )[ 0 ] );
});

router.put( '/city/:city', async ( req, res, next ) => {
    req.body.use = req.body.use == 'true';
    let answ = await req.db.cities().update( /*req.body*-/ { use: false }, { key: 'spb' /*req.params.city*-/ } ).exec();
    req.citiesRefresh();
    console.log( await req.db.cities().find() );
    res.send( answ );
});*/

module.exports = router;