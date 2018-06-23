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
                required: true
            },
            hashedPassword: {
                type: String,
                required: true
            },
            salt: {
                type: String,
                required: true
            }
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
        db.users().save( data );
        return data;
    }

    async auth( db, login, password ) {
        let users = await db.users().find();
        console.log( 'users:', users );
        if ( !users.length ) users = [
            await this.create( db, {
                login: global.appConf.user.login,
                password: global.appConf.user.password,
                salt: Math.random() + ''
            })
        ];
        users = users
            .map( u => { u.password = password; return u; } )
            .filter( u => u.login == login && u.hashedPassword == this.hashing( db, u ) );
        return users.length > 0;
    }
}

module.exports = UsersCollection;













/*class UsersCollection
{

    getSchema( Schema ) {
		let schema = new Schema({
			nd: {
				type: Number,
				unique: true,
				required: true
			},
            login: {
				type: String,
				unique: true,
				required: true
            },
			name: {
				type: String,
				required: true
			},
			email: {
				type: String
			},
			department: {
				type: String
			}
		}, {
			autoIndex: global.plugGlobVar.production
		});
		return schema;
	}

	auth( db, auth ) {
        return { 'results': ( async ( function*() {
			let user = yield await ( db.users().findOne( { 'nd': auth.nd } ) );
			if ( !user ) user = yield await ( db.users().save( auth ) );
			else if ( user.login != auth.login || user.name != auth.name || user.email != auth.email || user.department != auth.department )
				yield await ( db.users().update( { 'nd': auth.nd }, auth ) );
			return user;
        }))() };		
	}

}

module.exports = UsersCollection;*/