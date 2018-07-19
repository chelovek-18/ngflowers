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
            price: {
                type: Number,
                required: true
            },
            oldPrice: {
                type: Number,
                required: true
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