'use strict';

const
    express = require( 'express' ),
    router = express.Router();

// ------------------------------------- Настройки -------------------------------------
router.use( async ( req, res, next ) => {
    res.pageSettings.page = 'pages';
    res.pageSettings.cities = await req.db.cities().find();
    if ( !req.access() ) throw 401;

    next();
});

router.get( '/', ( req, res, next ) => {
    res.render( 'partials/page', res.pageSettings );
});

router.post( '/cities/', async ( req, res, next ) => {
    res.json( await ( req.cities = req.cities.map( c => { if ( c.key == req.body.key ) { Object.assign( c, req.body ); } return c; } ) ) );
    //res.json( await req.db.cities().update( { key: req.body.key }, req.body ) );
});

router.post( '/banners/', async ( req, res, next ) => {
    res.json(
        await ( req.cities = req.cities.map( c => {
            if ( c.key == req.body.key )
                c.banners.forEach( b => {
                    if ( b.id == req.body.id ) b = Object.assign( b, req.body );
                });
            return c;
        }))
    );
});

router.post( '/categories/', async ( req, res, next ) => {
    res.json(
        await ( req.cities = req.cities.map( c => {
            if ( c.key == req.body.key )
                c.categories.forEach( b => {
                    if ( b.id == req.body.id ) b = Object.assign( b, req.body );
                });
            return c;
        }))
    );
});

router.post( '/products/', async ( req, res, next ) => {
    res.json(
        await ( req.cities = req.cities.map( c => {
            if ( c.key == req.body.key )
                c.products.forEach( b => {
                    if ( b.id == req.body.id ) b = Object.assign( b, req.body );
                });
            return c;
        }))
    );
});

module.exports = router;