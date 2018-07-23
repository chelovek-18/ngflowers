'use strict';

const Request = require( './request' );

class Images extends Request
{
    constructor() {
        super();
        this.method = 'GET';
        this.dataType = 'jpeg';
    }

    async getImage( url, path ) {
        this.host = url.replace( 'https://', '' );
        this.defaultPath = path;
        return await this.setBody().request();
    }

}

module.exports = Images;