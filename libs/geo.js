'use strict';

const Request = require( './request' );

class Geo extends Request
{
    constructor() {
        super();
        this.host = 'maps.google.com';
        this.defaultPath = '/maps/api/geocode/json';
        this.method = 'GET';
        this.defaultDate = { sensor: false };
        this.address = 'Санкт-Петербург';
    }

    async getCoords( address = this.address ) {
        return await this.setBody( { address: address } ).request();
    }
}

module.exports = Geo;