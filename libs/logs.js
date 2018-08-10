'use strict';

const fs = require( 'fs' );

global.logs = [];

// Логгирование
global.log = function() {
	let args = [];
	for ( let k in arguments ) args.push( arguments[ k ] );
	global.logs.push( args );
	console.log( ...args );
}

const f0 = n => n > 9 ? n : '0' + n;

setInterval( () => {
    let log = global.logs.shift();
    if ( !log ) return;
    let
        d = new Date(),
        fnm = `${ f0( d.getDate() ) }-${ f0( d.getMonth() + 1 ) }-${ d.getFullYear() }.txt`,
        txts = `${ f0( d.getHours() ) }:${ f0( d.getMinutes() ) } ${ log.join( '    ' ) }\r\n`;

    fs.writeFileSync( `${ global.appConf.location.root }/logs/${ fnm }`, txts, { encoding: 'utf8', flag: 'a' } );
}, 400);


module.exports = true;