'use strict';

const
    express = require( 'express' ),
    app = express(),
    // model
    //model = new ( require( './../model/model' ) ),
    // fs
    fs = require( 'fs' ),
    dir = fs.readdirSync( __dirname + '/api', 'utf8' );

let
	routes = [];

// Подключаем все js файлы из папки api
dir.forEach( ( fnm ) => {
	if ( fnm.split( '.' )[ 1 ] == 'js' ) routes.push( require( './api/' + fnm ) );
});


class Route
{
    constructor() {
        app
            /*.use( function( req, res, next ) {
                //res.db = model;
            })*/

            .listen( 50001, () => {
                this.allRoutes();
            });
    }

    allRoutes() {
        // Все маршруты
        routes.forEach( ( route ) => {
            if ( route.use ) app.use( '/app/', route );
        });
    }
}

module.exports = Route;