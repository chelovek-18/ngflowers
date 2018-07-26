'use strict';

const
    // express
    express = require( 'express' ),
    bodyParser = require( 'body-parser' ),
    session = require( 'express-session' ),
    handlebars = require( 'express-handlebars' ),
    app = express(),
    
    // paths
    viewsPath = global.appConf.location.root + '/views';


    /*http = require( 'http' ),

    server = http.createServer( app ),
    WebSocket = require( 'ws' ),
    wss = new WebSocket.Server({ server }),*/

class Route
{
    constructor() {
        // Настройки app и запуск сервера
        app
            .engine( '.html', handlebars({
                'defaultLayout': 'main',
                'layoutsDir': viewsPath,
                'partialsDir': viewsPath,
                'extname': '.html',
                'helpers': require( '../libs/helpers' )
            }))

            .set( 'view engine', '.html' )
            .set( 'views', viewsPath )

            .use( express.static( __dirname + '/../public' ) )
            .use( bodyParser.json() )
            .use( bodyParser.urlencoded( { extended: true } ) )
            .use( session({
                'secret': global.appConf.session.secret,
                'resave': false,
                'saveUninitialized': true,
                'httpOnly': true,
                'cookie': {
                    'expires': new Date( Date.now() + global.appConf.session.maxAge ),
                    'maxAge': global.appConf.session.maxAge
                }
            }))

            .listen( global.appConf.location.port, () => {
                this.routes();
            });

        /*let self = this;

        pem.createCertificate( { days: 1, selfSigned: true }, function ( err, keys ) {
            https.createServer( { key: keys.serviceKey, cert: keys.certificate }, app ).listen( global.appConf.location.port, () => {
                self.routes();
            });
        });*/

        // Web-socket
        //server.listen( global.appConf.location.ws );
        //wss.on( 'connection', function connection( ws ) {
            /*ws.on( 'message', function ( message ) {
                ws.send( `ok, ${ message }` );
            });*/
        //});
    }

    routes() {
        // Маршруты:

        // Инициализация
        app.use( require( './api/init' ) );

        // API
        app.use( require( './api/api' ) );

        // Авторизация
        app.use( require( './api/auth' ) );

        // Админка
        app.use( require( './api/admin' ) );

        // Обработка ошибок
        app.use( ( err, req, res, next ) => {
            res.send( err );
        });
    }
}

module.exports = Route;