'use strict';

const
    express = require( 'express' ),
    app = express();

class Route
{
    constructor() {
        app
            .listen( 37773, () => {
                this.allRoutes();
            });
    }

    allRoutes() {
        app.use( '/q', function( req, res, next ) {
            res.send( 'ok. fuck.' );
        });

        app.use( function( req, res, next ) {
            throw 404;
        });
    }
}

module.exports = Route;