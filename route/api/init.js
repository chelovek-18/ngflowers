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
    // Геттер и сеттер для cities
    Object.defineProperty( global.obj, 'cities', {
        get: () => cities,
        set: async cs => {
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
    let settings = await model.settings().findOne();
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

    req.cities = global.obj.cities;

    next();
});

module.exports = router;