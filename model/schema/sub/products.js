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
            use: {
                type: Boolean,
                default: true
            }
        });
    }
}

module.exports = ProductsCollection;