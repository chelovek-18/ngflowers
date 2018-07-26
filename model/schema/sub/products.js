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
                type: String
            },
            price: {
                type: Number,
                required: true
            },
            oldPrice: {
                type: Number,
            },
            image: {
                type: [ String ],
                required: true
            },
            mainImage: {
                type: String,
                required: true
            },
            sostav: {
                type: String
            },
            youtube: {
                type: String
            },
            description: {
                type: String
            },
            offers: {
                type: [ Number ]
            },
            qty: {
                type: Number
            },
            groups: {
                type: [ Number ]
            },
            use: {
                type: Boolean,
                default: true
            }
        });
    }
}

module.exports = ProductsCollection;