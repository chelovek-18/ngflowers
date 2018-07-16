'use strict';

let
    BannersSchema = new ( require('./sub/banners') )();

class CitiesCollection
{
    getSchema( Schema ) {
		let
			bannersSchema = BannersSchema.getSchema( Schema );
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
			banners: {
				type: [ bannersSchema ]
			}
        }, {
            autoIndex: true
        });
    }
}

module.exports = CitiesCollection;