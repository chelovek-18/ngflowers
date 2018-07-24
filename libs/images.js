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
        this.dataType = 'image';
    }

    async getImage( url, path, imgpath ) {
        this.host = url.replace( 'https://', '' );
        this.defaultPath = path.replace( '/resize_cache/', '/' ).replace( '/80_80_1/', '/' );
        this.imgpath = imgpath;
        return this.setBody().request();
    }

}

module.exports = Images;