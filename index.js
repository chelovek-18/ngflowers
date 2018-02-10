'use strict';

const
	fCount = 3, //require( './config/config' ).forkCount,
	cluster = require( 'cluster' );

if ( cluster.isMaster ) {

	for ( let i = 0; i < fCount; i++ )
		cluster.fork();
	cluster.on( 'exit', ( worker, code, signal ) => {
		console.log( `Процесс ${worker.process.pid} прибит` );
		setTimeout( function() {
			cluster.fork();
		}, 2000 );
	});

} else {

	new ( require( './route' ) );
	
}