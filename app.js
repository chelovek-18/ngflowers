'use strict';

global.appConf = require( './config/config' );
global.appConf.location.root = __dirname;
global.log = () => {
	console.log( arguments );
}

const cluster = require( 'cluster' );

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