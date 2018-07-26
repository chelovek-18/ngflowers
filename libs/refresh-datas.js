'use strict';

const
    prototypes = require( './prototypes' ).city,

    // api данные
    ng = new ( require( './ng' ) ),
    geo = new ( require( './geo' ) ),
    images = new ( require( './images' ) );

module.exports = async () => {
    // Данные из api-запроса для сравнения
    let
        cities = global.obj.cities,
        model = global.obj.model,
        reqCities = ( await ng.getCities() ) || [],
        isUpd = false;

    // Сравниваем данные из базы и из запроса:
    if ( reqCities.keys77 /*Object.keys( reqCities ).length*/ ) {
        /*let
            // Список кодов городов (запрос)
            rKeys = reqCities.map( c => c.key ),
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
            rKeysNew = reqCities.filter( c => !~keys.in.indexOf( c.key ) );

        // 1. Отключаем те города, что отсутствуют в API
        for ( let k in cities.filter( c => ~keys.out.indexOf( c.key ) && c.use ) ) {
            await model.cities().update( { key: cities[ k ].key }, { use: false } );
            isUpd = true;
            console.log( `cities update (out city ${ cities[ k ].key })` );
        }

        // 2. Сравниваем по полям
        for ( let k in cities.filter( c => ~keys.in.indexOf( c.key ) ) ) {
            let
                city = cities[ k ],
                rCity = reqCities.filter( c => c.key == city.key )[ 0 ],
                updCity = Object.keys( city )
                    .filter( c => ~[ 'name', 'link', 'siteId' ].indexOf( c ) && city[ c ] != rCity[ c ] )
                    .reduce( ( o, k ) => { o[ k ] = rCity[ k ]; return o; }, {});

            if ( Object.keys( updCity ).length ) {
                await model.cities().update( { key: city.key }, updCity );
                isUpd = true;
                console.log( `cities update (upd fields)` );
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
                    console.log( `cities update (upd ${ prop })` );
                }

                // Проверяем наличие сохраненных изображений, сохраняем
                if ( prop == 'products' || prop == 'banners' ) {
                    images.imgsExistenceCheck( city, prop );
                }
            }
        }

        // 3. Добавляем новые
        for ( let k in rKeysNew ) {
            await model.cities().save( rKeysNew[ k ] );
            isUpd = true;
            console.log( `cities update (add cities ${ rKeysNew[ k ].key })` );
        }*/
        
        // 4. Сохраняем в cities
        if ( isUpd ) cities = await model.cities().find();
    }

    // Подцепляем к городам геолокацию:
    /*let geoUpd = false;
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
    if ( geoUpd ) console.log( 'geolocations update' );*/
};