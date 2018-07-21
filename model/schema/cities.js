'use strict';

let
    BannersSchema = new ( require('./sub/banners') )(),
    CategoriesSchema = new ( require('./sub/categories') )(),
    ProductsSchema = new ( require('./sub/products') )();

class CitiesCollection
{
    getSchema( Schema ) {
		let
            bannersSchema = BannersSchema.getSchema( Schema ),
            categoriesSchema = CategoriesSchema.getSchema( Schema ),
            productsSchema = ProductsSchema.getSchema( Schema );
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
            },
            use: {
                type: Boolean,
                default: true
            },
            location: {
                type: [ Number ]
            },
			banners: {
				type: [ bannersSchema ]
			},
			categories: {
				type: [ categoriesSchema ]
			},
			products: {
				type: [ productsSchema ]
			}
        }, {
            autoIndex: true
        });
    }
}

module.exports = CitiesCollection;