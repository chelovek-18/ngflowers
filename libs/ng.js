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
            newCities = Object.keys( cities ).reduce( ( o, k ) => { cities[ k ].key = k; o.push( cities[ k ] ); return o; }, []);
        for( let n in newCities ) {
            newCities[ n ].banners = await this.getBanners( newCities[ n ].key );
            newCities[ n ].categories = await this.getSections( newCities[ n ].key );
            newCities[ n ].products = await this.getProducts( newCities[ n ].key );
        }
        return newCities
            .map( nc => {
                nc.siteId = nc.site_id;
                delete nc.site_id;
                return nc;
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
                p.main = {
                    vip_bukets: p.vip_bukets,
                    avtor: p.avtor,
                    exclusive: p.exclusive,
                    svadeb: p.svadeb,
                    korobki: p.korobki
                }
                delete p.vip_bukets;
                delete p.avtor;
                delete p.exclusive;
                delete p.svadeb;
                delete p.korobki;
                return p;
            });
    }
}

module.exports = NG;