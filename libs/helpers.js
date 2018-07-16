'use strict';

let
    page = '',
    roles = [];

let obj = {
    // Математические операции для шаблонизатора
    math: function( a, op, b ) {
        if ( !!~'==!='.indexOf( op ) ) return eval( '"' + a + '"' + ( op ? op : '+' ) + '"' + b + '"' );
        if ( !!~'+-*/'.indexOf( op ) ) return eval( a + op + b );
    },

    // Установки для страницы
    setPage( pageName ) {
        page = pageName;
    },
    setRoles( croles ) {
        roles = croles;
    },

    // Получить установки страницы
    changePage( pageName ) {
        return pageName == page;
    },

    // Рендерим селект с ролями
    getRoleSelect( _id, role = 'admin' ) {
        // Рендерим OPTION'sы:
        let getOptions = () => Object.keys( roles )
                .map(
                    r => `<option${ r == role ? ' checked="checked"' : '' } values="${ r }" prb="${ role }">${ roles[ r ].name }</option>`
                )
                .join( '' );
        return `<select name="${ _id }:role">${ getOptions() }</select>`;
    },

    // Получить новую строку таблицы юзеров
    getUserTr() {
        return `<td><input type="text" name="%%_id%%:name" /></td>
        <td><input type="text" style="width: 150px;" name="%%_id%%:login" /></td>
        <td><input type="password" style="width: 150px;" name="%%_id%%:password" /></td>
        <td>${ obj.getRoleSelect( '%%_id%%' ) }</td>
        <td style="position: relative;"><i class="material-icons redbtn">clear</i></td>`;
    }
}

module.exports = obj;