'use strict';

class BannersCollection
{
    getSchema( Schema ) {
        return new Schema({
            id: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                default: ''
            },
            link: {
                type: String,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            use: {
                type: Boolean,
                default: true
            }
        });
    }
}

module.exports = BannersCollection;