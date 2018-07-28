'use strict';

const
    https = require( 'https' ),
    dataSerialize = obj => Object.keys( obj ).map( k => k + '=' + obj[ k ] ).join( '&' );

process.env[ 'NODE_TLS_REJECT_UNAUTHORIZED' ] = '0';

/**
 * ------------------------------------- Запрос -------------------------------------
 */
class Request
{
    constructor() {
        this.defaultData = {};
        this.defaultPath = '';
        this.dataType = 'json';
    }

    setBody( data ) {
        this.body = dataSerialize( Object.assign( this.defaultData, data ) );
        if ( this.method != 'GET' ) {
            this.headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength( this.body )
            };
            this.path = this.defaultPath;
        }
        else this.path = `${ this.defaultPath }?${ this.body }`;
        return this;
    }

    async request() {
        global.log( this.method + '-запрос', this.host + this.path );
        let self = this;
        return new Promise( ( r, j ) => {
            let httpReq = https[ self.geo ? 'get' : 'request' ]( self.geo ? `https://${ self.host }${ self.path }` : self, function( httpRes ) {
                if ( self.dataType == 'image' ) return r( httpRes );
                let output = '';

                if ( httpRes.statusCode >= 400 )
                    j( {} );
    
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
            if ( this.method != 'GET' ) httpReq.write( self.body );
            httpReq.end();
        }).catch( e => {
            console.log( 'request error:', e );
            return {};
        });
    }

}

module.exports = Request;