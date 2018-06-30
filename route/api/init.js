'use strict';

const
    express = require( 'express' ),
    router = express.Router(),
    
    model = new ( require( './../../model/model' ) ),
    ng = new ( require( './../../libs/ng' ) ),
    // Периодическое обновление данных
    refreshDatas = async () => {
        // Последние из базы и из запроса для сравнения
        cities = await cities;
        let
            rCities = await ng.getCities();

        // Если не ошибка запроса, то:
        if ( Object.keys( rCities ).length ) {
            // 1. Фильтруем, оставляя только те города что есть в запросе
            cities = cities.map( c => {
                if ( !rCities[ c.key ] ) {
                    // Лишние - отключаем
                    model.cities().update( { use: false }, { key: c.key } );
                } else if ( c.name != rCities[ c.key ].name || c.link != rCities[ c.key ].link || c.siteId != rCities[ c.key ].site_id ) {
                    // Измененные - обновляем
                    c.name = rCities[ c.key ].name;
                    c.link = rCities[ c.key ].link;
                    c.siteId = rCities[ c.key ].site_id;
                    model.cities().update( c, { key: c.key } );
                }
                return c;
            }).filter( c => rCities[ c.key ] );
            let keys = cities.map( c => c.key );
            // 2. Добавляем те, что нет у нас
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

    req.api = {};
    Object.defineProperty( req.api, 'cities', {
        get: () => 'cities-1'
    });

    next();
});

module.exports = router;