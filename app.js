'use strict';

require( './libs/logs' );

// Задаем глобальные конфиги для управления сервером
global.appConf = require( './config/config' );
global.appConf.location.root = __dirname;

const cluster = require( 'cluster' );

// Форкаем процесс для автоматического перезапуска в случае падения
if ( cluster.isMaster ) {
	global.log( 'Процесс-мастер запущен' );

	cluster.fork();
	cluster.on( 'exit', ( worker, code, signal ) => {
		global.log( `Процесс ${ worker.process.pid } прибит` );
		setTimeout( function() {
			cluster.fork();
		}, 1000 );
	});

} else {
	global.log( 'Процесс-форк запущен' );

	new ( require( './route' ) );
}