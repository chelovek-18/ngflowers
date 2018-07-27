'use strict';

global.log( 'Инициализация базы' );
const
	// mongoose
	mongoose = require( 'mongoose' ),
	Schema = mongoose.Schema,
	ObjectId = mongoose.Types.ObjectId,

	//
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

// Схемы
let models = dir.reduce(
	( o, f ) => {
		if ( f.split( '.' )[ 1 ] != 'js' ) return o;
		o[ f.slice( 0, -3 ) ] = ( new ( require( './schema/' + f ) ) ); return o;
	}, {});

/**
 * ------------------------------------- Модель -------------------------------------
 */
class Model
{

    // ------------------------------------- Коннект с базой и схемы -------------------------------------
    constructor( dbcomplete ) {
		let self = this;
		( async () => {
			try {
				await mongoose.connect( path );
				Object.keys( models ).forEach( collection => {
					let
						model = models[ collection ],
						schema = model.getSchema( Schema );
		
					model.query = mongoose.model( collection, schema );
					model.query.save = function( data ) {
						return self.query( collection, 'save', data );
					}
					model.query.delete = function( data ) {
						return self.query( collection, 'delete', ( data || {} ) );
					}
		
					self[ collection ] = function() {
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
				dbcomplete();
			} catch( err ) {
				console.log( 'model err', err );
				self.error = err;
			}
		})();
	}

	id( id ) {
		return ObjectId( id );
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
			default:
				return q[ method ].apply( q[ method ], data ).exec();
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