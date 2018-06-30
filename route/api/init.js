'use strict';

const
    express = require( 'express' ),
    router = express.Router(),
    
    model = new ( require( './../../model/model' ) ),
    ng = new ( require( './../../libs/ng' ) ),
    refreshDatas = async () => {
        let
            rCities = await ng.getCities();
        if ( Object.keys( rCities ).length ) {
            cities = cities.map( c => {
                if ( !rCities[ c.key ] ) {
                    model.cities().update( { use: false }, { key: c.key } );
                }
                return c;
            }).filter( c => rCities[ c.key ] );
            let keys = cities.map( c => c.key );
            cities = cities.concat(
                Object.keys( rCities )
                    .filter( k => !~keys.indexOf( k ) )
                    .map( k => { return {
                        key: k,
                        name: rCities[ k ].name,
                        link: rCities[ k ].link,
                        siteId: rCities[ k ].site_id
                    }; })
            );
        }
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