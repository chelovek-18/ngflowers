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
    return;
    await model.settings().save();
    // Получаем из базы города со всем, что к ним относится
    cities = ( await model.cities().find() ) || [];
    global.obj = {};
    Object.defineProperty( global.obj, 'cities', {
        get: () => cities
    });

    Object.defineProperty( global.obj, 'model', {
        get: () => model
    });

    // Получаем из базы и устанавливаем для геолокации настройки
    let settings = await model.settings().findOne();
    global.log( 'settings:', settings );
    //global.log( 'geo:', Object.keys( geo ) );
    //if ( !settings ) {
        //await model.settings().save( { version: '1.0.0', phone: '', googleKey: 'AIzaSyAQc5Tfg8shWq24eTkwWzshLG0p58ZLH7M' } );
        //settings = await model.settings().findOne();
    //}
    //geo.setParams( settings );

    // Интервал обновлений данных
    //setInterval( refreshDatas, global.appConf.settings.refresh );
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