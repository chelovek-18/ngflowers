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
        let self = this;
        //return await this.setBody().request();
        return https.get( `https://${ self.host }${ defaultPath }`, function( resp ) {
            console.log( 'okeok' );
        });
    }

}

module.exports = Images;