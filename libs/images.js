'use strict';

const
    Request = require( './request' ),
    fs = require( 'fs' ),
    jimp = require( 'jimp' );

let onProcess = false;

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
            console.log( 'image saved ' + imgpath );
            // Таймаут между запросами
            setTimeout( () => {
                if ( ~fnm.indexOf( '.gif' ) ) {
                    r();
                } else jimp.read( imgpath ).then( function ( img ) {
                    img.resize( 600, jimp.AUTO ).write( imgpath.replace( fnm, fnm.replace( '.', '-1.' ) ) );
                    img.resize( 300, jimp.AUTO ).write( imgpath.replace( fnm, fnm.replace( '.', '-2.' ) ) );
                    console.log( 'image resize ' + imgpath );
                    r();
                }).catch( function( err ) {
                    console.log( 'resize error', err );
                    r();
                });
            }, 2000);
        });

        return this.setBody().request();
    }

    async imgsExistenceCheck( city, prop ) {
        if ( onProcess ) return;
        onProcess = true;
        let self = this;
        let dirpath = `${ global.appConf.location.root }/public/thumbs/${ city.key }`;
        for ( let p in city[ prop ].filter( i => i.use ) ) {
            let
                prod = city[ prop ][ p ],
                image = prop == 'banners' ? [ prod.image ] : ( prod.image || [] ).map( i => i );
            for ( let i in image ) {
                let
                    img = image[ i ].replace( '/resize_cache/', '/' ).replace( '/80_80_1/', '/' ),
                    imghttp = `${ city.link }${ img }`,
                    imgpath = `${ dirpath }${ img }`,
                    dirs = imgpath.split( '/' ),
                    fnm = dirs.pop(),
                    fnm1 = fnm.replace( '.', '-1.' ),
                    fnm2 = fnm.replace( '.', '-2.' );
                dirs.forEach( ( d, ii ) => {
                    let dir = dirs.filter( ( fd, fi ) => fi <= ii ).join( '/' );
                    if ( dir && !fs.existsSync( dir ) )
                        fs.mkdirSync( dir );
                });
                if ( !fs.existsSync( imgpath ) || !fs.existsSync( imgpath.replace( fnm, fnm1 ) ) || !fs.existsSync( imgpath.replace( fnm, fnm2 ) ) )
                    await self.getImage( city.link, img, imgpath, fnm );
            }
        }
        onProcess = false;
    }

}

module.exports = Images;