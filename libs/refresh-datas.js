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
                global.log( `Город обновлен` );
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
                    global.log( `Город обновлен, поле ${ prop }` );
                }

                // Проверяем наличие сохраненных изображений, сохраняем
                if ( prop == 'products' || prop == 'banners' ) {
                    //images.imgsExistenceCheck( city, prop );
                }
            }
        }*/

        // 3. Добавляем новые
        isUpd = await reqCities.addCities( rKeysNew ) || isUpd;
        
        // 4. Сохраняем в cities
        global.log( `Обновлен список городов` );
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