'use strict';

// Задаем глобальные конфиги для управления сервером
global.appConf = require( './config/config' );
global.appConf.location.root = __dirname;

const cluster = require( 'cluster' );

// Форкаем процесс для автоматического перезапуска в случае падения
if ( cluster.isMaster ) {

	cluster.fork();
	cluster.on( 'exit', ( worker, code, signal ) => {
		console.log( `Процесс ${ worker.process.pid } прибит` );
		setTimeout( function() {
			cluster.fork();
		}, 1000 );
	});

} else {

	new ( require( './route' ) );
	
}