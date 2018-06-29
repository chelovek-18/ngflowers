'use strict';

const
    https = require( 'https' ),
    dataSerialize = obj => Object.keys( obj ).map( k => k + '=' + obj[ k ] ).join( '&' );

class NG
{
    constructor() {
        this.host = 'novayagollandiya.ru';
        this.path = '/inc/ajax/rest.php';
        this.body = dataSerialize( { key: 'Mdln24nv052=3m', action: 'getCities' } );
        this.method = 'POST';
        this.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength( this.body )
        };
    }

    async getCities() {
        return await new Promise( ( r, j ) => {
        let httpReq = https.request( this, function( httpRes ) {
            let output = '';

            if ( httpRes.statusCode >= 400 ) {
                //return callback( httpRes.statusCode );
            }
    
            httpRes.on( 'data', function ( chunk ) {
                output += chunk;
            });
            httpRes.on( 'end', () => {
                r( output )
            });
        });
        httpReq.on( 'error', ( err ) => {
            //callback( err );
        });
        httpReq.write( this.body );
        httpReq.end();

    });
    }
}

module.exports = NG;