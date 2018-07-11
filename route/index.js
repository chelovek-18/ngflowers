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
    wss = new WebSocket.Server({ server }),

    // paths
    viewsPath = global.appConf.location.root + '/views',
    // model
    //model = new ( require( './../model/model' ) ),
    // fs
    fs = require( 'fs' ),
    dir = fs.readdirSync( __dirname + '/api', 'utf8' );

/*let
	routes = [];*/

// Подключаем все js файлы из папки api
/*dir.forEach( ( fnm ) => {
	if ( fnm.split( '.' )[ 1 ] == 'js' ) routes.push( require( './api/' + fnm ) );
});*/


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

        // Web-socket
        //server.listen( global.appConf.location.ws );
        //wss.on( 'connection', function connection( ws ) {
            /*ws.on( 'message', function ( message ) {
                ws.send( `ok, ${ message }` );
            });*/
        //});
    }

    routes() {
        /*routes.forEach( ( route ) => {
            if ( route.use ) app.use( '/app/', route );
        });*/
        //router.get('/attribute-search/', require(__dirname +'/get/attribute-search'));
        app.get( '/bg/', ( req, res, next ) => {
            res.send( `
            <div style="position: absolute; top: 0; left: 0; width: 100%; text-align: center;">
                <img src="img/serv2.png" style="margin: 0 auto;" />
            </div>
            ` )
        });

        /*app.use( ( req, res, next ) => {
            console.log( 'sess', req.session );
            console.log( 'body', req.body );
            if ( !req.session.user ) {
                if (
                    req.body.login
                    && req.body.login == 'admin'
                ) {
                    req.session.user = req.body.login;
                    //res.redirect( '/' );
                    res.status( 200 ).send( 'e-e-e-e!' );
                } else res.status( 401 ).render( 'partials/login' );
            }
        
            else next();
        });*/
        
        // Все маршруты:

        // Инициализация
        app.use( require( './api/init' ) );

        // ?
        app.use( require( './api/cities' ) );

        app.get( '/del/', async ( req, res, next ) => {
            res.send( await req.db.users().delete() );
        });

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