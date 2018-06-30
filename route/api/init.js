'use strict';

const
    express = require( 'express' ),
    router = express.Router(),
    
    model = new ( require( './../../model/model' ) ),
    ng = new ( require( './../../libs/ng' ) ),
    refreshDatas = async () => {
        cities = await cities;
        console.log( 'cities1', cities );
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
                    .map( k => {
                        let city = {
                            key: k,
                            name: rCities[ k ].name,
                            link: rCities[ k ].link,
                            siteId: rCities[ k ].site_id
                        };
                        ( async () => {
                            if ( await model.cities().findOne( { key: city.key } ) )
                                model.cities().update( Object.assign( city, { use: true } ), { key: city.key } );
                            else
                                model.cities().save( city );

                        })();
                        return city;
                    })
            );
            console.log( 'cities:', cities, keys, rCities );
        }
    };

let
    cities = ( async () => {
        return await model.cities().find( { use: true } )
    })();

setInterval( refreshDatas, 5000 );

// ------------------------------------- Инициализация -------------------------------------
router.use( ( req, res, next ) => {
    req.db = model;

    next();
});

module.exports = router;