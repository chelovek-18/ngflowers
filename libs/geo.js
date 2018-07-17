'use strict';

const
    https = require( 'https' ),
    Request = require( './request' ),
    dataSerialize = obj => Object.keys( obj ).map( k => k + '=' + obj[ k ] ).join( '&' );

process.env[ 'NODE_TLS_REJECT_UNAUTHORIZED' ] = '0';

class Geo extends Request
{
    constructor() {
        super();
        this.host = 'maps.google.com';
        this.path = '/maps/api/geocode/json';
        this.method = 'GET';
        this.address = 'Санкт-Петербург';
    }

    async getCoords( address = this.address ) {
        return await this.setBody( { address: address } ).request();
    }
}

module.exports = Geo;