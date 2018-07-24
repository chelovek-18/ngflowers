'use strict';

const Request = require( './request' );

const
    https = require( 'https' ),
    dataSerialize = obj => Object.keys( obj ).map( k => k + '=' + obj[ k ] ).join( '&' );


class Images extends Request
{
    constructor() {
        super();
        this.method = 'GET';
        this.dataType = 'jpeg';
    }

    async getImage( url, path ) {
        this.host = url.replace( 'https://', '' );
        this.defaultPath = path.replace( '/resize_cache/', '/' ).replace( '/80_80_1/', '/' );
        //let self = this;
        return await this.setBody().request();
        /*try { return https.get( `https://${ self.host }${ self.defaultPath }`, function( resp ) {
            console.log( 'okeok' );
        }); } catch( e ) { console.log( 'eeeeeerrror', e ); }*/
    }

}

module.exports = Images;