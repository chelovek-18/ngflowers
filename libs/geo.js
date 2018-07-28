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
        this.geo = true;
    }

    async getCityLocation( address = this.address ) {
        global.log( 'Получена геолокация города ' + address );
        return await this.setBody( { address: address } ).request();
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