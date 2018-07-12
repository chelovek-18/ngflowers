'use strict';

const
	// mongoose
	mongoose = require( 'mongoose' ),
	Schema = mongoose.Schema,

	// -
	crypto = require( 'crypto' ),
	fs = require( 'fs' ),
	
	// options
	path = 'mongodb://'
		+ ( global.appConf.mongodb.user
			? `${ global.appConf.mongodb.user }:${ global.appConf.mongodb.password }@`
			: '' )
		+ ( !~global.appConf.mongodb.host.indexOf( ':' )
			? `${ global.appConf.mongodb.host }:${ global.appConf.mongodb.port }`
			: global.appConf.mongodb.host )
		+ `/${ global.appConf.mongodb.database }`
		+ ( global.appConf.mongodb.replica
			? `?replicaSet=${ global.appConf.mongodb.replica }`
			: '' ),
	dir = fs.readdirSync( __dirname + '/schema', 'utf8' );

mongoose.Promise = global.Promise;

let models = dir.reduce(
	( o, f ) => {
		o[ f.slice( 0, -3 ) ] = ( new ( require( './schema/' + f ) ) ); return o;
	}, {});

	


	/*ObjectId = mongoose.Types.ObjectId,
	Schema = mongoose.Schema,
	conf = global.plugGlobVar.userConf.site.mongoose,
	path = 'mongodb://'
		+ ( conf.username ? conf.username + ':' + conf.password + '@' : '' )
		+ conf.host + ( conf.port && conf.host.split( ':' ).length == 0 ? ':' + conf.port : '' ) + '/'
		+ conf.dbName,
	options = conf.options,
	// fs, etc
	fs = require( 'fs' ),
	dir = fs.readdirSync( __dirname + '/schema', 'utf8' ),
    async = require( './../libs/asyncgen' ).async,
    await = require( './../libs/asyncgen' ).await*/;

	/*mongoose.Promise = global.Promise;

let
	conn = true,
	Models = [],
	models = [];

// Загружаем схемы
dir.forEach( ( fnm ) => {
	if ( fnm.split( '.' )[ 1 ] == 'js' ) models[ fnm.split( '.' )[ 0 ] ] = ( new ( require( './schema/' + fnm ) ) );
});*/

/*
* ------------------------------------- Модель -------------------------------------
*/
class Model
{

    // ------------------------------------- Коннект с базой и схемы -------------------------------------
    constructor() {
		this.connect = mongoose.connect( path, {}, ()=> { console.log('789!'); } );
		Object.keys( models ).forEach( collection => {
			let
				self = this,
				model = models[ collection ],
				schema = model.getSchema( Schema );

			model.query = mongoose.model( collection, schema );
			model.query.save = function( data ) {
				return self.query( collection, 'save', data );
			}
			model.query.delete = function( data ) {
				return self.query( collection, 'delete', ( data || {} ) );
			}
			if ( collection == 'users' ) model.query.hashing = function( data ) {
				return crypto
					.createHmac( 'sha1', data.salt )
					.update( data.password )
					.digest( 'hex' );
			}

			this[ collection ] = function() {
				let args = [ collection ];
				for ( let k in arguments ) args.push( arguments[ k ] );
				return self.query.apply( self, args );
			}

			Object.getOwnPropertyNames( model.__proto__ ).forEach( ( method ) => {
				if (
					method != 'Schema'
					&& method != 'constructor'
					&& typeof model[ method ] == 'function'
				) model.query[ method ] = function() {
					let args = [ self ];
					for ( let k in arguments ) args.push( arguments[ k ] );
					return model[ method ].apply( model, args );
				}
			});
		});

		//this.isConn = mongoose.connect( path, options, this.cbk );
		//this.isConn.connection.on( 'disconnected', function() { conn = false; });
		/*for ( let key in models )
			if ( models[ key ].getSchema ) {
				let
					self = this,
					model = models[ key ],
					schema = model.getSchema( Schema );
				Models[ key ] = mongoose.model( key, schema );
				Models[ key ].save = function( data ) {
					return self.query( key, 'save', data );
				}
				Models[ key ].delete = function( data ) {
					data = data || {};
					return self.query( key, 'delete', data );
				}
				Models[ key ].Aggregate = Models[ key ].aggregate;
				Models[ key ].aggregate = function( data ) {
					data = data || {};
					return self.query( key, 'aggregate', data );
				}
				this[ key ] = function() {
					let args = [ key ];
					for ( let k in arguments ) args.push( arguments[ k ] );
					return self.query.apply( self, args );
				}
				Object.getOwnPropertyNames( model.__proto__ ).forEach( ( meth ) => {
					if ( meth != 'Schema' && meth != 'constructor' && typeof model[ meth ] == 'function' )
						Models[ key ][ meth ] = function() {
							//if ( data ) return self.query.apply( self, model[ meth ]( data ) );
							//else return self.query.apply( self, model[ meth ]() );
							let args = [];
							for ( let k in arguments ) args.push( arguments[ k ] );
							let res = model[ meth ].apply( model, args );
							return res.results ? res.results : self.query.apply( self, res );
						}
				});
			}*/
	}

