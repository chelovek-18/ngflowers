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

router.post( '/users/', async ( req, res, next ) => {
    let users = req.body;
    users = Object.keys( users ).reduce( ( o, k ) => {
        let kk = k.split( ':' );
        if ( !o[ kk[ 0 ] ] ) o[ kk[ 0 ] ] = { _id: kk[ 0 ] };
        o[ kk[ 0 ] ][ kk[ 1 ] ] = users[ k ];
        return o;
    }, {});
    for( let id in users ) {
        if ( users[ id ].password ) {
            users[ id ].salt = ( await req.db.users().findOne( { _id: id } ) ).salt;
            users[ id ].hashedPassword = req.db.users().hashing( req.db, users[ id ] );
        }
        delete users[ id ].password;
        req.db.users().update( { _id: id }, users[ id ] );
    }
    res.redirect( '/settings/' );
});

router.put( '/users/', async ( req, res, next ) => {
    let loginnum = 0;
    do { loginnum++; } while( await req.db.users().findOne( { login: 'user' + loginnum } ) );
    res.json( await req.db.users().create( { salt: Math.random() + '', login: 'user' + loginnum, password: 'user' + loginnum } ) );
});

/*router.get( '/params/cities', function( req, res, next ) {
    let cities = [ 'spb', 'msk' ];
    res.json( cities );
});*/

module.exports = router;