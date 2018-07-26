'use strict';

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
    // Получаем из базы города со всем, что к ним относится
    console.log( 'hzhz1' );
    cities = ( await model.cities().find() ) || [];
    global.obj = {};
    Object.defineProperty( global.obj, 'cities', {
        get: () => cities
    });
    console.log( 'hzhz2' );

    Object.defineProperty( global.obj, 'model', {
        get: () => model
    });
    console.log( 'hzhz3' );

    // Получаем из базы и устанавливаем для геолокации настройки
    let settings = await model.settings().findOne();
    geo.setParams( settings );
    console.log( 'hzhz4' );

    // Интервал обновлений данных
    setInterval( refreshDatas, global.appConf.settings.refresh );
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