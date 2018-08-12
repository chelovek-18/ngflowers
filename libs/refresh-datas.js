'use strict';

const
    // api данные
    ng = new ( require( './ng' ) ),
    geo = new ( require( './geo' ) ),
    Cities = require( './cities' );

module.exports = async () => {
    global.log( 'Старт обновления данных' );
    // Данные из api-запроса для сравнения
    let
        model = global.obj.model,
        cities = new Cities( ...global.obj.cities ),
        reqCities = new Cities( ...( ( await ng.getCities() ) || [] ) );

    // Сравниваем данные из базы и из запроса:
    if ( reqCities.length ) {
        let
            // Список кодов городов (из запроса)
            rKeys = reqCities.getKeys(),
            // Список кодов городов (база)
            keys = cities.getKeys()
                .reduce(
                    ( o, c ) => {
                        // Отдельно города, которые есть в api (обслуживаются), отдельно которые отключены
                        ~rKeys.indexOf( c )
                            ? o.in.push( c )
                            : o.out.push( c );
                        return o;
                    }, { in: [], out: [] }
                ),
            // Новые города (которых еще нет в базе)
            rKeysNew = rKeys.filter( c => !~keys.in.indexOf( c ) );

        // 1. Отключаем те города, что отсутствуют в API
        await cities.switchOffCities( keys.out );

        // 2. Сравниваем по полям
        await cities.checkProps( reqCities, keys.in );

        // 3. Добавляем новые
        await reqCities.addCities( rKeysNew );
    }

    // Подцепляем к городам геолокацию:
    /*for( let i in cities ) {
        let city = cities[ i ];
        if ( !city.location || !city.location.length ) {
            let g = await geo.getCityLocation( city.name );
            global.log( 'geo?..', g );
            if ( !g ) continue;
            g = ( ( g || {} ).results || [ { geometry: {} } ] )[ 0 ].geometry.location || {};
            g = Object.keys( g ).map( k => g[ k ] );
            if ( !g.length ) continue;
            global.obj.cities = { key: city.key, location: g };
            global.log( `Обновлена геолокация ${ city.key }` );
        }
    }*/
};