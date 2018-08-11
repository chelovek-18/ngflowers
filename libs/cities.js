'use strict';

const images = new ( require( './images' ) );

let model;

class Cities extends Array
{
    constructor() {
        let args = [];
        for ( let k in arguments ) args.push( arguments[ k ] );
        super( ...args );
        model = global.obj.model;
    }

    getKeys() {
        return this.map( c => c.key );
    }

    getCity( key ) {
        return this.filter( c => c.key == key )[ 0 ];
    }

    async addCities( keys ) {
        for ( let n in keys ) {
            let
                key = keys[ n ],
                newCity = this.filter( c => c.key == key )[ 0 ];

            global.obj.cities = newCity;
            global.log( `Добавлен город ${ newCity.key }` );
        }
    }

    async switchCities( keys, on ) {
        for ( let n in keys ) {
            let city = this.getCity( [ keys[ n ] ] );
            if ( city.use != on ) continue;
            global.obj.cities = { key: city.key, use: on };
            global.log( !on ? `Отключен город ${ city.key }` : `Включаем город ${ city.key }` );
        }
    }

    async switchOffCities( keys ) {
        return await this.switchCities( keys, false );
    }

    async switchOnCities( keys ) {
        return await this.switchCities( keys, true );
    }

    async checkProps( reqCfities, keys ) {
        for ( let n in keys ) {
            let
                city = this.getCity( keys[ n ] ),
                rCity = reqCfities.getCity( city.key ),
                updCity = this.compare( city, rCity );

            if ( Object.keys( updCity ).length ) {
                global.obj.cities = updCity;
                global.log( `Город ${ updCity.key } обновлен` );
            }

            // Сравниваем баннеры, категории, товары
            let props = [ 'banners', 'categories', 'products' ];
            for ( let nm in props ) {
                let
                    prop = props[ nm ],
                    propUpd = false,
                    rIds = rCity[ prop ].map( c => parseInt( c.id ) ),
                    ids = city[ prop ].map( c => parseInt( c.id ) ),
                    crossIds = ids.filter( id => ~rIds.indexOf( id ) ),
                    newIds = rIds.filter( id => !~ids.indexOf( id ) ),
                    noIds = ids.filter( id => !~rIds.indexOf( id ) );

                // Перебираем массив (баннеров, категорий или товаров)
                city[ prop ].filter( it => ~crossIds.indexOf( it.id ) ).forEach( item => {
                    // Ищем имя для баннера если нет
                    if ( prop == 'banners' && item.name == '' ) {
                        let bannUrl = item.link;
                        item.name = ( city.categories.filter( c => c.url == bannUrl )[ 0 ]
                            || city.products.filter( p => p.url == bannUrl )[ 0 ]
                            || {} ).name || '';
                        if ( item.name != '' ) propUpd = true;
                    }

                    let rItem = rCity[ prop ].filter( it => it.id == item.id )[ 0 ];

                    // Сравниваем значения и корректируем
                    Object.keys( rItem ).forEach( p => {
                        if (
                            ( rItem[ p ] instanceof Array )
                                ? (
                                    rItem[ p ].length != item[ p ].length
                                    || rItem[ p ].filter( i => ~item[ p ].indexOf( i ) ).length != item[ p ].length
                                ) : ( rItem[ p ] instanceof Object )
                                ? (
                                    item[ p ] && ( Object.keys( rItem[ p ] ).length != Object.keys( item[ p ] ).length
                                    || Object.keys( rItem[ p ] )
                                        .filter( k => rItem[ p ][ k ].toString() != item[ p ][ k ].toString() ).length )
                                ) : rItem[ p ] != item[ p ]
                        ) {
                            item[ p ] = rItem[ p ];
                            propUpd = true;
                        }
                    });
                });
                rCity[ prop ].filter( it => ~newIds.indexOf( it.id ) ).forEach( rItem => {
                    city[ prop ].push( Object.assign( rItem, { use: true } ) );
                    propUpd = true;
                });
                city[ prop ].filter( it => ~noIds.indexOf( it.id ) && it.use ).forEach( item => {
                    item.use = false;
                    propUpd = true;
                });

                if ( propUpd ) {
                    global.obj.cities = { key: city.key, [ prop ]: city[ prop ] };
                    global.log( `Город обновлен, поле ${ prop }` );
                }

                // Проверяем наличие сохраненных изображений, сохраняем
                if ( prop == 'products' || prop == 'banners' ) {
                    images.imgsExistenceCheck( city, prop );
                }
            }
        }
    }

    compare( city, rCity ) {
        return Object.keys( rCity )
            .filter( cf => ~[ 'name', 'link', 'siteId' ].indexOf( cf ) && city[ cf ] != rCity[ cf ] )
            .reduce( ( o, k ) => { o[ k ] = rCity[ k ]; o.key = rCity.key; return o; }, {});
    }
}

module.exports = Cities;