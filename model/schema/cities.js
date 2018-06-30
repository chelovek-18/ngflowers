'use strict';

class CitiesCollection
{
    getSchema( Schema ) {
        return new Schema({
            key: {
                type: String,
                unique: true,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            link: {
                type: String,
                required: true
            },
            siteId: {
                type: String,
                required: true
            }
        }, {
            autoIndex: true
        });
    }
}

module.exports = CitiesCollection;