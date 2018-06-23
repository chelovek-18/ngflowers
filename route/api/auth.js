'use strict';

const
    express = require( 'express' ),
    router = express.Router();

// ------------------------------------- Авторизация -------------------------------------
router.use( async ( req, res, next ) => {
    console.log( 'db:', req.db.users().find().exec() );
    if ( !req.session.user ) {
        if (
            req.body.login
            && req.body.login == 'admin'
        ) {
            req.session.user = req.body.login;
            res.redirect( '/' );
        } else res.status( 401 ).render( 'partials/login' );
    }

    else next();
});

router.get( '/logout/', ( req, res, next ) => {
    req.session.destroy();
    throw 401;
});

module.exports = router;