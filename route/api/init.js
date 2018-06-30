'use strict';

const
    express = require( 'express' ),
    router = express.Router(),
    
    model = new ( require( './../../model/model' ) ),
    ng = new ( require( './../../libs/ng' ) );

let
    cities = [];

// ------------------------------------- Инициализация -------------------------------------
router.use( ( req, res, next ) => {
    req.db = model;

    next();
});

module.exports = router;