'use strict';

const
    express = require( 'express' ),
    app = express();

class Route
{
    constructor() {
        app
            .listen( 50001, () => {
                this.allRoutes();
            });
    }

    allRoutes() {
        app.use( '/q', function( req, res, next ) {
            res.send( 'ok. fuck.' );
        });
    }
}

module.exports = Route;