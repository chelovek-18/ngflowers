'use strict';

const
    express = require( 'express' ),
    router = express.Router();

// ------------------------------------- Админка -------------------------------------
router.use( ( req, res, next ) => {
    res.pageSettings = {
        main: global.appConf.roles[ req.session.role ].main,
        menu: global.appConf.location.pages,
        roles: global.appConf.roles,
        dbWorked: !req.db.error
    }

    next();
});

router.post( '/settings/db/update/', ( req, res, next ) => {
    res.send( 'В данный момент эта опция заблокирована в связи с проводимыми работами' );
});

router.use( ( req, res, next ) => {
    if ( !!req.db.error ) {
        res.pageSettings.page = 'settings';
        res.pageSettings.db = global.appConf.mongodb;
        res.render( 'partials/page', res.pageSettings );
    }

    else next();
});

router.use( '/', ( req, res, next ) => {
    if ( req.url == '/' || req.url == '' )
        req.url = '/' + res.pageSettings.main + '/';

    next();
});

Object.keys( global.appConf.location.pages ).forEach( p => router.use( `/${ p }/`, require( `./${ p }` ) ) );

/*router.get( '/params/cities', function( req, res, next ) {
    let cities = [ 'spb', 'msk' ];
    res.json( cities );
});*/

module.exports = router;