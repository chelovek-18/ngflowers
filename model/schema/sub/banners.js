'use strict';

class BannersCollection
{
    getSchema( Schema ) {
        return new Schema({
            id: {
                type: Number,
                required: true
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