'use strict';

const
    express = require( 'express' ),
    app = express();

class Route
{
    constructor() {
        app
            .listen( 80, () => {
                this.allRoutes();
            });
    }

    allRoutes() {
        app.use( function( req, res, next ) {
            res.send( 'ok. fuck.' );
        });
    }
}

module.exports = Route;