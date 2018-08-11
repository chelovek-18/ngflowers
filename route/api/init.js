'use strict';

global.log( 'Инициализация приложения' );
const
    // express
    express = require( 'express' ),
    router = express.Router(),

    // api данные
    model = new ( require( './../../model/model' ) )( dbcomplete ),
    geo = new ( require( './../../libs/geo' ) ),

    // Периодическое обновление данных
    refreshDatas = require( './../../libs/refresh-datas' );

// Данные
let
    cities = [];

// Функция дергается по готовности базы
async function dbcomplete() {
    global.log( 'База инициализирована' );
    // Получаем из базы города со всем, что к ним относится
    cities = ( await model.cities().find() ) || [];

    global.obj = {};
    global.obj.getMaxVers = async () => {
        return ( await model.settings().find() )
            .map( s => s.version )
            .sort( ( versA, versB ) => {
                let a = versA.split( '.' ), b = versB.split( '.' );
                if ( a[ 0 ] != b[ 0 ] ) return a[ 0 ] > b[ 0 ] ? 1 : -1;
                if ( a[ 1 ] != b[ 1 ] ) return a[ 1 ] > b[ 1 ] ? 1 : -1;
                if ( a[ 2 ] != b[ 2 ] ) return a[ 2 ] > b[ 2 ] ? 1 : -1;
                return 0
            }).pop() || '1.0.0';
    }
    // Геттер и сеттер для cities в global
    Object.defineProperty( global.obj, 'cities', {
        get: () => cities,
        set: async cs => {
            if ( !( cs instanceof Array ) ) cs = [ cs ];
            for( let k in cs )
                await model.cities().update( { key: cs[ k ].key }, cs[ k ] );
            cities = await model.cities().find();
            return cs;
        }
    });

    Object.defineProperty( global.obj, 'model', {
        get: () => model
    });

    // Получаем из базы и устанавливаем для геолокации настройки
    let settings = await model.settings().findOne( { version: await global.obj.getMaxVers() } );
    if ( !settings ) await model.settings().save( settings = { version: '1.0.0', phone: '', googleKey: geo.defaultData.key } );
    geo.setParams( settings );

    // Интервал обновлений данных
    setInterval( refreshDatas, global.appConf.settings.refresh );
}

// ------------------------------------- Инициализация -------------------------------------
router.use( async ( req, res, next ) => {
    global.log( 'Инициализация запроса' );
    // Подключение БД
    req.db = model;

    // Геттер и сеттер для cities в req
    Object.defineProperty( req, 'cities', {
        get: () => cities,
        set: cs => global.obj.cities = cs
    });

    next();
});

module.exports = router;