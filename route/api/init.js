'use strict';

const
    express = require( 'express' ),
    router = express.Router(),
    
    model = new ( require( './../../model/model' ) ),
    ng = new ( require( './../../libs/ng' ) ),
    refreshDatas = async () => {
        let
            rCities = await ( async () => {
                try {
                    return await ng.getCities();
                } catch ( err ) {
                    return [ 789 ];
                }
            })();
        /*cities.forEach( c => {
            if ( !rCities[ c.key ] ) {
                model.cities().update( { used: false }, { key: c.key } );
            }
        });*/
        console.log( 'cities:', rCities );
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