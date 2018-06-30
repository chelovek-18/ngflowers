'use strict';

const
    crypto = require( 'crypto' );

class UsersCollection
{
    getSchema( Schema ) {
        return new Schema({
            login: {
                type: String,
                unique: true,
                required: true
            },
            name: {
                type: String,
                default: ''
            },
            hashedPassword: {
                type: String,
                required: true
            },
            salt: {
                type: String,
                required: true
            },
            role: {
                type: String,
                default: ''
            }
        }, {
            autoIndex: true
        });
    }

    hashing( db, data ) {
        return crypto
            .createHmac( 'sha1', data.salt )
            .update( data.password )
            .digest( 'hex' );
    }

    async create( db, data ) {
        data.hashedPassword = this.hashing( db, data );
        delete data.password;
        await db.users().save( data );
        return data;
    }

    async auth( db, login, password ) {
        let users = await db.users().find();
        if ( !users.length ) users = [
            await this.create( db, Object.assign( global.appConf.user, { salt:  Math.random() + '' } ) )
        ];
        users = users
            .map( u => { u.password = password; return u; } )
            .filter( u => u.login == login && u.hashedPassword == this.hashing( db, u ) );
        return users.length > 0;
    }
}

module.exports = UsersCollection;