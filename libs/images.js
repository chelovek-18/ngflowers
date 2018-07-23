'use strict';

const Request = require( './request' );

class Images extends Request
{
    constructor( url, path ) {
        super();
        this.host = url;
        this.defaultPath = path;
        this.method = 'GET';
        this.dataType = 'jpeg';
    }

    async getImage() {
        return await this.setBody( { } ).request();
    }

}

module.exports = Images;