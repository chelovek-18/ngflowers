'use strict';

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
                updCity = this.compare( city, rCity ); global.log( 'updCity', updCity );

            if ( Object.keys( updCity ).length ) {
                await model.cities().update( { key: city.key }, updCity );
                isUpd = true;
                global.log( `Город обновлен` );
            }
        }
        return isUpd;
    }

    compare( city, rCity ) {
        return Object.keys( city )
            .map( cf => { global.log( 'city cf', cf, city.name ); return cf; } )
            .filter( cf => ~[ 'name', 'link', 'siteId' ].indexOf( cf ) && city[ cf ] != rCity[ cf ] )
            .reduce( ( o, k ) => { o[ k ] = rCity[ k ]; return o; }, {});
    }
}

module.exports = Cities;