'use strict';

global.appConf = require( './config/config' );
global.appConf.location.root = __dirname;

const cluster = require( 'cluster' );

if ( cluster.isMaster ) {

	for ( let i = 0; i < global.appConf.process.forkCount; i++ )
		cluster.fork();
	cluster.on( 'exit', ( worker, code, signal ) => {
		console.log( `Процесс ${ worker.process.pid } прибит` );
		setTimeout( function() {
			cluster.fork();
		}, 2000 );
	});

} else {

	new ( require( './route' ) );
	
}