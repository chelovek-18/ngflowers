'use strict';

const Request = require( './request' );

/**
 * ------------------------------------- API NG -------------------------------------
 */
class NG extends Request
{
    constructor() {
        super();
        this.host = 'novayagollandiya.ru';
        this.defaultPath = '/inc/ajax/rest.php';
        this.method = 'POST';
        this.defaultData = { key: 'Mdln24nv052=3m' };
        this.city = 'spb';
    }

    async getCities() {
        global.log( 'Получить города' );
        let
            cities = await this.setBody( { action: 'getCities' } ).request(),
            keys = Object.keys( cities );
        for( let k in keys ) {
            cities[ keys[ k ] ].banners = await this.getBanners( k );
            cities[ keys[ k ] ].categories = await this.getSections( k );
            cities[ keys[ k ] ].products = await this.getProducts( k );
        }
        return keys
            .map( k => {
                cities[ k ].key = k;
                cities[ k ].siteId = cities[ k ].site_id;
                delete cities[ k ].site_id;
                return cities[ k ];
            });
    }

    async getBanners( city = this.city ) {
        global.log( 'Получить баннеры города' );
        return await this.setBody( { action: 'getBanners', "filter[city]": city } ).request();
    }

    async getSections( city = this.city ) {
        global.log( 'Получить категории города' );
        return ( await this.setBody( { action: 'getSections', "filter[city]": city } ).request() )
            .map( s => {
                s.id = s.ID;
                delete s.ID;
                s.name = s.NAME;
                delete s.NAME;
                s.url = s.SECTION_PAGE_URL;
                delete s.SECTION_PAGE_URL;
                s.parent = s.IBLOCK_SECTION_ID;
                delete s.IBLOCK_SECTION_ID;
                return s;
            });
    }

    async getProducts( city = this.city ) {
        global.log( 'Получить товары города' );
        return ( await this.setBody( { action: 'getProducts', "filter[city]": city } ).request() )
            .map( p => {
                p.oldPrice = p.oldprice;
                delete p.oldprice;
                return p;
            });
    }
}

module.exports = NG;