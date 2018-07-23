'use strict';

const
    express = require( 'express' ),
    router = express.Router(),
    ng = new ( require( './../../libs/ng' ) ),
    geo = new ( require( './../../libs/geo' ) ),
    fs = require( 'fs' ),
    images = new( require( './../../libs/images' ) );

// ------------------------------------- API -------------------------------------
router.get( '/cities/', ( req, res, next ) => {
    res.json(
        req.cities
            .filter( c => c.use )
            .map( c => { return { key: c.key, name: c.name, link: c.link, location: c.location }; } )
    );
});

router.get( '/banners/:city', ( req, res, next ) => {
    res.json(
        req.cities
            .filter( c => c.key == req.params.city )[ 0 ].banners
            .filter( b => b.use )
            .map( b => { return { id: b.id, link: b.link, image: b.image }; } )
    );
});

router.get( '/categories/:city', ( req, res, next ) => {
    res.json(
        req.cities
            .filter( c => c.key == req.params.city )[ 0 ].categories
            .filter( c => c.use )
            .map( c => { return { id: c.id, name: c.name, url: c.url, parent: c.parent }; } )
    );
});

router.get( '/products/:city', ( req, res, next ) => {
    res.json(
        req.cities
            .filter( c => c.key == req.params.city )[ 0 ].products
            .filter( c => c.use )
            .map( c => { return {
                id: c.id,
                name: c.name,
                url: c.url,
                price: c.price,
                oldPrice: c.oldPrice,
                image: c.image,
                mainImage: c.mainImage,
                sostav: c.sostav,
                youtube: c.youtube,
                description: c.description,
                offers: c.offers,
                qty: c.qty,
                groups: c.groups
            }; })
    );
});

router.get( '/app-settings/', async ( req, res, next ) => {
    res.json( await req.db.settings().findOne() );
});

router.get( '/rproducts/:city', async ( req, res, next ) => {
    res.json( await ng.getProducts( req.params.city ) );
});

router.get( '/rbanners/:city', async ( req, res, next ) => {
    res.json( await ng.getBanners( req.params.city ) );
});

router.get( '/imgs/', async ( req, res, next ) => {
    fs.writeFileSync( `${ global.appConf.location.root }/public/prob.jpg`, fs.readFileSync( new URL( 'https://novayagollandiya.ru/upload/iblock/c65/c657526991c0ab9cfd65fb1edcb843ba.jpg' ) ) );
    res.send( fs.readFileSync( `${ global.appConf.location.root }/public/prob.jpg` ) );
    //fs.writeFileSync( `${ global.appConf.location.root }/public/prob.jpg`, new Buffer( await images.getImage('novayagollandiya.ru', '/upload/iblock/c65/c657526991c0ab9cfd65fb1edcb843ba.jpg') ) );
    //res.send( fs.readFileSync( `${ global.appConf.location.root }/public/prob.jpg` ) );
    //res.send( await images.getImage('novayagollandiya.ru', '/upload/iblock/c65/c657526991c0ab9cfd65fb1edcb843ba.jpg') );
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