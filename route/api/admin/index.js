'use strict';

const
    express = require( 'express' ),
    router = express.Router(),
    
    fs = require( 'fs' );

// ------------------------------------- Админка -------------------------------------
router.use( ( req, res, next ) => {
    // Настройки для шаблонизатора
    res.pageSettings = {
        main: global.appConf.roles[ req.session.role ].main,
        menu: global.appConf.location.pages,
        roles: global.appConf.roles,
        dbWorked: !req.db.error
    }

    next();
});

// Обновление данных подключения БД
router.post( '/settings/db/update/', ( req, res, next ) => {
    let conf = require( './../../../config/config' );
    conf.mongodb.host = req.body.host;
    conf.mongodb.port = req.body.port;
    conf.mongodb.database = req.body.database;
    conf.mongodb.user = req.body.user;
    conf.mongodb.password = req.body.password;
    // Сохранение параметров подключения БД и перезапуск сервера
    fs.writeFileSync( global.appConf.location.root + '/config/config.json', JSON.stringify( conf ) );
    setTimeout( () => {
        process.exit();
    }, 1000);
    res.send( `
        <h1>Сервер перезапускается...</h1>
        <script>
            setTimeout( function() {
                location.href = location.origin;
            }, 2000);
        </script>
    ` );
});

// Вывод настроек БД при ошибке подключения БД
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