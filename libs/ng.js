'use strict';

const Request = require( './request' );

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
        let
            cities = await this.setBody( { action: 'getCities' } ).request(),
            keys = Object.keys( cities );
        for( let k in keys ) {
            cities[ keys[ k ] ].banners = await this.getBanners( k );
            cities[ keys[ k ] ].categories = await this.getSections( k );
            //cities[ keys[ k ] ].products = await this.getProducts( k );
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
        return await this.setBody( { action: 'getBanners', city: city } ).request();
    }

    async getSections( city = this.city ) {
        return ( await this.setBody( { action: 'getSections', city: city } ).request() )
            .map( k => {
                cities[ k ].id = cities[ k ].ID;
                delete cities[ k ].ID;
                cities[ k ].name = cities[ k ].NAME;
                delete cities[ k ].NAME;
                cities[ k ].url = cities[ k ].SECTION_PAGE_URL;
                delete cities[ k ].SECTION_PAGE_URL;
                cities[ k ].parent = cities[ k ].IBLOCK_SECTION_ID;
                delete cities[ k ].IBLOCK_SECTION_ID;
                return cities[ k ];
            });
    }

    async getProducts( city = this.city ) {
        return await this.setBody( { action: 'getProducts', city: city } ).request();
    }
}

module.exports = NG;