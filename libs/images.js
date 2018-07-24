'use strict';

const
    Request = require( './request' ),
    fs = require( 'fs' ),
    jimp = require( 'jimp' ),
    dataSerialize = obj => Object.keys( obj ).map( k => k + '=' + obj[ k ] ).join( '&' );


class Images extends Request
{
    constructor() {
        super();
        this.method = 'GET';
        this.dataType = 'image';
    }

    async getImage( url, path, imgpath, fnm ) {
        this.host = url.replace( 'https://', '' );
        this.defaultPath = path.replace( '/resize_cache/', '/' ).replace( '/80_80_1/', '/' );
        return new Promise( async ( r, j ) => {
            let resp = await this.setBody().request();
            resp.pipe( fs.createWriteStream( imgpath ) );
            console.log( 'good' );
            /*setTimeout( () => {
                jimp.read( imgpath ).then( function ( img ) {
                    img.resize( 600, jimp.AUTO ).write( imgpath.replace( fnm, fnm.replace( '.', '-1.' ) ) );
                    img.resize( 300, jimp.AUTO ).write( imgpath.replace( fnm, fnm.replace( '.', '-2.' ) ) );
                    console.log( '-=<ok>=-' );
                    r();
                }).catch( function( err ) {
                    console.log( 'erro!', err );
                    r();
                });
            }, 1000);*/
        });

        return this.setBody().request();
    }

}

module.exports = Images;