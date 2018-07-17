'use strict';

const
    https = require( 'https' ),
    dataSerialize = obj => Object.keys( obj ).map( k => k + '=' + obj[ k ] ).join( '&' );

process.env[ 'NODE_TLS_REJECT_UNAUTHORIZED' ] = '0';

class GEO
{
    constructor() {
        this.host = 'maps.google.com';
        this.path = '/maps/api/geocode/json';
        this.method = 'GET';
        this.address = 'Санкт-Петербург';
    }

    setBody( data ) {
        this.body = dataSerialize( Object.assign( { sensor: false }, data ) );
        this.path += '?' + this.body;
        /*this.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength( this.body )
        };*/
        return this;
    }

    async request() {
        return await new Promise( ( r, j ) => {
            let httpReq = https.request( this, function( httpRes ) {
                let output = '';

                if ( httpRes.statusCode >= 400 ) {
                    console.log( 'request error:', httpRes.statusCode );
                    j( {} );
                }
    
                httpRes.on( 'data', function ( chunk ) {
                    output += chunk;
                });
                httpRes.on( 'end', () => {
                    try {
                        r( JSON.parse( output ) );
                    } catch( err ) {
                        console.log( 'request error:', err, ' in ', output );
                        r( {} );
                    }
                });
            });
            httpReq.on( 'error', ( err ) => {
                console.log( 'request error:', err );
                j( {} );
            });
            httpReq.write( this.body );
            httpReq.end();
        }).catch( e => {
            console.log( 'request error:', e );
            return {};
        });
    }

    async getCoords( address = this.address ) {
        return await this.setBody( { address: address } ).request();
    }
}

module.exports = GEO;