	hashing( password, salt ) {
		return crypto
			.createHmac( 'sha1', salt )
			.update( password )
			.digest( 'hex' );
	}

	query( collection, method, data ) {

		// Один аргумент - возвращает модель для создания запроса вручную
		if ( !method ) {
			return models[ collection ].query;
		}

		// Два аргумента - подразумевается get
		if ( !data ) return this.query( collection, 'get', method );

		let
			self = this,
			q = models[ collection ].query;
		if ( method == 'save' ) q = new q( data );

		switch ( method ) {
			case 'save':
				return new Promise( ( r, j ) => q.save( ( e, v ) => e ? j( e ) : r( v._id ) ) );
			case 'get':
			case 'find':
				return q.find.apply( models[ collection ].query, data );
			case 'delete':
				return q.deleteMany( data ).exec();
		}
	}

	// ------------------------------------- Каллбэк при ошибке коннекта -------------------------------------
	/*cbk( err ) {
		if ( err ) conn = false;
	}

	// ------------------------------------- Реконнект при потере коннекта -------------------------------------
	reconn() {
		if ( !conn ) this.isConn = mongoose.connect( path, options, this.cbk );
	}

	// ------------------------------------- Проверка коннекта -------------------------------------
	isConnect() {
		this.reconn();
		return this.isConn.then( () => { conn = true; }, err => this.isConn = mongoose.connect( path, options, this.cbk ) );
	}

	// ------------------------------------- Запросы -------------------------------------
	query( collection, method, data ) {

		// Один аргумент - возвращает модель для создания запроса вручную либо join
		if ( typeof method == 'undefined' ) {
			if ( collection instanceof Array ) return this.join( collection );
			if ( typeof collection == 'object' ) return this.join( collection ); // --?
			return Models[ collection ];
		}

		// Два аргумента - подразумевается get
		if ( typeof data == 'undefined' ) return this.query( collection, 'get', method );

		let
			self = this,
			qModel = Models[ collection ],
			q = qModel;
		if ( method == 'post' || method == 'save' ) q = new qModel( data );

		switch ( method ) {
			case 'post':
			case 'save':
				return new Promise( ( r, j ) => q.save( ( e, v ) => e ? j( e ) : r( v._id ) ) );
			case 'delete':
				return q.deleteMany( data ).exec();
			case 'get':
			case 'find':
				return q.find.apply( qModel, data );
			case 'aggregate':
				// aggregate-chaining
				function getObj( data ) {
					let
						agg = q.Aggregate( data ).cursor();
					agg.prom = agg.exec;
					agg.exec = function() {
						let elems = [];
						return new Promise( ( r, j ) => { this.prom().eachAsync( function( v ) { elems.push( v ); }, false, function() { r( elems ); } ) } );
					};
					agg.aggregate = function( a ) {
						data = [].concat( data, a );
						return getObj( data );
					};
					agg.params = function( obj ) { return self.params( this, obj ); };
					agg.count = function() {
						return async ( function*() {
							let res = yield await ( agg.aggregate( { '$count': 'count' } ).exec() );
							return res[ 0 ] ? res[ 0 ].count : 0;
						})();
					}
					return agg;
				}
				return getObj( data );
			default:
				return q[ method ].apply( qModel, data ).exec();
			}

	}

	// ------------------------------------- Склейка коллекций -------------------------------------
	join( jcoll ) {
		let
			coll = jcoll.shift(),
			data = jcoll.map( ( el ) => {
				 return { "$lookup": { "from": el, "localField": el, "foreignField": "nd", "as": el } };
			}),
			q = this.query( coll, 'aggregate', data );

		return q;
	}

	// ------------------------------------- Параметры страницы -------------------------------------
	params( model, obj ) {
		Object.keys( obj ).forEach( ( par ) => model = model[ par ]( obj[ par ] ) );
		return model;
	}*/

}

module.exports = Model;