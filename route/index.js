'use strict';

const
    // express
    express = require( 'express' ),
    bodyParser = require( 'body-parser' ),
    session = require( 'express-session' ),
    handlebars = require( 'express-handlebars' ),
    app = express(),


    http = require( 'http' ),

    server = http.createServer( app ),
    WebSocket = require( 'ws' ),
    wss = new WebSocket.Server({ server }),
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
                'layoutsDir': './../views',
                'partialsDir': './../views',
                'extname': '.html'
            }))

            .set( 'view engine', '.html' )
            .set( 'views', './../views' )

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
            /*.use( function( req, res, next ) {
                res.db = model;
                next();
            })*/

            .listen( global.appConf.location.port, () => {
                this.routes();
            });

        // Web-socket
        server.listen( global.appConf.location.ws );
        wss.on( 'connection', function connection( ws ) {
            /*ws.on( 'message', function ( message ) {
                ws.send( `ok, ${ message }` );
            });*/
        });
    }

    routes() {
        // Все маршруты
        /*routes.forEach( ( route ) => {
            if ( route.use ) app.use( '/app/', route );
        });*/
        app.use( ( req, res, next ) => {
            if ( !req.session.user ) {
                if (
                    req.body.login
                    && req.body.login == 'admin'
                ) req.body.user = req.body.login;
                else throw 401;
            }

            next();
        });

        app.get( '/', ( req, res, next ) => {
            res.send( 'Чудо-система' );
        });
        app.get( '/bg/', ( req, res, next ) => {
            res.send( `
            <div style="position: absolute; top: 0; left: 0; width: 100%; text-align: center;">
                <img src="img/serv.png" style="margin: 0 auto;" />
            </div>
            ` )
        });
        app.get( '/login/', ( req, res, next ) => {
            res.send( `
            <p>Логин</p>
            <input type="text" /><br />
            <p>Пароль</p>
            <input type="password" /><br />
            <script>
                var socket = new WebSocket( 'ws://5.101.180.14:50002' );
                socket.onopen = function() {
                    console.log( 'ws open!' );
                    setTimeout( () => {
                        socket.send( 'proverka' );
                    }, 1500);
                }
                socket.onmessage = function( message ) {
                    console.log( 'ws message! ' + message );
                }
                socket.onerror = function( e ) {
                    console.log( 'ws error! ' + e )
                }
                socket.onclose = function( e ) {
                    console.log( 'ws close! ' + e )
                }
            </script>
            ` )
        });
        app.get( '/admin/', ( req, res, next ) => {
            res.send(`
            <ul style="float: left; height: 500px; margin-right: 50px;">
                <li><h1>Меню</h1></li>
                <li><a href="#">Настройки</a></li>
                <li><a href="#">Страницы</a></li>
                <li><a href="#">Чат</a></li>
                <li><a href="#">Активность</a></li>
            </ul>
            <div>
                <p>&nbsp;</p>
                <h1>Настройки</h1>
                <p>Порт</p>
                <input type="text" value="50001" /><br />
                <p>База</p>
                <input type="text" value="ngflowers" /><br />
                <p>Логин</p>
                <input type="text" value="ngroot" /><br />
                <p>Пароль</p>
                <input type="password" value="ngpas" /><br />
                <hr />
                <h1>Пользователи</h1>
                <table>
                    <tr>
                        <td> Имя </td>
                        <td> Логин </td>
                        <td> Пароль </td>
                        <td> Роль </td>
                    </tr>
                    <tr>
                        <td> <input type="text" value="Сергей" /> </td>
                        <td> <input type="text" value="serg007" /> </td>
                        <td> <input type="password" value="ngr" /> </td>
                        <td> <select><option>Root</option><option>Admin</option></select> </td>
                    </tr>
                    <tr>
                        <td> <input type="text" value="Антон" /> </td>
                        <td> <input type="text" value="anton008" /> </td>
                        <td> <input type="password" value="ngr" /> </td>
                        <td> <select><option>Root</option><option>Admin</option></select> </td>
                    </tr>
                </table>
            </div>
            `);
        });

        app.use( ( err, req, res, next ) => {
            if ( err == 401 ) res.render( 'partials/login', {} );
            /*res.send(`
            <form method="POST" action="/">
                <p>Логин</p>
                <input type="text" name="login" /><br />
                <p>Пароль</p>
                <input type="password"name="password" /><br />
            </form>
            `);*/
            else res.send( err );
        });
    }
}

module.exports = Route;