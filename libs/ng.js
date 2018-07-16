'use strict';

const
    https = require( 'https' ),
    dataSerialize = obj => Object.keys( obj ).map( k => k + '=' + obj[ k ] ).join( '&' );

process.env[ 'NODE_TLS_REJECT_UNAUTHORIZED' ] = '0';

class NG
{
    constructor() {
        this.host = 'novayagollandiya.ru';
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

    async getCities() {
        let
            cities = await this.setBody( { action: 'getCities' } ).request(),
            keys = Object.keys( cities );
        for( let k in keys ) {
            //cities[ keys[ k ] ].banners = await this.getBanners( k );
            //cities[ keys[ k ] ].categories = await this.getSections( k );
            cities[ keys[ k ] ].products = await this.getProducts( k );
        }
        return keys
            .map( k => {
                cities[ k ].key = k;
                cities[ k ].siteId = cities[ k ].site_id;
                delete cities[ k ].site_id;
                return cities[ k ];
            });
    }

    async getBanners( city = this.city ) {
        return await this.setBody( { action: 'getBanners', city: city } ).request();
    }

    async getSections( city = this.city ) {
        return ( await this.setBody( { action: 'getSections', city: city } ).request() )
            .map( k => {
                cities[ k ].id = cities[ k ].ID;
                delete cities[ k ].ID;
                cities[ k ].name = cities[ k ].NAME;
                delete cities[ k ].NAME;
                cities[ k ].url = cities[ k ].SECTION_PAGE_URL;
                delete cities[ k ].SECTION_PAGE_URL;
                cities[ k ].parent = cities[ k ].IBLOCK_SECTION_ID;
                delete cities[ k ].IBLOCK_SECTION_ID;
                return cities[ k ];
            });
    }

    async getProducts( city = this.city ) {
        return await this.setBody( { action: 'getProducts', city: city } ).request();
    }
}

module.exports = NG;