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

    getPropIds( prop ) {
        return this[ prop ].map( c => parseInt( c.id ) );
    }

    getCity( key ) {
        return this.filter( c => c.key == key )[ 0 ];
    }

    async addCities( keys ) {
        let isUpd = false;
        for ( let n in keys ) {
            let
                key = keys[ n ],
                newCity = this.filter( c => c.key == key )[ 0 ];

            await model.cities().save( newCity );
            isUpd = true;
            global.log( `Добавлен город ${ newCity.key }` );
        }
        return isUpd;
    }

    async switchCities( keys, on ) {
        let isUpd = false;
        for ( let n in this.filter( c => ~keys.indexOf( c.key ) && c.use != on ) ) {
            let city = this[ n ];
            await model.cities().update( { key: city.key }, { use: on } );
            isUpd = true;
            global.log( on ? `Отключен город ${ city.key }` : `Включаем город ${ city.key }` );
        }
        return isUpd;
    }

    async switchOffCities( keys ) {
        return await this.switchCities( keys, false );
    }

    async switchOnCities( keys ) {
        return await this.switchCities( keys, true );
    }

    async checkProps( reqCities, keys ) {
        let isUpd = false;
        for ( let n in this.filter( c => ~keys.indexOf( c.key ) ) ) {
            let
                city = this[ n ],
                rCity = reqCities.getCity( city.key ),
                updCity = this.compare( city, rCity );

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
                    rIds = rCity.getPropIds( prop ),
                    ids = city.getPropIds( prop ),
                    crossIds = ids.filter( id => ~rIds.indexOf( id ) ),
                    newIds = rIds.filter( id => !~ids.indexOf( id ) ),
                    noIds = ids.filter( id => !~rIds.indexOf( id ) );

                // Перебираем массив (баннеров, категорий или товаров)
                city[ prop ].filter( it => ~crossIds.indexOf( it.id ) ).forEach( item => {
                    let rItem = rCity.filter( it => it.id == item.id )[ 0 ];

                    // Сравниваем значения и корректируем
                    Object.keys( rItem ).forEach( p => {
                        if ( rItem[ p ] != item[ p ] ) {
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
                    await model.cities().update( { key: city.key }, { [ prop ]: city[ prop ] } );
                    isUpd = true;
                    global.log( `Город обновлен, поле ${ prop }` );
                }

                // Проверяем наличие сохраненных изображений, сохраняем
                if ( prop == 'products' || prop == 'banners' ) {
                    //images.imgsExistenceCheck( city, prop );
                }
            }
        }
        return isUpd;
    }

    compare( city, rCity ) {
        return Object.keys( rCity )
            .filter( cf => ~[ 'name', 'link', 'siteId' ].indexOf( cf ) && city[ cf ] != rCity[ cf ] )
            .reduce( ( o, k ) => { o[ k ] = rCity[ k ]; return o; }, {});
    }
}

module.exports = Cities;