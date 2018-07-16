'use strict';

class ProductsCollection
{
    getSchema( Schema ) {
        return new Schema({
            id: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
            parent: {
                type: Number,
                required: true
            },
            use: {
                type: Boolean,
                default: true
            }
        });
    }
}

module.exports = ProductsCollection;