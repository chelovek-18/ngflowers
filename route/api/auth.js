'use strict';

const
    express = require( 'express' ),
    router = express.Router();

// ------------------------------------- Авторизация -------------------------------------
router.use( async ( req, res, next ) => {
    // Если сессия еще не авторизована
    if ( !req.session.user ) {
        if ( !!req.db.error ) {
            // Если ошибка БД берем юзера из конфигов
            if (
                req.body.login == global.appConf.user.login
                && req.body.password == global.appConf.user.password
            ) {
                req.session.user = req.body.login;
                req.session.role = global.appConf.user.role;
                res.redirect( '/' );
            } else res.status( 401 ).render( 'partials/login' );
        } else if (
            req.body.login
            && await req.db.users().auth( req.body.login, req.body.password )
        ) {
            // Авторизация прошла
            req.session.user = req.body.login;
            req.session.role = ( await req.db.users().findOne( { login: req.body.login } ) ).role;
            res.redirect( '/' );
        } else res.status( 401 ).render( 'partials/login' );
    }

    else {
        // Проверка допуска к странице по роли
        req.access = () => ~global.appConf.location.pages[ res.pageSettings.page ].access.indexOf( req.session.role );

        next();
    }
});

router.get( '/logout/', ( req, res, next ) => {
    req.session.destroy();
    throw 401;
});

module.exports = router;