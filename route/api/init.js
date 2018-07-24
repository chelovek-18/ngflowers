'use strict';

const
    // express
    express = require( 'express' ),
    router = express.Router(),

    fs = require( 'fs' ),
    //gm = require( 'gm' ),
    
    // api данные
    model = new ( require( './../../model/model' ) )( dbcomplete ),
    ng = new ( require( './../../libs/ng' ) ),
    geo = new ( require( './../../libs/geo' ) ),
    images = new ( require( './../../libs/images' ) ),

    // Периодическое обновление данных
    refreshDatas = async () => {
        // Данные из api-запроса для сравнения
        let
            reqCities = ( await ng.getCities() ) || [],
            isUpd = false;

        // Сравниваем данные из базы и из запроса:
        if ( Object.keys( reqCities ).length ) {
            let
                // Список кодов городов (запрос)
                rKeys = reqCities.map( c => c.key ),
                // Список кодов городов (база)
                keys = cities
                    .map( c => c.key )
                    .reduce(
                        ( o, c ) => {
                            // Отдельно города, которые есть в api (обслуживаются), отдельно которые отключены
                            ~rKeys.indexOf( c )
                                ? o.in.push( c )
                                : o.out.push( c );
                            return o;
                        }, { in: [], out: [] }
                    ),
                // Новые города (которых еще нет в базе)
                rKeysNew = reqCities.filter( c => !~keys.in.indexOf( c.key ) );

            // 1. Отключаем те города, что отсутствуют в API
            for ( let k in cities.filter( c => ~keys.out.indexOf( c.key ) && c.use ) ) {
                await model.cities().update( { key: cities[ k ].key }, { use: false } );
                isUpd = true;
            }

            // 2. Сравниваем по полям
            for ( let k in cities.filter( c => ~keys.in.indexOf( c.key ) ) ) {
                let
                    city = cities[ k ],
                    rCity = reqCities.filter( c => c.key == city.key )[ 0 ],
                    updCity = Object.keys( city )
                        .filter( c => ~[ 'name', 'link', 'siteId' ].indexOf( c ) && city[ c ] != rCity[ c ] )
                        .reduce( ( o, k ) => { o[ k ] = rCity[ k ]; return o; }, {});

                if ( Object.keys( updCity ).length ) {
                    await model.cities().update( { key: city.key }, updCity );
                    isUpd = true;
                }

                // Сравниваем баннеры, категории, товары
                let props = [ 'banners', 'categories', 'products' ];
                for ( let nm in props ) {
                    let
                        prop = props[ nm ],
                        propUpd = false,
                        ids = rCity[ prop ].map( p => parseInt( p.id ) );

                    // Перебираем массив (баннеров, категорий или товаров)
                    rCity[ prop ].forEach( item => {
                        let
                            id = item.id,
                            propItem = city[ prop ]
                                .filter( i => i.id == id )[ 0 ] ||
                                ( city[ prop ].push( { id: id } ), city[ prop ][ city[ prop ].length - 1 ] );

                        // Сравниваем значения и корректируем
                        Object.keys( item ).forEach( p => {
                            if ( item[ p ] != propItem[ p ] ) {
                                propItem[ p ] = item[ p ];
                                propUpd = true;
                            }
                        });
                    });
                    // Отключаем те, которые в api отсутствуют
                    city[ prop ]
                        .filter( i => !~ids.indexOf( i.id ) && i.use )
                        .forEach( i => { i.use = false; propUpd = true; } );
                    
                    if ( propUpd ) {
                        await model.cities().update( { key: city.key }, { [ prop ]: city[ prop ] } );
                        isUpd = true;
                    }

                    // Проверяем наличие сохраненных изображений, сохраняем
                    if ( prop == 'products' ) {
                        let dirpath = `${ global.appConf.location.root }/public/thumbs/${ city.key }`;
                        for ( let p in city[ prop ].filter( i => i.use ) ) {
                            let prod = city[ prop ][ p ];
                            if ( typeof prod.image == 'object' && prod.image.length )
                                for ( let i in prod.image ) {
                                    if ( typeof prod.image[ i ] == 'function' ) continue;
                                    let
                                        img = prod.image[ i ].replace( '/resize_cache/', '/' ).replace( '/80_80_1/', '/' ),
                                        imghttp = `${ city.link }/${ img }`,
                                        imgpath = `${ dirpath }${ img }`,
                                        dirs = imgpath.split( '/' ),
                                        fnm = dirs.pop();
                                    dirs.forEach( ( d, ii ) => {
                                        let dir = dirs.filter( ( fd, fi ) => fi <= ii ).join( '/' );
                                        if ( dir && !fs.existsSync( dir ) )
                                            fs.mkdirSync( dir );
                                    });
                                    if ( !fs.existsSync( imgpath ) )
                                        await images.getImage( city.link, img );
                                }
                        }

                        /*city[ prop ]
                            .filter( i => i.use )
                            .forEach( i => {
                                if ( typeof i.image == 'object' && i.image.length )
                                    i.image.forEach( img => {
                                        let
                                            imghttp = `${ city.link }/${ img.replace( '/resize_cache/', '/' ).replace( '/80_80_1/', '/' ) }`,
                                            imgpath = `${ dirpath }${ img.replace( '/resize_cache/', '/' ).replace( '/80_80_1/', '/' ) }`,
                                            dirs = imgpath.split( '/' ),
                                            fnm = dirs.pop();
                                        dirs.forEach( ( d, ii ) => {
                                            let dir = dirs.filter( ( fd, fi ) => fi <= ii ).join( '/' );
                                            if ( dir && !fs.existsSync( dir ) )
                                                fs.mkdirSync( dir );
                                        });
                                        if ( !fs.existsSync( imgpath ) )
                                            ( async () => {
                                                await images.getImage( city.link, img );
                                            })();

                                        
                                        /*if ( !fs.existsSync( imgpath ) )
                                            images.getImage( city.link.replace( 'https://', '' ), img.replace( '/resize_cache/', '/' ).replace( '/80_80_1/', '/' ) );
                                            /*{ console.log( 'ch.z.ha?' ); jimp.read( await ( new images( city.link, img.replace( '/resize_cache/', '/' ).replace( '/80_80_1/', '/' ) ) ).getImage(), ( err, image ) => {
                                            //{ console.log( 'ch.z.ha?', imgpath ); jimp.read( imghttp, ( err, image ) => {
                                                console.log( '??', imgpath );
                                                if (err) return console.log( err );
                                                console.log( 'image!', image );
                                                image
                                                    .cover( 300, 300 )
                                                    .write( imgpath );
                                            }); }*/
                                            /*{//console.log( 'туц', city.link.replace( 'https://', '' ), img.replace( '/resize_cache/', '/' ).replace( '/80_80_1/', '/' ) );
                                            console.log( 'тыц' );
                                            fs.writeFileSync( imghttp, new Buffer( await images.getImage( city.link.replace( 'https://', '' ), img.replace( '/resize_cache/', '/' ).replace( '/80_80_1/', '/' ) ) ) );
                                            console.log( 'тырыдыц' );
                                            //console.log( 'img buf', await images.getImage( city.link.replace( 'https://', '' ), img.replace( '/resize_cache/', '/' ).replace( '/80_80_1/', '/' ) ) );
                                            //gm( await images.getImage( city.link.replace( 'https://', '' ), img.replace( '/resize_cache/', '/' ).replace( '/80_80_1/', '/' ) ), fnm )
                                            /*gm( imghttp )
                                                .resize( 300, 300 )
                                                .write( imgpath, ( err ) => {
                                                    if ( err ) console.log( 'no done!', err );
                                                    else console.log( 'done!!' );
                                                });}
                                                /*.write( imgpath, function ( err ) {
                                                    if ( !err ) console.log( 'done' );
                                                    else console.log( 'img err', err );
                                                });*/
                                            /*imagemagick.resize({
                                                srcPath: imghttp,
                                                width: 300
                                            }, function( err, stdout, stderr ){
                                                if ( err ) return console.log( err );
                                                fs.writeFileSync( imgpath, stdout, 'binary' );
                                            });*/
                                    //});
                            //});
                    }
                }
            }

            // 3. Добавляем новые
            for ( let k in rKeysNew ) {
                await model.cities().save( rKeysNew[ k ] );
                isUpd = true;
            }
            
            // 4. Сохраняем в cities
            if ( isUpd ) cities = await model.cities().find();
        }

        // Подцепляем к городам геолокацию:
        let geoUpd = false;
        for( let i in cities ) {
            if ( !cities[ i ].location || !cities[ i ].location.length ) {
                if ( !cities[ i ].geo ) {
                    cities[ i ].geo = ( await geo.getCityLocation( cities[ i ].name.replace( / /g, '+' ) ) ).results[ 0 ].geometry.location;
                    cities[ i ].geo = Object.keys( cities[ i ].geo ).map( k => cities[ i ].geo[ k ] );
                } else {
                    cities[ i ].location = cities[ i ].geo;
                    await model.cities().update( { key: cities[ i ].key }, { location: cities[ i ].location } );
                    geoUpd = true;
                }
            }
        }
        if ( geoUpd ) cities = await model.cities().find();
    };

// Данные
let
    cities = [];

// Функция дергается по готовности базы
async function dbcomplete() {
    cities = await model.cities().find();

    let settings = await model.settings().findOne();
    geo.setParams( settings );

    setInterval( refreshDatas, 15000 /*600000*/ );
}

// ------------------------------------- Инициализация -------------------------------------
router.use( async ( req, res, next ) => {
    // Подключение БД
    req.db = model;

    // Геттер и сеттер req.cities
    Object.defineProperty( req, 'cities', {
        get: () => cities,
        set: async cs => {
            for( let k in cs )
                await req.db.cities().update( { key: cs[ k ].key }, cs[ k ] );
            cities = await req.db.cities().find();
            return cs;
        }
    });

    next();
});

module.exports = router;