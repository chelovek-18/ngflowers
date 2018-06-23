'use strict';

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

    async auth( db, login, password ) {
        //db.users().find()
        return global.appConf.user.login == login && global.appConf.user.password == password;
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