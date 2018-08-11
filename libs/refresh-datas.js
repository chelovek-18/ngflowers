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
        reqCities = new Cities( ...( ( await ng.getCities() ) || [] ) ),
        isUpd = false;

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
        isUpd = await cities.switchOffCities( keys.out );

        // 2. Сравниваем по полям
        isUpd = await cities.checkProps( reqCities, keys.in ) || isUpd;

        // 3. Добавляем новые
        isUpd = await reqCities.addCities( rKeysNew ) || isUpd;
        
        // 4. Сохраняем в cities
        if ( isUpd ) global.log( `Обновлен список городов` );
        if ( isUpd ) global.obj.cities = await model.cities().find();
    }

    // Подцепляем к городам геолокацию:
    let geoUpd = false;
    for( let i in cities ) {
        let city = cities[ i ];
        if ( !city.location || !city.location.length ) {
            let g = await geo.getCityLocation( city.name );
            if ( !g ) continue;
            g = ( ( g || {} ).results || [ { geometry: {} } ] )[ 0 ].geometry.location || {};
            g = Object.keys( g ).map( k => g[ k ] );
            if ( !g.length ) continue;
            await model.cities().update( { key: city.key }, { location: g } );
            geoUpd = true;
        }
    }
    if ( geoUpd ) global.obj.cities = await model.cities().find();
    if ( geoUpd ) global.log( 'Обновлена геолокация' );
};