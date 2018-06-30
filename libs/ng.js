'use strict';

const
    https = require( 'https' ),
    dataSerialize = obj => Object.keys( obj ).map( k => k + '=' + obj[ k ] ).join( '&' );

process.env[ 'NODE_TLS_REJECT_UNAUTHORIZED' ] = '0';

class NG
{
    constructor() {
        this.host = 'novayagollandiya1.ru';
        this.path = '/inc/ajax/rest.php';
        this.method = 'POST';
        this.city = 'spb';
    }

    setBody( data ) {
        this.body = dataSerialize( Object.assign( { key: 'Mdln24nv052=3m' }, data ) );
        this.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength( this.body )
        };
        return this;
    }

    async request() {
        return await new Promise( ( r, j ) => {
            let httpReq = https.request( this, function( httpRes ) {
                let output = '';

                if ( httpRes.statusCode >= 400 ) {
                    //console.log( httpRes.statusCode );
                    j( {} );
                }
    
                httpRes.on( 'data', function ( chunk ) {
                    output += chunk;
                });
                httpRes.on( 'end', () => {
                    r( output )
                });
            });
            httpReq.on( 'error', ( err ) => {
                //console.log( err );
                j( {} );
            });
            httpReq.write( this.body );
            httpReq.end();
        });
    }

    async getCities() {
        return await this.setBody( { action: 'getCities' } ).request();
    }

    async getBanners() {
        return await this.setBody( { action: 'getBanners', city: this.city } ).request();
    }

    async getSections() {
        return await this.setBody( { action: 'getSections', city: this.city } ).request();
    }

    async getProducts() {
        return await this.setBody( { action: 'getProducts', city: this.city } ).request();
    }
}

module.exports = NG;