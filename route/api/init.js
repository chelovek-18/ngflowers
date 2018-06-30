'use strict';

const
    express = require( 'express' ),
    router = express.Router(),
    
    model = new ( require( './../../model/model' ) ),
    ng = new ( require( './../../libs/ng' ) ),
    refreshDatas = async () => {
        let
            rCities = await ng.getCities();
        cities.forEach( c => {
            if ( !rCities[ c.key ] ) {
                model.cities().update( { used: false }, { key: c.key } );
            }
        });
        console.log( 'cities:', cities );
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