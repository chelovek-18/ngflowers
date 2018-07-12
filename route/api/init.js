'use strict';

const
    express = require( 'express' ),
    router = express.Router(),
    
    model = new ( require( './../../model/model' ) ),
    ng = new ( require( './../../libs/ng' ) );

    // Периодическое обновление данных
    //refreshDatas = async () => {};



    // Периодическое обновление данных
    /*refreshDatas = async () => {
        // Данные из базы и из запроса для сравнения
        cities = await cities;
        let
            rCities = await ng.getCities();

        // Если не ошибка запроса, то:
        if ( Object.keys( rCities ).length ) {
            // 1. Фильтруем, оставляя только те города что есть в запросе
            await model.cities().update( { use: false }, { key: 'spb' } ).exec();
            return;
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
            let newCities = Object.keys( rCities ).filter( k => !~keys.indexOf( k ) );
            //let nC = [];
            for ( let nc in newCities ) {
                let k = newCities[ nc ];
                let c = rCities[ k ];
                let city = await model.cities().findOne( { key: c.key } );
                if ( !city ) {
                    city = {
                        key: c.key,
                        name: c.name,
                        link: c.link,
                        siteId: c.site_id
                    };
                    model.cities().save( city );
                    cities.push( city );
                }
            }*/
                                /*-------------------------------cities = cities.concat(
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
                                );-------------------------------*/
        /*}
    };*/

let
cities = ( async () => {
    return { a: 7 }; //await model.cities().find( {} )
})();

//setInterval( refreshDatas, 5000 );

// ------------------------------------- Инициализация -------------------------------------
router.use( async ( req, res, next ) => {
    // Подключение БД
    req.db = await model;
    //if ( true ) next( { bb: !!req.db.cities, qq: Object.keys( req.db ), tt: Object.getOwnPropertyNames( req.db.__proto__ ) } );
    if ( !!!req.db.cities ) next( /*req.db*/ { a: 8 } );

    cities = await cities;

    Object.defineProperty( req, 'cities', {
        get: () => cities
    });

    // ???
    /*req.citiesRefresh = async () => {
        cities = await ( async () => {
            return await model.cities().find( { use: true } )
        })();
    }

    next();*/
});

module.exports = router;