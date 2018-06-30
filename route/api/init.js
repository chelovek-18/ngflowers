'use strict';

const
    express = require( 'express' ),
    router = express.Router(),
    
    model = new ( require( './../../model/model' ) ),
    ng = new ( require( './../../libs/ng' ) ),
    refreshDatas = () => {
        console.log( 'rf!' );
        if ( cities.length < 3 ) cities.push( 7 );
        if ( cities.length == 2 ) mmm = x + d;
    };

let
    cities = [];

setInterval( refreshDatas, 5000 );

// ------------------------------------- Инициализация -------------------------------------
router.use( ( req, res, next ) => {
    req.db = model;

    next();
});

module.exports = router;