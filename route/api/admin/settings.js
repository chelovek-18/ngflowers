'use strict';

const
    express = require( 'express' ),
    router = express.Router();

// ------------------------------------- Настройки -------------------------------------
router.use( async ( req, res, next ) => {
    res.pageSettings.page = 'settings';
    res.pageSettings.db = global.appConf.mongodb;
    res.pageSettings.users = await req.db.users().find();
    res.pageSettings.settings = await req.db.settings().findOne();
    if ( !req.access() ) throw 401;

    next();
});

router.get( '/', ( req, res, next ) => {
    res.render( 'partials/page', res.pageSettings );
});

// Удаление пользователя
router.delete( '/users/', async ( req, res, next ) => {
    res.json( await req.db.users().delete( { _id: req.db.id( req.body.id ) } ) );
});

// Изменение настроек приложения
router.post( '/settings/', async ( req, res, next ) => {
    if ( ! ( await req.db.settings().findOne() ) ) await req.db.settings().save( { version: '1.0.0' } );
    await req.db.settings().update( {}, req.body );
    res.redirect( '/settings/' );
});

// Изменение пользователей
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
            users[ id ].hashedPassword = req.db.users().hashing( users[ id ] );
        }
        delete users[ id ].password;
        delete users[ id ]._id;
        await req.db.users().update( { _id: req.db.id( id ) }, users[ id ] );
    }
    res.redirect( '/settings/' );
});

// Создание пользователя
router.put( '/users/', async ( req, res, next ) => {
    let loginnum = 0;
    do { loginnum++; } while( await req.db.users().findOne( { login: 'user' + loginnum } ) );
    res.json( await req.db.users().create( { salt: Math.random() + '', login: 'user' + loginnum, password: 'user' + loginnum } ) );
});

module.exports = router;