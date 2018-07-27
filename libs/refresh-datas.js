'use strict';

const
    // api данные
    ng = new ( require( './ng' ) ),
    geo = new ( require( './geo' ) ),
    images = new ( require( './images' ) );

module.exports = async () => {
    global.log( 'Старт обновления данных' );
    // Данные из api-запроса для сравнения
    let
        cities = global.obj.cities,
        model = global.obj.model,
        reqCities = ( await ng.getCities() ) || [],
        // Список кодов городов (из запроса)
        rKeys = Object.keys( reqCities ),
        isUpd = false;

    // Сравниваем данные из базы и из запроса:
    if ( rKeys.length ) {
        let
            // Список кодов городов (база)
            keys = cities
                .map( c => c.key )
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
        for ( let k in cities.filter( c => ~keys.out.indexOf( c.key ) && c.use ) ) {
            await model.cities().update( { key: cities[ k ].key }, { use: false } );
            isUpd = true;
            global.log( `Отключен город ${ cities[ k ].key }` );
        }

        // 2. Сравниваем по полям
        /*for ( let k in cities.filter( c => ~keys.in.indexOf( c.key ) ) ) {
            let
                city = cities[ k ],
                rCity = reqCities.filter( c => c.key == city.key )[ 0 ],
                updCity = Object.keys( city )
                    .filter( c => ~[ 'name', 'link', 'siteId' ].indexOf( c ) && city[ c ] != rCity[ c ] )
                    .reduce( ( o, k ) => { o[ k ] = rCity[ k ]; return o; }, {});

            if ( Object.keys( updCity ).length ) {
                await model.cities().update( { key: city.key }, updCity );
                isUpd = true;
                global.log( `cities update (upd fields)` );
            }

            // Сравниваем баннеры, категории, товары
            let props = [ 'banners', 'categories', 'products' ];
            for ( let nm in props ) {
                let
                    prop = props[ nm ],
                    propUpd = false,
                    ids = rCity[ prop ].map( p => parseInt( p.id ) );

                // Перебираем массив (баннеров, категорий или товаров)
                rCity[ prop ].forEach( item => {
                    let
                        id = item.id,
                        propItem = city[ prop ]
                            .filter( i => i.id == id )[ 0 ] ||
                            ( city[ prop ].push( { id: id } ), city[ prop ][ city[ prop ].length - 1 ] );

                    // Сравниваем значения и корректируем
                    Object.keys( item ).forEach( p => {
                        if ( item[ p ] != propItem[ p ] ) {
                            propItem[ p ] = item[ p ];
                            propUpd = true;
                        }
                    });
                });
                // Отключаем те, которые в api отсутствуют
                city[ prop ]
                    .filter( i => !~ids.indexOf( i.id ) && i.use )
                    .forEach( i => { i.use = false; propUpd = true; } );
                
                if ( propUpd ) {
                    await model.cities().update( { key: city.key }, { [ prop ]: city[ prop ] } );
                    isUpd = true;
                    global.log( `cities update (upd ${ prop })` );
                }

                // Проверяем наличие сохраненных изображений, сохраняем
                if ( prop == 'products' || prop == 'banners' ) {
                    images.imgsExistenceCheck( city, prop );
                }
            }
        }*/

        // 3. Добавляем новые
        for ( let k in rKeysNew ) {
            await model.cities().save( reqCities[ rKeysNew[ k ] ] );
            isUpd = true;
            global.log( `Добавлен город ${ reqCities[ rKeysNew[ k ] ].key }` );
        }
        
        // 4. Сохраняем в cities
        global.log( `Обновлен список городов` );
        if ( isUpd ) cities = await model.cities().find();
    }

    // Подцепляем к городам геолокацию:
    /*let geoUpd = false;
    for( let i in cities ) {
        let city = cities[ i ];
        if ( !city.location || !city.location.length ) {
            city.location = await geo.getCityLocation( city.name.replace( / /g, '+' ) );
            if ( !city.location ) continue;
            city.location = ( ( city.location || {} ).results || [ { geometry: {} } ] )[ 0 ].geometry.location || {};
            city.location = Object.keys( city.location ).map( k => city.location[ k ] );
            if ( !city.location.length ) continue;
            await model.cities().update( { key: city.key }, { location: city.location } );
            geoUpd = true;
        }
    }
    if ( geoUpd ) cities = await model.cities().find();
    if ( geoUpd ) global.log( 'Обновлена геолокация' );*/
};