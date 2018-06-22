'use strict';

global.appConf = require( './config/config' );
global.appConf.location.root = __dirname;
global.appConf.session.maxAge += 10800000;

const cluster = require( 'cluster' );

/*const fork = require( 'child_process' ).fork;

let forks = [];

let env = {
	isWorker: true
}

if ( !process.env.isWorker ) for ( let i = 0; i < global.appConf.process.forkCount; i++ ) {
	forks.push( fork( __dirname + '/app.js', [], { env: env } ) );
} else {
	console.log( 'new worker!' );

	new ( require( './route' ) );
}*/

if ( cluster.isMaster ) {

	//for ( let i = 0; i < global.appConf.process.forkCount; i++ )
		cluster.fork();
	cluster.on( 'exit', ( worker, code, signal ) => {
		console.log( `Процесс ${ worker.process.pid } прибит` );
		setTimeout( function() {
			cluster.fork();
		}, 2000 );
	});

} else {
	console.log( 'new worker!' );

	new ( require( './route' ) );
	
}