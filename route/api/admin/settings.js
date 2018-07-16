'use strict';

const
    express = require( 'express' ),
    router = express.Router();

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

router.post( '/users/update/', async ( req, res, next ) => {
    //res.send( await ng.getCities() );
    res.send( 'В данный момент эта опция заблокирована в связи с проводимыми работами' );
});

router.post( '/users/create/', async ( req, res, next ) => {
    //res.send( await ng.getCities() );
    //res.json( await req.db.users().create( { salt: Math.random() + '', login: 'aaa' } ) );
    res.json( { _id: 777 } );
});

/*router.get( '/params/cities', function( req, res, next ) {
    let cities = [ 'spb', 'msk' ];
    res.json( cities );
});*/

module.exports = router;