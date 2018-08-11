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
                main: c.main,
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

router.get( '/prd/', async ( req, res, next ) => {
    res.json( await ng.getProducts() );
});

router.get( '/bnr/', async ( req, res, next ) => {
    res.json( await ng.getBanners() );
});

module.exports = router;