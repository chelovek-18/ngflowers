'use strict';

let model;

class Cities extends Array
{
    /*constructor() {
        super();
        model = global.obj.model;
    }*/

    getKeys() {
        model = global.obj.model;
        return this.map( c => c.key );
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

    async switchOffCities( keys ) {
        let isUpd = false;
        for ( let n in this.filter( c => ~keys.indexOf( c.key ) && c.use ) ) {
            let city = this[ n ];
            await model.cities().update( { key: city.key }, { use: false } );
            isUpd = true;
            global.log( `Отключен город ${ city.key }` );
        }
        return isUpd;
    }
}

module.exports = Cities;