'use strict';

const
    // api данные
    ng = new ( require( './ng' ) ),
    geo = new ( require( './geo' ) ),
    images = new ( require( './images' ) ),
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

        // ...и наоборот
        isUpd = await cities.switchOnCities( keys.in ) || isUpd;

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
            //city.location = await geo.getCityLocation( city.name.replace( / /g, '+' ) );
            //global.log( 'Геолокация 1', city.location );
            /*if ( !city.location ) continue;
            city.location = ( ( city.location || {} ).results || [ { geometry: {} } ] )[ 0 ].geometry.location || {};
            global.log( 'Геолокация 2', city.location );
            city.location = Object.keys( city.location ).map( k => city.location[ k ] );
            global.log( 'Геолокация 3', city.location );
            if ( !city.location.length ) continue;
            global.log( 'Геолокация 4', city.location );
            await model.cities().update( { key: city.key }, { location: city.location } );
            geoUpd = true;*/
        }
    }
    if ( geoUpd ) cities = await model.cities().find();
    if ( geoUpd ) global.log( 'Обновлена геолокация' );
};