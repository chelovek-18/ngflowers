'use strict';

const
    express = require( 'express' ),
    router = express.Router(),
    ng = new ( require( './../../../libs/ng' ) );

// ------------------------------------- Настройки -------------------------------------
router.use( async ( req, res, next ) => {
    res.pageSettings.page = 'settings';
    res.pageSettings.db = global.appConf.mongodb;
    res.pageSettings.users = await req.db.users().find().exec();
    if ( !req.access() ) throw 401;

    next();
});


router.get( '/', ( req, res, next ) => {
    res.render( 'partials/page', res.pageSettings );
});

router.post( '/db/update/', ( req, res, next ) => {
    res.send( 'В данный момент эта опция заблокирована в связи с проводимыми работами' );
});

router.post( '/users/update/', async ( req, res, next ) => {
    res.send( await ng.getBanners() );
    //res.send( 'В данный момент эта опция заблокирована в связи с проводимыми работами' );
});

/*router.get( '/params/cities', function( req, res, next ) {
    let cities = [ 'spb', 'msk' ];
    res.json( cities );
});*/

module.exports = router;