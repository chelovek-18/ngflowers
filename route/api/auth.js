'use strict';

const
    express = require( 'express' ),
    router = express.Router();

// ------------------------------------- Авторизация -------------------------------------
router.use( ( req, res, next ) => {
    if ( !req.session.user ) {
        if (
            req.body.login
            && req.body.login == 'admin'
        ) {
            req.session.user = req.body.login;
            res.send( JSON.stringify( req.session ) + '-' + req.session.user );
            //res.redirect( '/' );
        } else res.render( 'partials/login' );
    }

    else next();
});

router.get( '/logout/', ( req, res, next ) => {
    req.session.destroy();
    throw 401;
});

module.exports = router;