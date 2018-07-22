'use strict';

class SettingsCollection
{
    getSchema( Schema ) {
        return new Schema({
            version: {
                type: String,
                unique: true,
                required: true
            },
            phone: {
                type: String
            },
            googleKey: {
                type: String
            }
        });
    }
}

module.exports = SettingsCollection;