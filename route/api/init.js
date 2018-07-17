'use strict';

const
    // express
    express = require( 'express' ),
    router = express.Router(),
    
    // api данные
    model = new ( require( './../../model/model' ) )( dbcomplete ),
    ng = new ( require( './../../libs/ng' ) ),
    geo = new ( require( './../../libs/geo' ) ),

    // Периодическое обновление данных
    refreshDatas = async () => {
        // Данные из запроса для сравнения
        /*let
            reqCities = await ng.getCities(),
            compareObjs = ( arr, city ) => {
                let
                    beChange = false;//,
                    //ids = ;

                //arr.


                return beChange;



                /*let keys = cities.map( c => c.key );
                arr.forEach( obj => {
                    //let cElem = cities
                    //Object.keys( obj )
                });*-/
            };

        // Если не ошибка запроса, то:
        /*if ( Object.keys( reqCities ).length ) {
            let
                keys = cities.map( c => c.key ),
                rKeys = reqCities.map( c => c.key ),
                newCities = reqCities.filter( c => !~keys.indexOf( c.key ) ),
                offCities = cities.filter( c => !~rKeys.indexOf( c.key ) ).map( c => c.key ),
                beChange = newCities.length || offCities.length;

            cities.forEach( c => {
                // 1. Отключаем те города, что отключены в API
                if ( ~offCities.indexOf( c.key ) ) c.use = false;
                // 2. Сверяем поля
                let reqCity = reqCities.filter( rc => rc.key == c.key )[ 0 ];
                Object.keys( c ).forEach( k => {
                    if ( !~[ 'use', '_id', 'banners', 'categories', 'products', 'key', 'location' ].indexOf( k ) && c[ k ] != reqCity[ k ] ) {
                        c[ k ] = reqCity[ k ];
                        beChange = true;
                    } else if ( ~[ 'banners', 'categories', 'products' ].indexOf( k ) ) {
                        //compareObjs( c[ k ], c.key );
                    }
                });
            });
            //await model.cities().update( { key: 'spb' }, { use: false } );
        }*/

        // Подцепляем к городам геолокацию:
        for( let i in cities ) {
            if ( !cities[ i ].location || !cities[ i ].location.length ) {
                cities[ i ].location = ( await geo.getCityLocation( cities[ i ].name.replace( / /g, '+' ) ) );//.results[ 0 ].geometry.location;
                /*cities[ i ].location = Object.keys( cities[ i ].location ).map( k => cities[ i ].location[ k ] );
                console.log( 'wtfff', cities[ i ] );*/
                //await model.cities().update( { key: cities[ i ].key }, { location: cities[ i ].location } );
                console.log( 'го: ', cities[ i ] );
            }
        }
    };



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

// Данные
let
    cities = [];

// Функция дергается по готовности базы
async function dbcomplete() {
    cities = await model.cities().find();

    setInterval( refreshDatas, 5000 );
}

// ------------------------------------- Инициализация -------------------------------------
router.use( async ( req, res, next ) => {
    // Подключение БД
    req.db = model;

    //res.json( await ng.getCities() );
    //res.json( await ng.getProducts( 'spb' ) );

    /*cities = cities;
    if ( !cities.length ) cities = await req.db.cities().find();
    //if ( !cities.length ) cities = await req.db.cities().find();
    //console.log( 'cities:', cities );*/

    Object.defineProperty( req, 'cities', {
        get: () => cities,
        set: async cs => {
            for( let k in cs )
                await req.db.cities().update( { key: cs[ k ].key }, cs[ k ] );
            cities = await req.db.cities().find();
            return cs;
        }
    });

    // ???
    /*req.citiesRefresh = async () => {
        cities = await ( async () => {
            return await model.cities().find( { use: true } )
        })();
    }*/

    next();
});

module.exports = router;