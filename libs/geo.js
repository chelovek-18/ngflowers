'use strict';

const Request = require( './request' );

class Geo extends Request
{
    constructor() {
        super();
        this.host = 'maps.google.com';
        this.defaultPath = '/maps/api/geocode/json';
        this.method = 'GET';
        this.defaultData = { sensor: false/*, key: 'AIzaSyAQc5Tfg8shWq24eTkwWzshLG0p58ZLH7M'*/ };
        this.address = 'Санкт-Петербург';
    }

    async getCoords( address = this.address ) {
        return await this.setBody( { address: address } ).request();
    }
}

module.exports = Geo;