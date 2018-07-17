'use strict';

const
    https = require( 'https' ),
    dataSerialize = obj => Object.keys( obj ).map( k => k + '=' + obj[ k ] ).join( '&' );

process.env[ 'NODE_TLS_REJECT_UNAUTHORIZED' ] = '0';

class Request
{
    constructor() {
        this.defaultDate = {};
        this.defaultPath = '';
    }

    setBody( data ) {
        this.body = dataSerialize( Object.assign( { key: 'Mdln24nv052=3m' }, data ) );
        if ( this.method != 'GET' ) this.headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength( this.body )
            };
        else this.path = `${ this.defaultPath }?${ this.body }`;
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
                        console.log( 'request error:', err );
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

}

module.exports = Request;