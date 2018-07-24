'use strict';

const
    express = require( 'express' ),
    router = express.Router(),
    ng = new ( require( './../../libs/ng' ) ),
    geo = new ( require( './../../libs/geo' ) ),
    https = require( 'https' ),
    fs = require( 'fs' ),
    //gm = require( 'gm' ),
    jimp = require( 'jimp' ),
    //images = require( 'images' ),
    url = require( 'url' );
    //images = new( require( './../../libs/images' ) );

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
    jimp.read( `${ global.appConf.location.root }/public/prob.jpg` ).then( function ( img ) {
        return img.resize( 50 ).write( `${ global.appConf.location.root }/public/prob.jpg` );
    }).catch( function( err ) {
        console.loe( 'erro!', err );
    });

    /*await gm( `${ global.appConf.location.root }/public/prob.jpg` )
        .resize( 50 )
        .stream()
        .pipe( fs.createWriteStream( `${ global.appConf.location.root }/public/prob.jpg` ) );

    res.send( 'hu!' );*/

    /*images( `${ global.appConf.location.root }/public/prob.jpg` )
        .resize( 300 )
        .encode( "png" )
        .save( `${ global.appConf.location.root }/public/prob.png` );
    //});
        /*.stream( ( err, stdout, stderr ) => {
            // `${ global.appConf.location.root }/public/prob.jpg`
            let writeStream = fs.createWriteStream( `${ global.appConf.location.root }/public/prob.jpg` );
            stdout.pipe( writeStream );
            //if ( err ) res.send( err );
            //else res.send( 'resized!' );
        });*/

    // 1!..
    /*let imgsource = 'https://novayagollandiya.ru/upload/iblock/c65/c657526991c0ab9cfd65fb1edcb843ba.jpg';
    https.get( imgsource, function( resp ) {
        resp.pipe( fs.createWriteStream( `${ global.appConf.location.root }/public/prob.jpg` ) );
        res.send( 'oke' );
    });*/

    //res.end( fs.readFileSync( 'https://novayagollandiya.ru/upload/iblock/c65/c657526991c0ab9cfd65fb1edcb843ba.jpg' ) );
    //res.end( fs.readFileSync( await images.getImage( 'novayagollandiya.ru', '/upload/iblock/c65/c657526991c0ab9cfd65fb1edcb843ba.jpg' ) ) );



    //fs.writeFileSync( `${ global.appConf.location.root }/public/prob.jpg`, fs.readFileSync( 'https://novayagollandiya.ru/upload/iblock/c65/c657526991c0ab9cfd65fb1edcb843ba.jpg' ) );
    //res.send( fs.readFileSync( `${ global.appConf.location.root }/public/prob.jpg` ) );
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