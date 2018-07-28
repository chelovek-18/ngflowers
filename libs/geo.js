'use strict';

const Request = require( './request' );

/**
 * ------------------------------------- Google Maps API -------------------------------------
 */
class Geo extends Request
{
    constructor() {
        super();
        this.host = 'maps.google.com';
        this.defaultPath = '/maps/api/geocode/json';
        this.method = 'GET';
        this.defaultData = { sensor: false, key: 'AIzaSyAQc5Tfg8shWq24eTkwWzshLG0p58ZLH7M' };
        this.address = 'Санкт-Петербург';
    }

    async getCityLocation( address = this.address ) {
        global.log( 'Получена геолокация города ' + address );
        return this.setBody( { address: '%D0%9D%D0%B8%D0%B6%D0%BD%D0%B8%D0%B9+%D0%9D%D0%BE%D0%B2%D0%B3%D0%BE%D1%80%D0%BE%D0%B4' /*address*/ } ).request();
        // .setHeaders( this.xheaders )
    }

    async setParams( settings ) {
        // Установить ключ
        this.defaultData.key = ( await settings ).googleKey;
    }

    setHeaders( headers ) {
        this.headers = headers;
        this.xheaders = headers;
        return this;
    }
}

module.exports = Geo;