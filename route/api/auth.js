'use strict';

const
    express = require( 'express' ),
    router = express.Router();

// ------------------------------------- Авторизация -------------------------------------
router.use( ( req, res, next ) => {
    let gemors = req.session.user + ' <-> ' + JSON.stringify( req.session ) + ' <-> ';
    if ( !req.session.user ) {
        if (
            req.body.login
            && req.body.login == 'admin'
        ) {
            req.session.user = req.body.login;
            gemors = req.session.user + ' <-> ' + JSON.stringify( req.session ) + ' <-> ';
            res.send( gemors );
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