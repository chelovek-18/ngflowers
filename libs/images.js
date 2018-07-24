'use strict';

const Request = require( './request' );

const
    fs = require( 'fs' ),
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
        //this.imgpath = imgpath;
        return new Promise( async ( r, j ) => {
            console.log( 'e0' );
            let resp = await this.setBody().request();
            console.log( 'e1' );
            r( await resp.pipe( await fs.createWriteStream( imgpath ) ) );
            console.log( 'e2' );
        });

        return this.setBody().request();
    }

}

module.exports = Images;