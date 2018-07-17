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
        let
            reqCities = await ng.getCities(),
            isUpd = false;

        // Если не ошибка запроса, то:
        if ( Object.keys( reqCities ).length ) {
            let
                // Ключи в запросе
                rKeys = reqCities.map( c => c.key ),
                // Ключи в списке городов (отдельно те что есть в rKeys, отдельно те что нет)
                keys = cities
                    .map( c => c.key )
                    .reduce( ( o, c ) => { ~rKeys.indexOf( c ) ? o.in.push( c ) : o.out.push( c ); return o; }, { in: [], out: [] }),
                // Новые города
                rKeysNew = reqCities.filter( c => !~keys.in.indexOf( c.key ) );

            // 1. Отключаем те города, что отключены в API
            for ( let k in cities.filter( c => ~keys.out.indexOf( c.key ) && c.use ) ) {
                await model.cities().update( { key: cities[ k ].key }, { use: false } );
                isUpd = true;
            }

            // 2. Сравниваем по полям
            for ( let k in cities.filter( c => ~keys.in.indexOf( c.key ) ) ) {
                let
                    city = cities[ k ],
                    rCity = reqCities.filter( c => c.key == city.key )[ 0 ],
                    updCity = Object.keys( city )
                        .filter( c => !~[ 'key', 'use', 'geo', 'location', 'banners', 'categories' ].indexOf( c ) && city[ c ] != rCity[ c ] )
                        .reduce( ( o, k ) => { o[ k ] = rCity[ k ]; return o; }, {});

                console.log( 'upd-city!', updCity );
                if ( Object.keys( updCity ).length ) {
                    await model.cities().update( { key: city.key }, updCity );
                    isUpd = true;
                }
            }

            // 3. Добавляем новые
            /*for ( let k in rKeysNew ) {
                await model.cities().save( rKeysNew[ k ] );
                isUpd = true;
            }
            
            // 4. Сохраняем в cities
            if ( isUpd ) cities = await model.cities().find();*/

        }

        // Подцепляем к городам геолокацию:
        let geoUpd = false;
        for( let i in cities ) {
            if ( !cities[ i ].location || !cities[ i ].location.length ) {
                if ( !cities[ i ].geo ) {
                    cities[ i ].geo = ( await geo.getCityLocation( cities[ i ].name.replace( / /g, '+' ) ) ).results[ 0 ].geometry.location;
                    cities[ i ].geo = Object.keys( cities[ i ].geo ).map( k => cities[ i ].geo[ k ] );
                } else {
                    cities[ i ].location = cities[ i ].geo;
                    await model.cities().update( { key: cities[ i ].key }, { location: cities[ i ].location } );
                    geoUpd = true;
                }
            }
        }
        if ( geoUpd ) cities = await model.cities().find();
};

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
    //res.json( await geo.getCityLocation() );

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