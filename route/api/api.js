'use strict';

const
    express = require( 'express' ),
    ng = new ( require( './../../libs/ng' ) ),
    router = express.Router();

// ------------------------------------- API -------------------------------------
router.get( '/cities/', ( req, res, next ) => {
    global.log( 'version?..' );
    global.log( 'version?', req.session.appVersion );
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
            .map( b => { return { id: b.id, link: b.link, image: b.image, use: b.use }; } )
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

// Получить товары для города
router.get( '/products/:city', ( req, res, next ) => {
    let ckeys = { 'СПб': 'spb', 'HCK': 'novosib', 'HH': 'nn', 'MCK': 'msk' }
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
                main: Object.keys( c.main ).reduce( ( o, k ) => {
                    global.log( '??', k );
                    o[ k ] = c.main[ k ].map( ( c, i ) => ckeys[ c ] || c.main[ k ][ i ] )
                    return o;
                }, {}),
                groups: c.groups
            }; })
    );
});

// Получить настройки приложения
router.get( '/app-settings/:version', async ( req, res, next ) => {
    global.log( 'Запрос: получение настроек приложения' );
    req.session.appVersion = req.params.version;
    let settings = await req.db.settings().findOne( { version: req.session.appVersion } );
    settings.isCurrent = settings.version == await global.obj.getMaxVers();
    res.json( settings );
});

router.get( '/del/', async ( req, res, next ) => {
    res.json( await req.db.cities().delete() );
});

router.get( '/pr/', async ( req, res, next ) => {
    res.json( await ng.getProducts( 'spb' ) );
});

router.get( '/ba/', async ( req, res, next ) => {
    res.json( await ng.getBanners( 'spb' ) );
});

router.get( '/ca/', async ( req, res, next ) => {
    res.json( await ng.getSections( 'spb' ) );
});

router.get( '/ci/', async ( req, res, next ) => {
    res.json( await ng.getCities() );
});

module.exports = router;