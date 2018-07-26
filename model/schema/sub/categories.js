'use strict';

class CategoriesCollection
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
                type: Number
            },
            use: {
                type: Boolean,
                default: true
            }
        });
    }
}

module.exports = CategoriesCollection;