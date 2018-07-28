'use strict';

const
    // api данные
    ng = new ( require( './ng' ) ),
    geo = new ( require( './geo' ) ),
    images = new ( require( './images' ) ),
    Cities = require( './cities' ),
    https = require( 'https' );

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
    /*geo.setHeaders( {
        ':method': 'GET',
        ':path': '/maps/api/geocode/json?sensor=false&key=AIzaSyAQc5Tfg8shWq24eTkwWzshLG0p58ZLH7M&address=%D0%9D%D0%B8%D0%B6%D0%BD%D0%B8%D0%B9+%D0%9D%D0%BE%D0%B2%D0%B3%D0%BE%D1%80%D0%BE%D0%B4',
        ':scheme': 'https',
        'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*-/*;q=0.8',
        'accept-encoding': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'cookie': 'NID=135=LA5iPmhWBmep0PzQOl-8PUSoYvcwH4VFPqMYwqTNhFGyl-Rm6CA_o3_mI-wOgCZVLg-_rKjrJGPLRhBqz7ebCD3x9vEwF0p4e7lmyZ_4uZiFHfz1DsLwH3rYREDftk7g; 1P_JAR=2018-07-27-05',
        'upgrade-insecure-requests': 1,
        'x-client-data': 'CIW2yQEIo7bJAQjBtskBCKmdygEI153KAQioo8oB'
    } );*/
    /*:authority: maps.google.com
:method: GET
:path: /maps/api/geocode/json?sensor=false&key=AIzaSyAQc5Tfg8shWq24eTkwWzshLG0p58ZLH7M&address=%D0%9D%D0%B8%D0%B6%D0%BD%D0%B8%D0%B9+%D0%9D%D0%BE%D0%B2%D0%B3%D0%BE%D1%80%D0%BE%D0%B4
:scheme: https
accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*-/*;q=0.8
accept-encoding: gzip, deflate, br
accept-language: ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7
cookie: NID=135=LA5iPmhWBmep0PzQOl-8PUSoYvcwH4VFPqMYwqTNhFGyl-Rm6CA_o3_mI-wOgCZVLg-_rKjrJGPLRhBqz7ebCD3x9vEwF0p4e7lmyZ_4uZiFHfz1DsLwH3rYREDftk7g; 1P_JAR=2018-07-27-05
upgrade-insecure-requests: 1
user-agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36
x-client-data: CIW2yQEIo7bJAQjBtskBCKmdygEI153KAQioo8oB*/
    for( let i in cities ) {
        let city = cities[ i ];
        if ( !city.location || !city.location.length ) {
            //city.location = await https.get( 'https://maps.google.com/maps/api/geocode/json?sensor=false&key=AIzaSyAQc5Tfg8shWq24eTkwWzshLG0p58ZLH7M&address=%D0%9D%D0%B8%D0%B6%D0%BD%D0%B8%D0%B9+%D0%9D%D0%BE%D0%B2%D0%B3%D0%BE%D1%80%D0%BE%D0%B4' );
            https.get( 'https://maps.google.com/maps/api/geocode/json?sensor=false&key=AIzaSyAQc5Tfg8shWq24eTkwWzshLG0p58ZLH7M&address=%D0%9D%D0%B8%D0%B6%D0%BD%D0%B8%D0%B9+%D0%9D%D0%BE%D0%B2%D0%B3%D0%BE%D1%80%D0%BE%D0%B4', ( httpRes ) => {
                let output = '';

                if ( httpRes.statusCode >= 400 )
                    global.log( 'Геолокация x1', httpRes.statusCode );
    
                httpRes.on( 'data', function ( chunk ) {
                    output += chunk;
                });
                httpRes.on( 'end', () => {
                    global.log( 'Геолокация y1', output );
                });
                //global.log( 'Геолокация 1', httpRes );
            });
            //global.log( 'Геолокация 1', city.location );
            /*city.location = await geo.getCityLocation( city.name.replace( / /g, '+' ) );
            global.log( 'Геолокация 1', city.location );
            if ( !city.location ) continue;
            city.location = ( ( city.location || {} ).results || [ { geometry: {} } ] )[ 0 ].geometry.location || {};
            global.log( 'Геолокация 2', city.location );
            /*city.location = Object.keys( city.location ).map( k => city.location[ k ] );
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