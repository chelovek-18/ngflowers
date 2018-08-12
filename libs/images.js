'use strict';

const
    Request = require( './request' ),
    fs = require( 'fs' ),
    jimp = require( 'jimp' ),
    { GifUtil } = require( 'gifwrap' );

/**
 * ------------------------------------- Работа с изображениями -------------------------------------
 */
class Images extends Request
{
    constructor() {
        super();
        this.method = 'GET';
        this.dataType = 'image';
    }

    // Получить изображение и сохранить к себе + сделать resize
    async getImage( url, path, imgpath, fnm ) {
        this.host = url.replace( 'https://', '' );
        this.defaultPath = path.replace( '/resize_cache/', '/' ).replace( '/80_80_1/', '/' );
        return new Promise( async ( r, j ) => {
            let resp = await this.setBody().request();
            resp.pipe( fs.createWriteStream( imgpath ) );
            global.log( 'Сохранено изображение', imgpath );
            // Таймаут между запросами чтобы не перегружать сервак
            setTimeout( () => {
                if ( ~fnm.indexOf( '.gif' ) ) {
                    global.log( "Изображение gif" );
                    GifUtil.read( imgpath ).then( inputGif => {
                        global.log( "gif read" );
                        inputGif.frames.forEach( frame => {
                            global.log( "gif frame" );
                            let k = frame.bitmap.width / frame.bitmap.height;
                            frame.reframe( 0, 0, 600, 600 / k );
                        });
                        return GifUtil.write( imgpath.replace( fnm, fnm.replace( '.', '-1.' ) ), inputGif.frames, inputGif ).then( outputGif => {
                            console.log( "Resize gif 1" );
                            setTimeout( () => {
                                r();
                            }, 2000);
                        });
                    }).catch( err => console.log( 'gif err?', err ); );
                    /*GifUtil.read( imgpath ).then( inputGif => {
                        inputGif.frames.forEach( frame => {
                            let k = frame.bitmap.width / frame.bitmap.height;
                            frame.reframe( 0, 0, 300, 300 * k );
                        });
                        return GifUtil.write( imgpath.replace( fnm, fnm.replace( '.', '-2.' ) ), inputGif.frames, inputGif ).then( outputGif => {
                            console.log( "Resize gif 2" );
                        });
                    });
                    GifUtil.read( imgpath ).then( inputGif => {
                        inputGif.frames.forEach( frame => {
                            let k = frame.bitmap.width / frame.bitmap.height;
                            frame.reframe( 0, 0, 150, 150 * k );
                        });
                        return GifUtil.write( imgpath.replace( fnm, fnm.replace( '.', '-3.' ) ), inputGif.frames, inputGif ).then( outputGif => {
                            console.log( "Resize gif 3" );
                        });
                    });*/
                    //fs.createReadStream( imgpath ).pipe( fs.createWriteStream( imgpath.replace( fnm, fnm.replace( '.', '-1.' ) ) ) );
                    //fs.createReadStream( imgpath ).pipe( fs.createWriteStream( imgpath.replace( fnm, fnm.replace( '.', '-2.' ) ) ) );
                    /*setTimeout( () => {
                        r();
                    }, 2000);*/
                } else jimp.read( imgpath ).then( function ( img ) {
                    img.resize( 600, jimp.AUTO ).write( imgpath.replace( fnm, fnm.replace( '.', '-1.' ) ) );
                    img.resize( 300, jimp.AUTO ).write( imgpath.replace( fnm, fnm.replace( '.', '-2.' ) ) );
                    img.resize( 150, jimp.AUTO ).write( imgpath.replace( fnm, fnm.replace( '.', '-3.' ) ) );
                    global.log( 'Resize', imgpath );
                    r();
                }).catch( function( err ) {
                    global.log( 'Ошибка resize', imgpath, err );
                    fs.createReadStream( imgpath ).pipe( fs.createWriteStream( imgpath.replace( fnm, fnm.replace( '.', '-1.' ) ) ) );
                    fs.createReadStream( imgpath ).pipe( fs.createWriteStream( imgpath.replace( fnm, fnm.replace( '.', '-2.' ) ) ) );
                    fs.createReadStream( imgpath ).pipe( fs.createWriteStream( imgpath.replace( fnm, fnm.replace( '.', '-3.' ) ) ) );
                    setTimeout( () => {
                        r();
                    }, 2000);
                });
            }, 2000);
        });

        return this.setBody().request();
    }

    // Перебор изображений товаров и баннеров и сохранение их к себе
    async imgsExistenceCheck( city, prop ) {
        global.log( `Обработка изображений ${ prop } ${ city.name }` );
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
                    fnm2 = fnm.replace( '.', '-2.' ),
                    fnm3 = fnm.replace( '.', '-3.' );
                dirs.forEach( ( d, ii ) => {
                    let dir = dirs.filter( ( fd, fi ) => fi <= ii ).join( '/' );
                    if ( dir && !fs.existsSync( dir ) )
                        fs.mkdirSync( dir );
                });
                if ( !fs.existsSync( imgpath ) || !fs.existsSync( imgpath.replace( fnm, fnm1 ) ) || !fs.existsSync( imgpath.replace( fnm, fnm2 ) ) || !fs.existsSync( imgpath.replace( fnm, fnm3 ) ) )
                    await self.getImage( city.link, img, imgpath, fnm );
            }
        }
        // Удаление лишних дерикторий
        let chDirs = fs.readdirSync( dirpath + '/upload/iblock', 'utf8' );
        for ( let n in chDirs ) {
            let cd = chDirs[ n ];
            if (
                ( city.products.filter( p => p.image.filter( im => ~im.indexOf( '/' + cd ) ).length ).length
                + city.banners.filter( p => ~p.image.indexOf( '/' + cd ) ).length ) == 0
            ) {
                global.log( `remove dir ${ dirpath + '/upload/iblock/' + cd }:` );
                let files = fs.readdirSync( dirpath + '/upload/iblock/' + cd ) || [];
                for ( let kf in files ) {
                    fs.unlinkSync( dirpath + '/upload/iblock/' + cd + '/' + files[ kf ] );
                }
                fs.rmdir( dirpath + '/upload/iblock/' + cd );
            }
        }
    }

}

module.exports = Images;