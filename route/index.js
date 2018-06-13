'use strict';

const
    express = require( 'express' ),
    http = require( 'http' ),
    app = express(),

    server = http.createServer( app ),
    WebSocket = require( 'ws' ),
    wss = new WebSocket.Server({ server }),
    // model
    //model = new ( require( './../model/model' ) ),
    // fs
    fs = require( 'fs' ),
    dir = fs.readdirSync( __dirname + '/api', 'utf8' );

let
	routes = [];

// Подключаем все js файлы из папки api
/*dir.forEach( ( fnm ) => {
	if ( fnm.split( '.' )[ 1 ] == 'js' ) routes.push( require( './api/' + fnm ) );
});*/


class Route
{
    constructor() {
        app
            /*.use( function( req, res, next ) {
                res.db = model;
                next();
            })*/

            .listen( 50001, () => {
                this.allRoutes();
            });

        server.listen( 50002 );
        wss.on( 'connection', function connection( ws ) {
            ws.on( 'message', function ( message ) {
                ws.send( `ok, ${ message }` );
            });
        });
    }

    allRoutes() {
        // Все маршруты
        /*routes.forEach( ( route ) => {
            if ( route.use ) app.use( '/app/', route );
        });*/
        app.get( '/', ( req, res, next ) => {
            res.send( 'Чудо-система' );
        });
        app.get( '/login/', ( req, res, next ) => {
            res.send( `
            <p>Логин</p>
            <input type="text" /><br />
            <p>Пароль</p>
            <input type="password" /><br />
            <script>
                var socket = new WebSocket( 'ws://5.101.180.14:50001' );
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
            <ul style="float: left;">
                <li><a href="#">Настройки</a></li>
                <li><a href="#">Страницы</a></li>
                <li><a href="#">Чат</a></li>
                <li><a href="#">Активность</a></li>
            </ul>
            <div>
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
    }
}

module.exports = Route;