'use strict';

const
    express = require( 'express' ),
    router = express.Router();

// ------------------------------------- Авторизация -------------------------------------
router.use( ( req, res, next ) => {
    if ( !req.session.cookie.user ) {
        if (
            req.body.login
            && req.body.login == 'admin'
        ) {
            req.session.cookie.user = req.body.login;
            res.redirect( '/' );
        } else res.render( 'partials/login' );
    }

    else next();
});

router.get( '/logout/', ( req, res, next ) => {
    req.session.destroy();
    throw 401;
});

module.exports = router;